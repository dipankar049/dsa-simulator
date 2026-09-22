"use client";

import { SPEED_OPTIONS } from "@/lib/simulation";

export default function SpeedSelector({ speed, onSpeedChange, className = "" }) {
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <span>Speed</span>
            <div className="flex rounded-md border border-borderStrong bg-surface p-0.5">
                {SPEED_OPTIONS.map((opt) => (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onSpeedChange(opt.id)}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors sm:px-2 sm:py-1 sm:text-xs ${
                            speed === opt.id
                                ? "bg-accent text-white"
                                : "text-muted hover:bg-element hover:text-ink"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
