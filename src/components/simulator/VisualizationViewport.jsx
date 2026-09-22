"use client";

export default function VisualizationViewport({
    title = "Array Visualizer",
    subtitle,
    showSortedBadge = false,
    children,
}) {
    return (
        <div className="mt-5 overflow-hidden rounded-xl border border-border bg-bg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
                <div>
                    <div className="text-sm font-semibold text-ink">{title}</div>
                    {subtitle && (
                        <div className="mt-0.5 text-xs text-muted">{subtitle}</div>
                    )}
                </div>
                {showSortedBadge && (
                    <span className="rounded-full bg-sorted/10 px-2.5 py-1 text-xs font-medium text-sorted">
                        Sorted ✓
                    </span>
                )}
            </div>
            <div className="overflow-x-auto p-4 sm:p-5">{children}</div>
        </div>
    );
}
