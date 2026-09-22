# DSA Simulator — Refactor Roadmap

Living guide for incremental refactors. Work on branch `refactor/code-optimization` in small PRs.

## Current routes

| Route | Feature |
|-------|---------|
| `/` | Home |
| `/array-operations` | Static & dynamic arrays |
| `/linked-list-operations` | Singly & doubly linked lists |
| `/bubble-sort` | Bubble sort |
| `/selection-sort` | Selection sort |
| `/merge-sort` | Merge sort |
| `/quick-sort` | Quick sort |
| `/linear-search` | Linear search |
| `/binary-search` | Binary search |

## Routing & SEO (non-negotiable)

- Public paths listed above must remain **unchanged** (indexed in Google Search Console).
- Internal refactors may reorganize `src/features/`, `src/lib/`, etc.; route entrypoints stay at `src/app/<path>/page.*`.
- No path renames, no removals, and no URL changes without explicit approval, redirects, and Search Console updates.

## Target architecture

- `src/lib/algorithms/` — pure step builders (no React)
- `src/lib/simulation/` — pacing, delays, cell styles, swap transforms
- `src/hooks/` — `useStepPlayback`, `useSortPlayback`
- `src/components/simulator/` — shared simulator UI
- `src/features/<domain>/` — thin composers + algorithm-specific visualization

**Color rule:** static cell states use Tailwind semantic classes; inline styles only for swap transforms.

## Manual test checklist (use per migration PR)

1. Create array (length, NULL slots)
2. Push, insert at index, delete by index/value
3. Run algorithm / operation to completion
4. Step forward and backward; play and pause
5. Change speed (slow / normal / fast)
6. Toggle light and dark theme
7. Collapse and expand the simulator `<details>` section (persists via localStorage)
8. Mobile width (~375px): controls usable, array scrolls horizontally if needed

## Steps — status

### Step 0 — Baseline (done)

### Step 1 — Folder layout (done)

### Step 2 — Shared simulation constants (done)

### Step 3 — Shared UI components (done)

### Step 4 — `useStepPlayback` (done)

### Step 5 — Sorts (done for core; polish optional)

- All sort step builders in `src/lib/algorithms/`
- `swapTransform.js`; Bubble uses shared swap helper
- **Full shared shell + `useSortPlayback`:** Bubble, Selection
- **Algorithms + local UI:** Quick Sort, Merge Sort (merge tree still in client; `nodeKey` exported from algorithm module)

### Step 6 — Search (done)

- Linear + Binary: step builders, `useStepPlayback`, shared shell components (Binary retains custom viz for low/high/mid pointers)

### Step 7 — Arrays and linked lists (done — foundation)

- `lib/simulation/timing.js` — shared `delay()`
- Array operation clients use shared `delay` import; toast CSS centralized in `providers.js`
- `components/linked-list/LinkedListNode.jsx` for reuse when linked-list UI is refactored

### Step 8 — Responsive system (done — foundation)

- `--shell-sidebar-width`, `--sim-cell-size`, `--sim-gap` in `globals.css`
- Main content: full width on `md`, sidebar offset from `lg` via CSS variable
- `VisualizationViewport` used on migrated visualizers

### Step 9 — Animation unification (done — foundation)

- Single `SWAP_SLIDE_MS` and pacing floors in `lib/simulation/pacing.js`
- Shared `animate-fade-in` in theme; step callouts use `StepCallout`

### Step 10 — PWA (done — foundation)

- `src/app/manifest.js` (install metadata, icon from `/icon.png`)
- Offline service worker can be added later (e.g. Serwist) without URL changes

### Step 11 — Documentation (done)

- `README.md` updated for Next.js
- Removed unused `useThemeColors.js`
- Duplicate `react-toastify` CSS imports removed from feature clients

## Optional follow-ups

- Migrate Quick Sort / Merge Sort to `useSortPlayback` + full simulator shell (like Selection)
- Extract `MergeSortTree.jsx` from `MergeSortClient.jsx`
- Wire `LinkedListNode` into singly/doubly clients
- Add service worker for offline app shell

## Out of scope (unless requested)

TypeScript migration, visual regression automation, backend/auth, changing educational copy.
