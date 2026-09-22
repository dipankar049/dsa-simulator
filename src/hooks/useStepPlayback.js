"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Shared step-by-step playback for algorithm visualizers.
 *
 * @param {object} options
 * @param {number} options.speedMs - base delay from speed selector
 * @param {(step: object|null) => number} options.getFrameDelay - ms before auto-advance
 * @param {(step: object|null, stepIndex: number) => void} [options.onStepChange] - fired when step index changes during an active session
 * @param {boolean} [options.enableKeyboard=true] - arrow keys + space when session is active
 * @param {string[]} [options.pauseOnStepTypes] - stop auto-play when the current step type matches
 */
export function useStepPlayback({
    speedMs,
    getFrameDelay,
    onStepChange,
    enableKeyboard = true,
    pauseOnStepTypes = [],
}) {
    const [steps, setSteps] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);

    const directionRef = useRef("forward");
    const onStepChangeRef = useRef(onStepChange);
    onStepChangeRef.current = onStepChange;

    const currentStep = isSessionActive ? steps[stepIndex] ?? null : null;

    const progressRatio =
        steps.length > 1 ? stepIndex / (steps.length - 1) : 0;

    const clearSession = useCallback(() => {
        setSteps([]);
        setStepIndex(0);
        setIsPlaying(false);
        setIsSessionActive(false);
        directionRef.current = "forward";
    }, []);

    const startSession = useCallback((newSteps, { autoPlay = true } = {}) => {
        setSteps(newSteps);
        setStepIndex(0);
        setIsSessionActive(true);
        directionRef.current = "forward";
        setIsPlaying(autoPlay);
    }, []);

    const goNext = useCallback(() => {
        setIsPlaying(false);
        directionRef.current = "forward";
        setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, [steps.length]);

    const goPrev = useCallback(() => {
        setIsPlaying(false);
        directionRef.current = "backward";
        setStepIndex((i) => Math.max(i - 1, 0));
    }, []);

    const togglePlay = useCallback(() => {
        if (stepIndex >= steps.length - 1) {
            directionRef.current = "forward";
            setStepIndex(0);
            setIsPlaying(true);
            return;
        }

        directionRef.current = "forward";
        setIsPlaying((playing) => !playing);
    }, [stepIndex, steps.length]);

    const restart = useCallback(() => {
        directionRef.current = "forward";
        setStepIndex(0);
        setIsPlaying(true);
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // Auto-advance while playing
    useEffect(() => {
        if (!isSessionActive || !isPlaying || !steps.length) return;

        if (stepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }

        const step = steps[stepIndex];
        const delayMs = getFrameDelay(step);

        const timer = setTimeout(() => {
            directionRef.current = "forward";
            setStepIndex((i) => Math.min(i + 1, steps.length - 1));
        }, delayMs);

        return () => clearTimeout(timer);
    }, [
        isSessionActive,
        isPlaying,
        stepIndex,
        steps,
        speedMs,
        getFrameDelay,
    ]);

    // Notify consumer when the visible step changes
    useEffect(() => {
        if (!isSessionActive) return;
        const step = steps[stepIndex] ?? null;

        if (step && pauseOnStepTypes.includes(step.type)) {
            setIsPlaying(false);
        }

        onStepChangeRef.current?.(step, stepIndex);
    }, [isSessionActive, stepIndex, steps, pauseOnStepTypes]);

    // Keyboard: ← / → step, space toggles play
    useEffect(() => {
        if (!enableKeyboard || !isSessionActive) return;

        const handler = (e) => {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            } else if (e.key === " ") {
                e.preventDefault();
                togglePlay();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [enableKeyboard, isSessionActive, goNext, goPrev, togglePlay]);

    return {
        steps,
        stepIndex,
        isPlaying,
        isSessionActive,
        currentStep,
        directionRef,
        progressRatio,
        startSession,
        clearSession,
        goNext,
        goPrev,
        togglePlay,
        restart,
        pause,
    };
}
