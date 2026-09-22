export const SELECTION_SORT_STEP_ACTIONS = {
    start: { iconKey: "Play", label: "Starting", tone: "accent" },
    compare: { iconKey: "ArrowLeftRight", label: "Comparing", tone: "comparing" },
    "new-minimum": { iconKey: "ArrowDown", label: "New minimum", tone: "pivot" },
    "no-change": { iconKey: "CheckCircle2", label: "No change", tone: "secondary" },
    swap: { iconKey: "ArrowLeftRight", label: "Swapping", tone: "swapping" },
    "swap-animating": { iconKey: "ArrowLeftRight", label: "Swapping", tone: "swapping" },
    "swap-done": { iconKey: "CheckCircle2", label: "Swap complete", tone: "sorted" },
    "no-swap": { iconKey: "CheckCircle2", label: "No swap needed", tone: "secondary" },
    sorted: { iconKey: "CheckCircle2", label: "Sorted", tone: "sorted" },
    default: { iconKey: "ArrowLeftRight", label: "Processing", tone: "secondary" },
};
