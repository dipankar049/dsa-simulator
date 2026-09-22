"use client";

import { ArrowLeftRight } from "lucide-react";
import { resolveStepAction, toneClassFor } from "@/lib/simulation";

export default function StepCallout({
    stepKey,
    step,
    actionMap,
    message,
}) {
    if (!message) return null;

    const action = resolveStepAction(step, actionMap);
    const Icon = action?.icon ?? ArrowLeftRight;

    return (
        <div className="mb-4 mt-3" aria-live="polite">
            <div
                key={stepKey}
                className={`animate-fade-in flex items-center gap-3 rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${toneClassFor(action?.tone)}`}
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface sm:h-9 sm:w-9">
                    <Icon
                        size={17}
                        strokeWidth={2.2}
                        className="shrink-0"
                        color="blue"
                    />
                </div>
                <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white opacity-70 sm:text-[11px]">
                        {action?.label ?? "Processing"}
                    </div>
                    <div className="mt-0.5 break-words text-xs font-medium leading-relaxed text-ink sm:text-sm">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
}
