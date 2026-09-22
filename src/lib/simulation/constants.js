/** Shared timing for all step-based visualizers. */

export const SPEED_OPTIONS = [
    { id: "slow", label: "Slow", ms: 1900 },
    { id: "normal", label: "Normal", ms: 1200 },
    { id: "fast", label: "Fast", ms: 550 },
];

export const DEFAULT_SPEED_ID = "normal";

export const SWAP_SLIDE_MS = 320;

/** Pixel width of one array cell (must match layout / swap translate math). */
export const CELL_WIDTH = 56;

export function getSpeedMs(speedId) {
    const fallback = SPEED_OPTIONS.find((o) => o.id === DEFAULT_SPEED_ID)?.ms ?? 1200;
    return SPEED_OPTIONS.find((o) => o.id === speedId)?.ms ?? fallback;
}
