# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Local development runs inside Docker (no host Node install required):

```bash
docker compose up --build   # start Vite dev server with hot reload at http://localhost:5173/n-tillbaka.spel/
docker compose down         # stop
```

Equivalent host-side commands (if you have Node installed locally) via `npm`:

```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build — type-checks then produces dist/
npm run preview   # preview the production build locally
```

There is no test suite and no lint script configured in this repo. `npm run build` is the primary correctness check (it runs the TypeScript project build via `tsc -b` before bundling, so type errors fail the build).

Deployment is automatic: pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys `dist/` to GitHub Pages via `actions/deploy-pages`. There's no manual deploy command.

**If `package-lock.json` ever needs regenerating**, do not delete it and reinstall on a single platform (e.g. via `docker run --platform linux/amd64 ...`) — this silently collapses the lockfile down to only that platform's `@rollup/rollup-*` optional native binary and breaks everyone else (this happened twice: once to CI, once to local Apple Silicon Docker dev). Regenerate with a completely clean `node_modules` + `package-lock.json` and **no forced `--platform`**, i.e. matching `docker compose build`'s native behavior exactly — that produces the full multi-platform set (`linux-x64-gnu`, `linux-arm64-musl`, etc.) that both CI (`ubuntu-latest`, x64/glibc) and local dev (Apple Silicon, arm64/musl via `node:22-alpine`) need. Verify both afterward: `docker compose up --build` locally, and `docker run --rm --platform linux/amd64 node:22 sh -c "npm ci && npm run build"` to simulate CI.

## Architecture

This is a client-only React + Vite + TypeScript app (no backend, no router, no external state library) implementing an n-back memory training game. All state is either component state or localStorage — persistence and game logic are deliberately kept in a couple of small custom hooks rather than a framework.

**Game state machine** (`src/hooks/useNBackGame.ts`): a single hook owns the entire round lifecycle as one `GameState` object with a `phase: 'select' | 'playing' | 'summary'`. Components are dumb renderers of this state; all transitions go through the hook's exposed actions (`startRound`, `respond`, `reset`). `respond(isMatch)` is a single combined action — it records the response for the current trial *and* advances to the next one (or, on the last trial, computes a `RoundResult` inline and flips to `summary`) — so a user always needs exactly one tap per trial rather than a separate "confirm" and "next" step. This is the only place scoring logic lives.

**Stimulus reveal timing** (`src/components/StimulusDisplay.tsx`): each trial briefly blanks the stimulus card (`BLANK_DURATION_MS`) before revealing the next item, so it's obvious a new trial started even when two consecutive stimuli happen to be identical by chance (the generator only guarantees no accidental match at the exact n-back position, not against the immediately preceding trial). This is local component timing state, not game state — `useNBackGame` doesn't know about it. The guard that skips the blank on the very first trial compares against a `lastHandledTrial` ref rather than a one-shot boolean; a one-shot flag broke under React StrictMode's dev-only double effect invocation (the second invocation would slip past a flag already flipped by the first), causing trial 1 to render blank. Keep this in mind if this component is touched again — any "only do X once" guard here needs to be idempotent across repeated effect firings, not a single-use flag.

**Trial generation** (`src/lib/sequenceGenerator.ts`): `generateSequence(items, n, length, targetMatchRate)` builds the trial array. It forces ~30% of eligible trials (`i >= n`) to be true matches, and explicitly re-rolls non-match trials that would *accidentally* equal the n-back item — this matters for small item pools like the 9-digit number set where random collisions are otherwise likely.

**Stimulus types as data, not code** (`src/lib/stimulusSets.ts` + `src/lib/types.ts`): `STIMULUS_SETS` is just an array of `{ id, items }`. Every component and the generator only ever handle plain `string` items — there is no per-type branching anywhere. Adding a new stimulus type (e.g. shapes, sounds) means adding one array entry here plus one label entry per language in `i18n.ts`; no other file needs to change.

**Levels and round length as data** (`src/lib/levels.ts`): `LEVELS` (currently `[1, 2, 3]`) and `ROUND_LENGTHS` (currently `[10, 20, 30]`) are plain const arrays; adding an option is a one-line change. Both are user-selectable on the start screen (`LevelSelect` / `RoundLengthSelect`) and persisted (see localStorage keys below); `roundLength` is passed into `startRound` per round rather than being a global constant. Note `App.tsx` coerces a persisted `lastLevel` that isn't in `LEVELS` back to `LEVELS[0]` (via the derived `level`) so a value saved before an option was removed — e.g. the dropped level 4 — doesn't leave the picker unselected or silently run an out-of-range level.

**i18n** (`src/lib/i18n.ts`): no i18n library — `TRANSLATIONS: Record<Language, Translation>` is a plain object with one key per UI string (plus a `stimulusLabels` map and a couple of functions like `trialProgress(current, total)` for strings with interpolated values). Components that need text take a `t: Translation` prop (the whole object, not individual strings) so adding new UI text never requires touching component prop signatures. `App.tsx` selects the active `Translation` via `TRANSLATIONS[language]` and passes `t` down. Adding a language means adding one entry to `LANGUAGES` and one full `Translation` object to `TRANSLATIONS` — every component picks it up automatically.

**Tactile/audio feedback**: every button has `active:scale-95` for a press effect. Color feedback on buttons uses **both** `hover:` and `active:` variants — `hover:` is scoped to hover-capable devices (see the `@media (hover: hover)` plugin in `tailwind.config.js`) so touchscreens don't get stuck-hover, and `active:` provides the on-press color for touch (which is why `index.html`'s `<body>` carries an empty `ontouchstart` — iOS Safari ignores `:active` without a touch handler on an ancestor). Click sound is handled by `src/hooks/useClickSound.ts`, which synthesizes a short tone via the Web Audio API (no audio assets) — it's wired up once in `App.tsx` via a single `onClickCapture` listener on the root container that checks `event.target.closest('button')`, rather than threading a click handler through every button in every component. Adding a new button anywhere automatically gets the sound for free. A separate `src/hooks/useTadaSound.ts` plays a cheerful arpeggio once when a round finishes, fired from the same `summary`-phase effect that appends history. Both sound hooks take the `soundEnabled` flag and no-op when muted.

**Persistence** (`src/hooks/useLocalStorage.ts`): a generic `useLocalStorage<T>(key, initialValue)` hook, used directly in `App.tsx` for six independent keys, all namespaced `nback:`:
- `nback:lastLevel`, `nback:lastStimulusType`, `nback:roundLength`, `nback:language`, `nback:soundEnabled` — pre-fill the select screen on return visits.
- `nback:history` — a capped array (`HISTORY_LIMIT = 50` in `App.tsx`) of `RoundResult`s, appended via a `useEffect` watching `state.phase`/`state.lastResult` when a round completes.

There is no context/provider layer — `App.tsx` is the sole place that wires localStorage state, the game hook, and translations together and passes props down to presentational components in `src/components/`.

**GitHub Pages base path**: `vite.config.ts` sets `base: '/n-tillbaka.spel/'` because this deploys as a GitHub project page (`halderex.github.io/n-tillbaka.spel/`), not a user/org root page. If the repo is ever renamed or moved to a custom domain/user page, this must be updated or asset URLs will 404 in production (this bug won't show up in `npm run dev` or `preview`, only on the actual deployed subpath).

**Docker dev setup**: `Dockerfile` + `docker-compose.yml` are dev-only (bind-mount source, anonymous volume on `node_modules`, `CHOKIDAR_USEPOLLING=true` for reliable hot reload across the macOS↔container filesystem boundary). Production has no Docker involvement — the GitHub Actions workflow builds directly on `ubuntu-latest` runners.
