# n-tillbaka.spel

A calm, casual [n-back](https://en.wikipedia.org/wiki/N-back) memory training game. No timers, no stress, no competition — you move through the game entirely at your own pace.

Play it at **https://halderex.github.io/n-tillbaka.spel/**

## How to play

You're shown a sequence of items one at a time — letters, numbers, or emoji pictures, your choice. For each new item, ask yourself: *was this the same item shown N steps back?* Tap **"This matches!"** or **"No match"** — one tap both answers and moves you to the next item, so there's never more than a single click per item. There's no clock and no penalty for taking your time — look as long as you like before deciding. You can also tap **Cancel** at any point to abandon the round and return to the start screen.

At the end of a round you get a friendly summary (matches caught, matches missed, extra flags) and a short history of your recent rounds, so you can casually track how you're doing over time without any pressure to "win."

- **Levels**: choose 1-back through 4-back — how many steps back you need to remember.
- **Stimulus types**: letters, numbers, or pictures (emoji).
- **Language**: English or Svenska.
- **Sound**: a soft click on every tap, with an on/off toggle if you'd rather play in silence.

Your last-used level, stimulus type, language, sound preference, and recent round history are remembered locally in your browser between visits — nothing is sent to a server.

## Development

Local development runs in Docker, so no Node install is required on your machine:

```bash
docker compose up --build
```

Then visit `http://localhost:5173/n-tillbaka.spel/`. Source changes hot-reload automatically.

If you have Node installed locally, the equivalent commands are:

```bash
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build
```

## Deployment

Pushing to `main` builds the app and deploys it to GitHub Pages automatically via `.github/workflows/deploy.yml` — no manual steps required.

## Tech stack

React, TypeScript, Vite, and Tailwind CSS. No backend, no database — all state lives in the browser (React state during a round, `localStorage` between visits).
