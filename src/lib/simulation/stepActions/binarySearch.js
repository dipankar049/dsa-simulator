export const BINARY_SEARCH_STEP_ACTIONS = {
    start: { iconKey: "Search", label: "Starting search", tone: "accent" },
    compare: { iconKey: "ArrowLeftRight", label: "Comparing", tone: "comparing" },
    "move-left": { iconKey: "ArrowLeft", label: "Move left", tone: "pivot" },
    "move-right": { iconKey: "ArrowRight", label: "Move right", tone: "pivot" },
    found: { iconKey: "CheckCircle2", label: "Found", tone: "sorted" },
    "not-found": { iconKey: "CheckCircle2", label: "Not found", tone: "swapping" },
    default: { iconKey: "Search", label: "Processing", tone: "secondary" },
};
