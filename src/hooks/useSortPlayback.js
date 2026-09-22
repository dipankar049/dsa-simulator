"use client";

import { useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useStepPlayback } from "./useStepPlayback";

/**
 * Sort visualizers: wraps useStepPlayback with sorted-frame handling.
 */
export function useSortPlayback({
    speedMs,
    getFrameDelay,
    onSortedStep,
    sortedToastMessage = "Array is sorted!",
}) {
    const sortedToastShownRef = useRef(false);

    const handleStepChange = useCallback(
        (step) => {
            if (step?.type !== "sorted") return;

            onSortedStep?.(step);

            if (!sortedToastShownRef.current) {
                toast.success(sortedToastMessage);
                sortedToastShownRef.current = true;
            }
        },
        [onSortedStep, sortedToastMessage]
    );

    const {
        clearSession,
        startSession,
        isSessionActive,
        ...playbackRest
    } = useStepPlayback({
        speedMs,
        getFrameDelay,
        onStepChange: handleStepChange,
        pauseOnStepTypes: ["sorted"],
    });

    const resetSortPlayback = useCallback(() => {
        sortedToastShownRef.current = false;
        clearSession();
    }, [clearSession]);

    const startSortPlayback = useCallback(
        (generatedSteps) => {
            sortedToastShownRef.current = false;
            startSession(generatedSteps);
        },
        [startSession]
    );

    return {
        ...playbackRest,
        isSessionActive,
        isSorting: isSessionActive,
        clearSession,
        startSession,
        resetSortPlayback,
        startSortPlayback,
    };
}
