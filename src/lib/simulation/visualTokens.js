/**
 * Visual tokens for simulators.
 *
 * Rule: static cell / callout colors → Tailwind classes (or CELL_STATE_STYLE for
 * legacy inline during migration). Dynamic motion (swap translate) → inline style only.
 */

/** Step callout banner tones (border + background + text). */
export const TONE_CLASSES = {
    accent: "border-accent/30 bg-accent/5 text-accent",
    comparing: "border-comparing/30 bg-comparing/10 text-comparing-text",
    swapping: "border-swapping/30 bg-swapping/10 text-swapping-text",
    sorted: "border-sorted/30 bg-sorted/10 text-sorted-text",
    pivot: "border-pivot/30 bg-pivot/10 text-pivot-text",
    frontier: "border-frontier/30 bg-frontier/10 text-frontier-text",
    visited: "border-visited/30 bg-visited/10 text-visited-text",
    secondary: "border-border bg-surface text-secondary",
};

/**
 * Semantic cell states for array visualizers.
 * Prefer CELL_STATE_CLASS in new UI; CELL_STATE_STYLE matches existing inline usage.
 */
export const CELL_STATE = {
    default: "default",
    comparing: "comparing",
    swapping: "swapping",
    sorted: "sorted",
    pivot: "pivot",
    frontier: "frontier",
    visited: "visited",
};

export const CELL_STATE_CLASS = {
    default: "border border-border bg-element text-ink",
    comparing: "border-2 border-comparing bg-comparing text-comparing-text",
    swapping: "border-2 border-swapping bg-swapping text-swapping-text",
    sorted: "border-2 border-sorted bg-sorted text-sorted-text",
    pivot: "border-2 border-pivot bg-pivot text-pivot-text",
    frontier: "border-2 border-frontier bg-frontier text-frontier-text",
    visited: "border-2 border-visited bg-visited text-visited-text",
};

/** Inline styles for cells when class-based theming is not yet wired. */
export const CELL_STATE_STYLE = {
    comparing: {
        backgroundColor: "rgb(var(--color-comparing))",
        borderColor: "rgb(var(--color-comparing))",
        color: "rgb(var(--color-comparing-text))",
    },
    swapping: {
        backgroundColor: "rgb(var(--color-swapping))",
        borderColor: "rgb(var(--color-swapping))",
        color: "rgb(var(--color-swapping-text))",
    },
    sorted: {
        backgroundColor: "rgb(var(--color-sorted))",
        borderColor: "rgb(var(--color-sorted))",
        color: "rgb(var(--color-sorted-text))",
    },
    pivot: {
        backgroundColor: "rgb(var(--color-pivot))",
        borderColor: "rgb(var(--color-pivot))",
        color: "rgb(var(--color-pivot-text))",
    },
    frontier: {
        backgroundColor: "rgb(var(--color-frontier))",
        borderColor: "rgb(var(--color-frontier))",
        color: "rgb(var(--color-frontier-text))",
    },
    visited: {
        backgroundColor: "rgb(var(--color-visited))",
        borderColor: "rgb(var(--color-visited))",
        color: "rgb(var(--color-visited-text))",
    },
};

/** StateLegend token names align with CELL_STATE keys (except default). */
export const LEGEND_STATE_TOKENS = [
    "comparing",
    "swapping",
    "sorted",
    "pivot",
    "frontier",
    "visited",
];

export function toneClassFor(tone) {
    return TONE_CLASSES[tone] ?? TONE_CLASSES.secondary;
}
