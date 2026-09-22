# DSA Simulator

Interactive web app for learning data structures and algorithms, built with **Next.js** (App Router) and **React**.

**Live:** [dsa-simulator-three.vercel.app](https://dsa-simulator-three.vercel.app/)

## Features

- Array operations (static and dynamic)
- Linked lists (singly and doubly)
- Sorting: bubble, selection, merge, quick
- Searching: linear and binary
- Step-by-step visualizers with playback controls
- Light / dark theme

## Tech stack

- Next.js 16, React 19
- Tailwind CSS v4
- react-toastify

## Project layout

```
src/
  app/              # Routes (URLs — do not rename without SEO plan)
  components/       # Shared UI, including components/simulator/
  features/         # Page-level feature modules
  hooks/            # useStepPlayback, useSortPlayback
  lib/algorithms/   # Pure step generators
  lib/simulation/   # Pacing, tokens, swap transforms
```

See [REFACTOR_ROADMAP.md](./REFACTOR_ROADMAP.md) for the incremental refactor plan.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```
