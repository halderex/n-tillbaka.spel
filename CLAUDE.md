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

## Architecture

This is a client-only React + Vite + TypeScript app (no backend, no router, no external state library) implementing an n-back memory training game. All state is either component state or localStorage — persistence and game logic are deliberately kept in a couple of small custom hooks rather than a framework.

**Game state machine** (`src/hooks/useNBackGame.ts`): a single hook owns the entire round lifecycle as one `GameState` object with a `phase: 'select' | 'playing' | 'summary'`. Components are dumb renderers of this state; all transitions go through the hook's exposed actions (`startRound`, `markMatch`, `advance`, `reset`). When `advance()` is called on the last trial, it computes a `RoundResult` (correct matches/missed matches/false alarms/correct rejections) inline and flips to `summary` — this is the only place scoring logic lives.

**Trial generation** (`src/lib/sequenceGenerator.ts`): `generateSequence(items, n, length, targetMatchRate)` builds the trial array. It forces ~30% of eligible trials (`i >= n`) to be true matches, and explicitly re-rolls non-match trials that would *accidentally* equal the n-back item — this matters for small item pools like the 9-digit number set where random collisions are otherwise likely.

**Stimulus types as data, not code** (`src/lib/stimulusSets.ts` + `src/lib/types.ts`): `STIMULUS_SETS` is just an array of `{ id, items }`. Every component and the generator only ever handle plain `string` items — there is no per-type branching anywhere. Adding a new stimulus type (e.g. shapes, sounds) means adding one array entry here plus one label entry per language in `i18n.ts`; no other file needs to change.

**Levels as data** (`src/lib/levels.ts`): `LEVELS` is a plain const array (currently `[1, 2, 3, 4]`) and `ROUND_LENGTH` is a single constant (currently 20 trials). Adding a level is a one-line change.

**i18n** (`src/lib/i18n.ts`): no i18n library — `TRANSLATIONS: Record<Language, Translation>` is a plain object with one key per UI string (plus a `stimulusLabels` map and a couple of functions like `trialProgress(current, total)` for strings with interpolated values). Components that need text take a `t: Translation` prop (the whole object, not individual strings) so adding new UI text never requires touching component prop signatures. `App.tsx` selects the active `Translation` via `TRANSLATIONS[language]` and passes `t` down. Adding a language means adding one entry to `LANGUAGES` and one full `Translation` object to `TRANSLATIONS` — every component picks it up automatically.

**Persistence** (`src/hooks/useLocalStorage.ts`): a generic `useLocalStorage<T>(key, initialValue)` hook, used directly in `App.tsx` for three independent keys, all namespaced `nback:`:
- `nback:lastLevel`, `nback:lastStimulusType`, `nback:language` — pre-fill the select screen on return visits.
- `nback:history` — a capped array (`HISTORY_LIMIT = 50` in `App.tsx`) of `RoundResult`s, appended via a `useEffect` watching `state.phase`/`state.lastResult` when a round completes.

There is no context/provider layer — `App.tsx` is the sole place that wires localStorage state, the game hook, and translations together and passes props down to presentational components in `src/components/`.

**GitHub Pages base path**: `vite.config.ts` sets `base: '/n-tillbaka.spel/'` because this deploys as a GitHub project page (`halderex.github.io/n-tillbaka.spel/`), not a user/org root page. If the repo is ever renamed or moved to a custom domain/user page, this must be updated or asset URLs will 404 in production (this bug won't show up in `npm run dev` or `preview`, only on the actual deployed subpath).

**Docker dev setup**: `Dockerfile` + `docker-compose.yml` are dev-only (bind-mount source, anonymous volume on `node_modules`, `CHOKIDAR_USEPOLLING=true` for reliable hot reload across the macOS↔container filesystem boundary). Production has no Docker involvement — the GitHub Actions workflow builds directly on `ubuntu-latest` runners.
