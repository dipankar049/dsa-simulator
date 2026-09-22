import { SWAP_SLIDE_MS } from "./constants";

/**
 * Delay before auto-advancing to the next frame.
 * @param {string} stepType - frame type from step generator
 * @param {number} baseMs - selected speed base (from getSpeedMs)
 * @param {Record<string, number>} pacingTable - per-type multipliers
 * @param {{ minMs?: number, swapAnimatingFloor?: boolean }} [options]
 */
export function getFrameDelay(stepType, baseMs, pacingTable, options = {}) {
    const minMs = options.minMs ?? 200;
    const useSwapFloor = options.swapAnimatingFloor ?? true;
    const floor =
        useSwapFloor && stepType === "swap-animating"
            ? SWAP_SLIDE_MS + 80
            : minMs;

    return Math.max(
        floor,
        Math.round(baseMs * (pacingTable[stepType] ?? 1))
    );
}

/** Bubble sort frame pacing (relative to speed base ms). */
export const BUBBLE_SORT_FRAME_PACING = {
    start: 0.5,
    compare: 1,
    "decide-swap": 0.95,
    "decide-no-swap": 0.8,
    "swap-animating": 0.55,
    "swap-done": 0.7,
    "pass-end": 0.9,
    sorted: 0.5,
};

export function getBubbleSortFrameDelay(stepType, baseMs) {
    return getFrameDelay(stepType, baseMs, BUBBLE_SORT_FRAME_PACING);
}

export const SELECTION_SORT_FRAME_PACING = {
    start: 0.5,
    compare: 1,
    "new-minimum": 0.9,
    "no-change": 0.75,
    swap: 0.85,
    "swap-animating": 0.55,
    "swap-done": 0.7,
    "no-swap": 0.75,
    sorted: 0.5,
};

export function getSelectionSortFrameDelay(stepType, baseMs) {
    return getFrameDelay(stepType, baseMs, SELECTION_SORT_FRAME_PACING);
}

export const LINEAR_SEARCH_FRAME_PACING = {
    start: 0.6,
    compare: 1,
    found: 0.8,
    "not-found": 0.8,
};

export function getLinearSearchFrameDelay(stepType, baseMs) {
    return getFrameDelay(stepType, baseMs, LINEAR_SEARCH_FRAME_PACING, {
        minMs: 250,
        swapAnimatingFloor: false,
    });
}

export const BINARY_SEARCH_FRAME_PACING = {
    start: 0.6,
    compare: 1,
    "move-left": 0.9,
    "move-right": 0.9,
    found: 0.8,
    "not-found": 0.8,
};

export function getBinarySearchFrameDelay(step, baseMs) {
    const type = step?.type;
    const pacing = BINARY_SEARCH_FRAME_PACING[type] ?? 1;
    return Math.max(250, Math.round(baseMs * pacing));
}

export const QUICK_SORT_FRAME_PACING = {
    start: 0.5,
    "choose-pivot": 0.7,
    compare: 1,
    "move-left": 0.85,
    "swap-animating": 0.55,
    "swap-done": 0.7,
    "pivot-animating": 0.55,
    "pivot-done": 0.7,
    "partition-done": 0.8,
    sorted: 0.5,
};

export function getQuickSortFrameDelay(stepType, baseMs) {
    const swapTypes = ["swap-animating", "pivot-animating"];
    const floor = swapTypes.includes(stepType) ? SWAP_SLIDE_MS + 80 : 200;
    return Math.max(
        floor,
        Math.round(baseMs * (QUICK_SORT_FRAME_PACING[stepType] ?? 1))
    );
}

export const MERGE_SORT_SPEED_OPTIONS = [
    { id: "slow", label: "Slow", ms: 2600 },
    { id: "normal", label: "Normal", ms: 1400 },
    { id: "fast", label: "Fast", ms: 650 },
];

export const MERGE_SORT_FRAME_PACING = {
    start: 0.75,
    "divide-start": 0.9,
    divide: 0.9,
    "divide-done": 0.75,
    "merge-start": 0.9,
    compare: 1.15,
    "take-left": 0.9,
    "take-right": 0.9,
    "merge-done": 1,
    sorted: 0.75,
};

export function getMergeSortFrameDelay(stepType, baseMs, speedId = "normal") {
    const speedMultiplier =
        speedId === "slow" ? 1.25 : speedId === "fast" ? 0.9 : 1;

    return Math.max(
        250,
        Math.round(
            baseMs *
                (MERGE_SORT_FRAME_PACING[stepType] ?? 1) *
                speedMultiplier
        )
    );
}

export function getMergeSortSpeedMs(speedId) {
    const fallback = MERGE_SORT_SPEED_OPTIONS.find((o) => o.id === "normal")?.ms ?? 1400;
    return MERGE_SORT_SPEED_OPTIONS.find((o) => o.id === speedId)?.ms ?? fallback;
}
