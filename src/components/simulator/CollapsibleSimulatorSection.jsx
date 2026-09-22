"use client";

import { useContext } from "react";
import { DetailsStateContext } from "@/context/DetailsContext";

export default function CollapsibleSimulatorSection({
    detailsId,
    title,
    defaultOpen = true,
    children,
}) {
    const { detailsState, updateState } = useContext(DetailsStateContext);
    const isOpen =
        detailsState[detailsId] !== undefined
            ? detailsState[detailsId]
            : defaultOpen;

    return (
        <details
            id={detailsId}
            className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
            onToggle={(e) => updateState(detailsId, e.target.open)}
            open={isOpen}
        >
            <summary className="cursor-pointer select-none px-4 py-4 text-base font-semibold text-ink marker:text-accent transition-colors hover:bg-bg/50 sm:px-5 sm:text-lg md:text-xl">
                {title}
            </summary>
            <div className="px-4 pb-5 sm:px-5">{children}</div>
        </details>
    );
}
