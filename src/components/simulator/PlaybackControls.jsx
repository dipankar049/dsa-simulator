"use client";

import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Square,
} from "lucide-react";

export default function PlaybackControls({
    stepIndex,
    stepsLength,
    isPlaying,
    onPrev,
    onTogglePlay,
    onNext,
    onRestart,
    onStop,
}) {
    const atStart = stepIndex === 0;
    const atEnd = stepIndex >= stepsLength - 1;

    return (
        <div className="flex w-full items-center gap-1.5 sm:gap-2">
            <button
                type="button"
                onClick={onPrev}
                disabled={atStart}
                className="opBtn opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs sm:flex-none sm:px-3 sm:text-sm"
            >
                <ChevronLeft size={15} className="shrink-0 sm:h-[17px] sm:w-[17px]" />
                <span>Prev</span>
            </button>

            <button
                type="button"
                onClick={onTogglePlay}
                className="opBtn opBtn-primary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs sm:flex-none sm:px-3 sm:text-sm"
            >
                {isPlaying ? (
                    <>
                        <Pause size={15} className="shrink-0 sm:h-[17px] sm:w-[17px]" />
                        <span className="sm:inline">Pause</span>
                    </>
                ) : (
                    <>
                        <Play size={15} className="shrink-0 sm:h-[17px] sm:w-[17px]" />
                        <span className="sm:inline">Play</span>
                    </>
                )}
            </button>

            <button
                type="button"
                onClick={onNext}
                disabled={atEnd}
                className="opBtn opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs sm:flex-none sm:px-3 sm:text-sm"
            >
                <span>Next</span>
                <ChevronRight size={15} className="shrink-0 sm:h-[17px] sm:w-[17px]" />
            </button>

            <button
                type="button"
                onClick={onRestart}
                aria-label="Restart"
                title="Restart"
                className="opBtn opBtn-secondary flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
            >
                <RotateCcw size={15} className="sm:h-[17px] sm:w-[17px]" />
                <span className="hidden text-sm sm:inline">Restart</span>
            </button>

            <button
                type="button"
                onClick={onStop}
                aria-label="Stop"
                title="Stop"
                className="opBtn-danger flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
            >
                <Square size={14} className="sm:h-4 sm:w-4" />
                <span className="hidden text-sm sm:inline">Stop</span>
            </button>
        </div>
    );
}
