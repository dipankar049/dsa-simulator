/** Step callout metadata for merge sort. */

export const MERGE_SORT_STEP_ACTIONS = {
    start: { iconKey: "Play", label: "Starting", tone: "accent" },
    "divide-start": { iconKey: "Split", label: "Divide", tone: "accent" },
    divide: { iconKey: "Split", label: "Splitting", tone: "accent" },
    "divide-done": { iconKey: "Split", label: "Split complete", tone: "secondary" },
    "merge-start": { iconKey: "Merge", label: "Merging", tone: "accent" },
    compare: { iconKey: "ArrowLeftRight", label: "Comparing", tone: "comparing" },
    "take-left": { iconKey: "ChevronLeft", label: "Taking from left", tone: "secondary" },
    "take-right": { iconKey: "ChevronRight", label: "Taking from right", tone: "secondary" },
    "merge-done": { iconKey: "CheckCircle2", label: "Merged", tone: "sorted" },
    sorted: { iconKey: "CheckCircle2", label: "Sorted", tone: "sorted" },
    default: { iconKey: "ArrowLeftRight", label: "Processing", tone: "secondary" },
};
