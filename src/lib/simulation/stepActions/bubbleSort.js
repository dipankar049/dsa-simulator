/** Step callout metadata for bubble sort (icons resolved via resolveStepAction). */

export const BUBBLE_SORT_STEP_ACTIONS = {
    start: { iconKey: "Play", label: "Starting", tone: "accent" },
    compare: { iconKey: "ArrowLeftRight", label: "Comparing", tone: "comparing" },
    "decide-swap": { iconKey: "ArrowLeftRight", label: "Out of order", tone: "swapping" },
    "decide-no-swap": { iconKey: "CheckCircle2", label: "No swap needed", tone: "secondary" },
    "swap-animating": { iconKey: "ArrowLeftRight", label: "Swapping", tone: "swapping" },
    "swap-done": { iconKey: "CheckCircle2", label: "Swap complete", tone: "sorted" },
    "pass-end": { iconKey: "CheckCircle2", label: "Pass complete", tone: "sorted" },
    sorted: { iconKey: "CheckCircle2", label: "Sorted", tone: "sorted" },
    default: { iconKey: "ArrowLeftRight", label: "Processing", tone: "secondary" },
};
