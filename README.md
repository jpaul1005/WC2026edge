# WC2026 EDGE — Polymarket Strategy Dashboard

A personal prediction market strategy tool for the 2026 FIFA World Cup. Connects to live Polymarket odds and gives you a full bracket builder, edge calculator, and position tracker.

## Features

- **Odds Board** — Live Polymarket prices for all WC 2026 markets, grouped by tier. Auto-refreshes every 60s with a live countdown. Falls back to a realistic snapshot if the API is unavailable.
- **My Bracket** — Full 48-team / 12-group format. Drag-reorder teams in each group, select 8 best 3rd-place qualifiers, then generate the R32 knockout bracket and pick winners through to the champion.
- **Edge Finder** — Automatically populated from your bracket picks. Compares your implied win probability against Polymarket odds and surfaces value bets and overpriced markets. Manual probability override per team.
- **Position Tracker** — Log real or hypothetical Polymarket positions. Live P&L, cash-out value, and a stage-by-stage price projection table.
- **Scenarios** — Create, name, duplicate, and switch between multiple independent bracket/position scenarios. All data persists in `localStorage`.

## Setup

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Vercel

```bash
# One-time install
npm i -g vercel

# Deploy
vercel --prod
```

The included `vercel.json` handles SPA routing so deep links work correctly.

Alternatively, connect your GitHub repo in the Vercel dashboard — it will auto-detect Vite and deploy on every push.

## Polymarket API

The app tries `https://gamma-api.polymarket.com/markets` for live data. If CORS blocks the request (expected in some browser environments), it falls back to a hardcoded odds snapshot automatically. No API key required.

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3 (custom dark navy theme)
- React Context + `useReducer` for state
- `localStorage` for persistence
- Pure frontend — no backend, no auth
