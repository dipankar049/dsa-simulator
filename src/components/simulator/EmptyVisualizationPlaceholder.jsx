"use client";

export default function EmptyVisualizationPlaceholder({
    title = "No array to visualize",
    description = "Create an array above to start experimenting.",
}) {
    return (
        <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-element text-muted">
                ∅
            </div>
            <p className="text-sm font-medium text-ink">{title}</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                {description}
            </p>
        </div>
    );
}
