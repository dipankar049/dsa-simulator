"use client";

import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { DetailsStateContext } from '@/context/DetailsContext';
import StateLegend from '@/components/StateLegend';
import { toast } from 'react-toastify';
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Square,
    ArrowLeftRight,
    CheckCircle2,
} from "lucide-react";

const OPERATION_TABS = [
    { id: 'create', label: 'Create' },
    { id: 'pushpop', label: 'Push / Pop' },
    { id: 'insert', label: 'Insert' },
    { id: 'delete', label: 'Delete' },
];

const SPEED_OPTIONS = [
    { id: 'slow', label: 'Slow', ms: 1900 },
    { id: 'normal', label: 'Normal', ms: 1200 },
    { id: 'fast', label: 'Fast', ms: 550 },
];

// Relative pacing per frame type — comparisons/decisions get full reading
// time, the swap slide gets a short (floor-protected) beat, transitional
// frames are quick. Multiplied against the selected speed's base ms.
const FRAME_PACING = {
    start: 0.5,
    compare: 1,
    'decide-swap': 0.95,
    'decide-no-swap': 0.8,
    'swap-animating': 0.55,
    'swap-done': 0.7,
    'pass-end': 0.9,
    sorted: 0.5,
};

const SWAP_SLIDE_MS = 320; // must match the CSS transition duration below

function getFrameDelay(type, baseMs) {
    const floor = type === 'swap-animating' ? SWAP_SLIDE_MS + 80 : 200;
    return Math.max(floor, Math.round(baseMs * (FRAME_PACING[type] ?? 1)));
}



function getStepAction(step) {
    if (!step) return null;

    switch (step.type) {
        case 'start':
            return {
                icon: Play,
                label: 'Starting',
                tone: 'accent',
            };

        case 'compare':
            return {
                icon: ArrowLeftRight,
                label: 'Comparing',
                tone: 'comparing',
            };

        case 'decide-swap':
            return {
                icon: ArrowLeftRight,
                label: 'Out of order',
                tone: 'swapping',
            };

        case 'decide-no-swap':
            return {
                icon: CheckCircle2,
                label: 'No swap needed',
                tone: 'secondary',
            };

        case 'swap-animating':
            return {
                icon: ArrowLeftRight,
                label: 'Swapping',
                tone: 'swapping',
            };

        case 'swap-done':
            return {
                icon: CheckCircle2,
                label: 'Swap complete',
                tone: 'sorted',
            };

        case 'pass-end':
            return {
                icon: CheckCircle2,
                label: 'Pass complete',
                tone: 'sorted',
            };

        case 'sorted':
            return {
                icon: CheckCircle2,
                label: 'Sorted',
                tone: 'sorted',
            };

        default:
            return {
                icon: ArrowLeftRight,
                label: 'Processing',
                tone: 'secondary',
            };
    }
}

// =========================================================
// Step generator — builds the ENTIRE run as a linear list of frames up
// front. Nothing here is async; Play/Pause/Prev/Next just move a pointer
// through this array, so none of it can get out of sync or "double-fire".
// =========================================================
function buildBubbleSortSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;
    let sortedFrom = n;

    steps.push({
        type: 'start',
        array: [...arr],
        compare: [],
        message: "Starting Bubble Sort — we'll walk through every comparison, one step at a time.",
        pass: 0,
        comparison: 0,
        sortedFrom,
    });

    for (let j = 0; j < n - 1; j++) {
        let swappedInPass = false;

        for (let i = 0; i < n - 1 - j; i++) {
            steps.push({
                type: 'compare',
                array: [...arr],
                compare: [i, i + 1],
                message: `Comparing ${arr[i]} and ${arr[i + 1]}`,
                pass: j + 1,
                comparison: i + 1,
                sortedFrom,
            });

            const shouldSwap = arr[i] > arr[i + 1];

            steps.push({
                type: shouldSwap ? 'decide-swap' : 'decide-no-swap',
                array: [...arr],
                compare: [i, i + 1],
                message: shouldSwap
                    ? `${arr[i]} is larger than ${arr[i + 1]} — they are out of order`
                    : `${arr[i]} is not larger than ${arr[i + 1]} — no swap needed`,
                pass: j + 1,
                comparison: i + 1,
                sortedFrom,
            });

            if (shouldSwap) {
                const leftValue = arr[i];
                const rightValue = arr[i + 1];

                steps.push({
                    type: 'swap-animating',
                    array: [...arr],
                    compare: [i, i + 1],
                    message: `Swapping ${leftValue} ↔ ${rightValue}`,
                    pass: j + 1,
                    comparison: i + 1,
                    sortedFrom,
                });

                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swappedInPass = true;

                steps.push({
                    type: 'swap-done',
                    array: [...arr],
                    compare: [i, i + 1],
                    message: `Swapped — ${arr[i]} and ${arr[i + 1]} are now in the correct order`,
                    pass: j + 1,
                    comparison: i + 1,
                    sortedFrom,
                });
            }
        }

        sortedFrom = n - 1 - j;
        steps.push({
            type: 'pass-end',
            array: [...arr],
            compare: [],
            message: swappedInPass
                ? `End of pass ${j + 1} — the largest remaining value has bubbled into place.`
                : `No swaps in pass ${j + 1} — the array is already sorted, stopping early.`,
            pass: j + 1,
            comparison: 0,
            sortedFrom,
        });

        if (!swappedInPass) {
            sortedFrom = 0;
            break;
        }
    }

    steps.push({
        type: 'sorted',
        array: [...arr],
        compare: [],
        message: 'Array is sorted!',
        pass: steps[steps.length - 1].pass,
        comparison: 0,
        sortedFrom: 0,
    });

    return steps;
}

export default function BubbleSortClient() {
    const [array, setArray] = useState([220, 148, 132, 101, 95, 87, 64, 53, 8]);
    const [arrExist, setArrExist] = useState(true);
    const [oldArray, setOldArray] = useState(false);

    const [arrayLength, setArrayLength] = useState('');
    const [pushValue, setPushValue] = useState('');
    const [insertValue, setInsertValue] = useState('');
    const [insertIndex, setInsertIndex] = useState('');
    const [deleteValue, setDeleteValue] = useState('');

    const [activeTab, setActiveTab] = useState('create');

    const [isSorted, setIsSorted] = useState(false);

    // ---- Step player state ---------------------------------------
    const [steps, setSteps] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const directionRef = useRef('forward');
    const sortedToastShownRef = useRef(false);

    const currentStep = isSorting ? steps[stepIndex] ?? null : null;

    const [speed, setSpeed] = useState('normal');
    const speedMs = SPEED_OPTIONS.find((o) => o.id === speed)?.ms ?? 1000;

    const { detailsState, updateState } = useContext(DetailsStateContext);
    const handleToggle = (id, isOpen) => updateState(id, isOpen);

    useEffect(() => {
        if (array.length === 0 && activeTab !== 'create') {
            setActiveTab('create');
        }
    }, [array.length]); // eslint-disable-line react-hooks/exhaustive-deps

    // Clears any sort/step state — called before any structural change to
    // the array from the Build panel (create/push/pop/insert/delete).
    const resetSortView = () => {
        setIsSorted(false);
        setSteps([]);
        setStepIndex(0);
        setIsSorting(false);
        setIsPlaying(false);
        sortedToastShownRef.current = false;
    };

    // =========================================================
    // Sort — start / stop / navigate
    // =========================================================
    const startSort = () => {
        if (!arrExist) {
            toast.error('Please create an array first.');
            return;
        }
        if (array.includes('NULL')) {
            toast.error('Fill every slot first — sorting needs a complete array, no empty slots.');
            return;
        }
        if (array.length < 2) {
            toast.info('Array already has fewer than 2 elements — nothing to sort.');
            return;
        }

        const generated = buildBubbleSortSteps(array);
        sortedToastShownRef.current = false;
        setSteps(generated);
        setStepIndex(0);
        setIsSorted(false);
        setIsSorting(true);
        directionRef.current = 'forward';
        setIsPlaying(true);
    };

    const stopSort = (commit = true) => {
        const step = steps[stepIndex];
        if (commit && step) {
            setArray(step.array);
        }
        setIsPlaying(false);
        setIsSorting(false);
        setSteps([]);
        setStepIndex(0);
        toast.info('Sorting stopped.');
    };

    const goNext = useCallback(() => {
        setIsPlaying(false);
        directionRef.current = 'forward';
        setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, [steps.length]);

    const goPrev = useCallback(() => {
        setIsPlaying(false);
        directionRef.current = 'backward';
        setStepIndex((i) => Math.max(i - 1, 0));
    }, []);

    const togglePlay = useCallback(() => {
        if (stepIndex >= steps.length - 1) {
            directionRef.current = 'forward';
            setStepIndex(0);
            setIsPlaying(true);
            return;
        }

        directionRef.current = 'forward';
        setIsPlaying((p) => !p);
    }, [stepIndex, steps.length]);

    const restartSort = () => {
        directionRef.current = 'forward';
        setStepIndex(0);
        setIsPlaying(true);
    };

    // Auto-advance while playing
    useEffect(() => {
        if (!isPlaying || !steps.length) return;
        if (stepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }
        const type = steps[stepIndex]?.type;
        const t = setTimeout(() => {
            directionRef.current = 'forward';
            setStepIndex((i) => Math.min(i + 1, steps.length - 1));
        }, getFrameDelay(type, speedMs));
        return () => clearTimeout(t);
    }, [isPlaying, stepIndex, steps, speedMs]);

    // Commit the sorted array back into real state once the player reaches
    // the final frame (whether via autoplay or manual Next).
    useEffect(() => {
        if (!isSorting) return;
        const step = steps[stepIndex];
        if (step && step.type === 'sorted') {
            setArray(step.array);
            setIsSorted(true);
            setIsPlaying(false);
            if (!sortedToastShownRef.current) {
                toast.success('Array is sorted!');
                sortedToastShownRef.current = true;
            }
        }
    }, [stepIndex, steps, isSorting]);

    // Keyboard nav while a sort is active: ← / → step, space toggles play
    useEffect(() => {
        if (!isSorting) return;
        const handler = (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
            else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isSorting, goNext, goPrev, togglePlay]);

    // =========================================================
    // Create array
    // =========================================================
    const createArray = async () => {
        if (arrayLength === '' || parseInt(arrayLength) <= 0) {
            toast.error('Array length must be greater than 0.');
            return;
        }

        resetSortView();
        setOldArray(false);
        setArray([]);
        setArrExist(true);
        await new Promise((r) => setTimeout(r, 500));
        setArray(Array(parseInt(arrayLength)).fill('NULL'));
        toast.success('Array created successfully', { position: 'top-center' });
        setActiveTab('pushpop');
    };

    // =========================================================
    // Push / Pop
    // =========================================================
    const arrayPushOperation = () => {
        if (!arrExist) {
            toast.error('Please create an array first.');
            return;
        }
        if (pushValue === '') {
            toast.error('Please enter an element');
            return;
        }
        resetSortView();
        setOldArray(true);
        setArray([...array, Number(pushValue)]);
        toast.success('Element successfully pushed into the array.');
        setPushValue('');
    };

    const arrayPopOperation = () => {
        if (!arrExist) {
            toast.error('Please create an array first.');
            return;
        }
        if (array.length === 0) {
            toast.error('Array is already empty.');
            return;
        }
        resetSortView();
        setArray(array.slice(0, -1));
        toast.success('Element popped from the array.');
    };

    // =========================================================
    // Insert
    // =========================================================
    const arrayInsert = async () => {
        if (!arrExist) {
            toast.error('Please create an array first.');
            return;
        }
        if (insertValue === '') {
            toast.error('Please enter an element.');
            return;
        }
        if (insertIndex === '') {
            toast.error('Please enter an index.');
            return;
        }

        const index = parseInt(insertIndex);
        const value = Number(insertValue);

        if (index > array.length || index < 0) {
            toast.error(`Index must be between 0 and ${array.length}.`);
            return;
        }

        resetSortView();
        await new Promise((r) => setTimeout(r, 400));

        if (index === array.length) {
            setArray((prev) => [...prev, value]);
        } else {
            setArray((prev) => prev.map((item, i) => (i === index ? value : item)));
        }

        toast.success(`"${insertValue}" inserted at index ${insertIndex}`);
        setInsertValue('');
        setInsertIndex('');
    };

    // =========================================================
    // Delete
    // =========================================================
    const removeByEle = () => {
        if (!arrExist) {
            toast.error('Please create an array first.');
            return;
        }
        if (deleteValue === '') {
            toast.error('Please enter an element.');
            return;
        }
        if (!array.includes(Number(deleteValue))) {
            toast.error('Element not found.');
            return;
        }
        resetSortView();
        setArray((prev) => prev.map((item) => (item === Number(deleteValue) ? 'NULL' : item)));
        toast.success('Element deleted.');
        setDeleteValue('');
    };

    const removeArray = () => {
        if (!arrExist) {
            toast.error('Please create an array first.');
            return;
        }
        resetSortView();
        setOldArray(false);
        setArray([]);
        setArrExist(false);
        toast.success('Array has been successfully deleted.');
        setPushValue('');
        setInsertValue('');
        setInsertIndex('');
        setDeleteValue('');
    };

    // =========================================================
    // Rendering helpers
    // =========================================================
    const displayArray =
        isSorting && currentStep
            ? currentStep.array
            : array;

    const getCellStyle = (index) => {
        if (isSorting && currentStep) {
            const [a, b] = currentStep.compare;
            if (index === a || index === b) {
                const swapPhase =
                    currentStep.type === 'decide-swap' ||
                    currentStep.type === 'swap-animating' ||
                    currentStep.type === 'swap-done';
                return swapPhase
                    ? {
                        backgroundColor: 'rgb(var(--color-swapping))',
                        borderColor: 'rgb(var(--color-swapping))',
                        color: 'rgb(var(--color-swapping-text))',
                    }
                    : {
                        backgroundColor: 'rgb(var(--color-comparing))',
                        borderColor: 'rgb(var(--color-comparing))',
                        color: 'rgb(var(--color-comparing-text))',
                    };
            }
            if (index >= currentStep.sortedFrom) {
                return {
                    backgroundColor: 'rgb(var(--color-sorted))',
                    borderColor: 'rgb(var(--color-sorted))',
                    color: 'rgb(var(--color-sorted-text))',
                };
            }
            return {};
        }
        if (isSorted) {
            return {
                backgroundColor: 'rgb(var(--color-sorted))',
                borderColor: 'rgb(var(--color-sorted))',
                color: 'rgb(var(--color-sorted-text))',
            };
        }
        return {};
    };

    // Only the forward transition INTO 'swap-animating' gets an animated
    // transform. Every other frame change (including the settle onto the
    // swapped data, and any backward navigation) snaps instantly — this is
    // what removes the old "double swap" look.
    const getCellTransform = (index) => {
        if (!isSorting || !currentStep) {
            return {
                transform: undefined,
                transition: 'none',
            };
        }

        const [a, b] = currentStep.compare;

        // Only animate while entering the swap frame.
        // Once swap-done is reached, the values are already in their
        // final positions and the transform must disappear instantly.
        if (
            currentStep.type === 'swap-animating' &&
            directionRef.current === 'forward' &&
            (index === a || index === b)
        ) {
            return {
                transform: index === a
                    ? 'translateX(100%)'
                    : 'translateX(-100%)',
                transition: `transform ${SWAP_SLIDE_MS}ms ease`,
            };
        }

        return {
            transform: 'none',
            transition: 'none',
        };
    };

    const showSortedBadge = isSorting ? currentStep?.type === 'sorted' : isSorted;

    return (
        <details
            id="bubbleSortOp"
            className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
            onToggle={(e) => handleToggle('bubbleSortOp', e.target.open)}
            open={detailsState['bubbleSortOp'] !== undefined ? detailsState['bubbleSortOp'] : true}
        >
            <summary className="cursor-pointer select-none px-4 py-4 sm:px-5 text-base sm:text-lg md:text-xl font-semibold text-ink marker:text-accent hover:bg-bg/50 transition-colors">
                Bubble Sort
            </summary>

            <div className="px-4 pb-5 sm:px-5">
                {/* =================================================
              OPERATIONS PANEL
          ================================================= */}
                <div className="rounded-lg border border-border bg-bg p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink">Build Array</h3>
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                            {arrExist ? `${array.length} elements` : 'No array yet'}
                        </span>
                    </div>

                    <div className="mb-4 flex w-full flex-wrap rounded-md border border-borderStrong bg-surface p-0.5 sm:flex-nowrap sm:p-1">
                        {OPERATION_TABS.map((tab) => {
                            const disabled = tab.id !== 'create' && !arrExist;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    disabled={disabled || isSorting}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 basis-[calc(50%-4px)] m-0.5 rounded px-2 py-1.5 text-[10px] sm:basis-0 sm:m-0 sm:px-3 sm:py-2 sm:text-sm font-medium transition-colors
                      ${activeTab === tab.id ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'}
                      ${disabled || isSorting ? 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted' : ''}`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {activeTab === 'create' && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Start with an empty array of a chosen length. New slots start as{' '}
                                <span className="font-medium text-ink">NULL</span> — fill them with Push or Insert below.
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    min={1}
                                    value={arrayLength}
                                    onChange={(e) => setArrayLength(e.target.value)}
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Array length"
                                    disabled={isSorting}
                                />
                                <button type="button" onClick={createArray} disabled={isSorting} className="opBtn w-full whitespace-nowrap sm:w-auto">
                                    Create Array
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pushpop' && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Push adds a value to the end of the array. Order doesn't matter yet — that's exactly what sorting will fix.
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={pushValue}
                                    onChange={(e) => setPushValue(e.target.value)}
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Value"
                                    disabled={isSorting}
                                />
                                <div className="flex w-full gap-2 sm:w-auto">
                                    <button type="button" onClick={arrayPushOperation} disabled={isSorting} className="opBtn flex-1 whitespace-nowrap sm:flex-none">
                                        Push
                                    </button>
                                    <button type="button" onClick={arrayPopOperation} disabled={isSorting} className="opBtn-secondary flex-1 whitespace-nowrap sm:flex-none">
                                        Pop
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'insert' && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Insert at any index — fills an empty NULL slot, or extends the array if you target the end.
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={insertValue}
                                    onChange={(e) => setInsertValue(e.target.value)}
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Value"
                                    disabled={isSorting}
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={insertIndex}
                                    onChange={(e) => setInsertIndex(e.target.value)}
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Index"
                                    disabled={isSorting}
                                />
                                <button type="button" onClick={arrayInsert} disabled={isSorting} className="opBtn w-full whitespace-nowrap sm:w-auto">
                                    Insert
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'delete' && (
                        <div className="flex flex-col gap-4">
                            <p className="text-xs leading-relaxed text-muted">Delete the first matching value, or clear the whole array.</p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={deleteValue}
                                    onChange={(e) => setDeleteValue(e.target.value)}
                                    className="opInput w-full sm:max-w-[180px]"
                                    placeholder="Value"
                                    disabled={isSorting}
                                />
                                <button type="button" onClick={removeByEle} disabled={isSorting} className="opBtn-secondary w-full whitespace-nowrap sm:w-auto">
                                    Delete
                                </button>
                            </div>
                            <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-relaxed text-muted">
                                    Need a fresh array? Remove the current array and create a new one.
                                </p>
                                <button
                                    type="button"
                                    onClick={removeArray}
                                    disabled={isSorting}
                                    className="opBtn-danger w-full whitespace-nowrap sm:w-auto"
                                >
                                    Delete Array
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* =================================================
              SORT PANEL
          ================================================= */}
                <div className="mt-4 rounded-lg border border-border bg-bg p-3 sm:mt-5 sm:p-4">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-ink">Sort</h3>
                            <p className="text-[10px] leading-relaxed text-muted sm:text-xs">
                                Compares each adjacent pair, one step at a time, and swaps them if they're out of order.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-muted sm:text-xs">
                            <div className="flex gap-3">
                                <span>Pass: {currentStep?.pass ?? 0}</span>
                                <span>Comparison: {currentStep?.comparison ?? 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>Speed</span>
                                <div className="flex rounded-md border border-borderStrong bg-surface p-0.5">
                                    {SPEED_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setSpeed(opt.id)}
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors sm:px-2 sm:py-1 sm:text-xs ${speed === opt.id ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isSorting ? (
                        <button
                            type="button"
                            onClick={startSort}
                            className="opBtn flex w-full items-center justify-center gap-1.5 whitespace-nowrap sm:w-auto"
                        >
                            <Play
                                size={16}
                                strokeWidth={2.2}
                                className="shrink-0"
                            />
                            <span>Sort</span>
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex w-full items-center gap-1.5 sm:gap-2">
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    disabled={stepIndex === 0}
                                    className="opBtn opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs sm:flex-none sm:px-3 sm:text-sm"
                                >
                                    <ChevronLeft
                                        size={15}
                                        className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                    />
                                    <span>Prev</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={togglePlay}
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
                                    onClick={goNext}
                                    disabled={stepIndex >= steps.length - 1}
                                    className="opBtn opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs sm:flex-none sm:px-3 sm:text-sm"
                                >
                                    <span>Next</span>
                                    <ChevronRight
                                        size={15}
                                        className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={restartSort}
                                    aria-label="Restart"
                                    title="Restart"
                                    className="opBtn opBtn-secondary flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
                                >
                                    <RotateCcw size={15} className="sm:h-[17px] sm:w-[17px]" />
                                    <span className="hidden sm:inline text-sm">Restart</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={stopSort}
                                    aria-label="Stop"
                                    title="Stop"
                                    className="opBtn-danger flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
                                >
                                    <Square size={14} className="sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline text-sm">Stop</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {arrExist && array.includes('NULL') && !isSorting && (
                        <p className="mt-2 text-xs text-swapping">
                            Fill every slot before sorting — {array.filter((v) => v === 'NULL').length} slot(s) still empty.
                        </p>
                    )}
                </div>

                {/* =================================================
              Visualizer
          ================================================= */}
                <div className="mt-5 overflow-hidden rounded-xl border border-border bg-bg">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
                        <div>
                            <div className="text-sm font-semibold text-ink">Array Visualizer</div>
                            <div className="mt-0.5 text-xs text-muted">{arrExist ? `${displayArray.length} elements` : 'No array created'}</div>
                        </div>
                        {showSortedBadge && (
                            <span className="rounded-full bg-sorted/10 px-2.5 py-1 text-xs font-medium text-sorted">Sorted ✓</span>
                        )}
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-5">
                        {arrExist && displayArray.length > 0 ? (
                            <div className="w-max min-w-full">
                                <div className="grid w-fit grid-rows-2" style={{ gridTemplateColumns: `repeat(${displayArray.length}, auto)` }}>
                                    {/* Index row */}
                                    {displayArray.map((_, index) => (
                                        <div key={`idx-${index}`} className="flex h-5 w-10 shrink-0 items-center justify-center text-[10px] font-medium text-muted sm:h-6 sm:w-14 sm:text-xs">
                                            {index}
                                        </div>
                                    ))}

                                    {/* Cells */}
                                    {displayArray.map((item, index) => {
                                        const { transform, transition } = getCellTransform(index);

                                        return (
                                            <div
                                                key={`cell-${index}`}
                                                className={`cell arrayDiv h-8 w-10 shrink-0 text-xs sm:h-11 sm:w-14 sm:text-base font-semibold relative
                ${item === 'NULL' ? 'italic font-normal text-muted' : ''}
                ${transform !== 'none' ? 'z-10' : ''}`}
                                                style={{
                                                    ...getCellStyle(index),
                                                    transform,
                                                    transition,
                                                }}
                                            >
                                                {item}
                                            </div>
                                        );
                                    })}
                                </div>

                                {isSorting && currentStep?.message && (
                                    <div className="mb-4 mt-3" aria-live="polite">
                                        {(() => {
                                            const action = getStepAction(currentStep);
                                            const Icon = action?.icon ?? ArrowLeftRight;

                                            const toneClasses = {
                                                accent:
                                                    'border-accent/30 bg-accent/5 text-accent',

                                                comparing:
                                                    'border-comparing/30 bg-comparing/10 text-comparing-text',

                                                swapping:
                                                    'border-swapping/30 bg-swapping/10 text-swapping-text',

                                                sorted:
                                                    'border-sorted/30 bg-sorted/10 text-sorted-text',

                                                secondary:
                                                    'border-border bg-surface text-secondary',
                                            };

                                            return (
                                                <div
                                                    key={stepIndex}
                                                    className={`animate-fade-in flex items-center gap-3 rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${toneClasses[action?.tone] ?? toneClasses.secondary
                                                        }`}
                                                >
                                                    {/* Action icon */}
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface sm:h-9 sm:w-9">
                                                        <Icon
                                                            size={17}
                                                            strokeWidth={2.2}
                                                            className="shrink-0"
                                                            color="blue"
                                                        />
                                                    </div>

                                                    {/* Action text */}
                                                    <div className="min-w-0">
                                                        <div className="text-[10px] text-white font-semibold uppercase tracking-[0.08em] opacity-70 sm:text-[11px]">
                                                            {action?.label ?? 'Processing'}
                                                        </div>

                                                        <div className="mt-0.5 break-words text-xs font-medium leading-relaxed text-ink sm:text-sm">
                                                            {currentStep.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                <div className="mt-4">
                                    <StateLegend
                                        items={[
                                            { token: 'comparing', label: 'Comparing' },
                                            { token: 'swapping', label: 'Swapping' },
                                            { token: 'sorted', label: 'Sorted' },
                                        ]}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-element text-muted">∅</div>
                                <p className="text-sm font-medium text-ink">No array to visualize</p>
                                <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">Create an array above to start experimenting.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </details>
    );
}