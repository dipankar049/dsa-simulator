"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import StateLegend from '@/components/StateLegend';
import { toast } from 'react-toastify';
import { Play } from "lucide-react";
import { buildBubbleSortSteps } from "@/lib/algorithms/bubbleSort";
import {
    getSpeedMs,
    getBubbleSortFrameDelay,
    CELL_STATE_STYLE,
    BUBBLE_SORT_STEP_ACTIONS,
    getAdjacentPercentSwapTransform,
} from "@/lib/simulation";
import {
    CollapsibleSimulatorSection,
    ArrayWorkbench,
    SpeedSelector,
    PlaybackControls,
    StepCallout,
    ArrayVisualization,
    EmptyVisualizationPlaceholder,
    VisualizationViewport,
} from "@/components/simulator";

const OPERATION_TABS = [
    { id: 'create', label: 'Create' },
    { id: 'pushpop', label: 'Push / Pop' },
    { id: 'insert', label: 'Insert' },
    { id: 'delete', label: 'Delete' },
];

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

    const sortedToastShownRef = useRef(false);

    const [speed, setSpeed] = useState("normal");
    const speedMs = getSpeedMs(speed);

    const handlePlaybackStepChange = useCallback((step) => {
        if (step?.type !== "sorted") return;

        setArray(step.array);
        setIsSorted(true);
        if (!sortedToastShownRef.current) {
            toast.success("Array is sorted!");
            sortedToastShownRef.current = true;
        }
    }, []);

    const getFrameDelayForStep = useCallback(
        (step) => getBubbleSortFrameDelay(step?.type, speedMs),
        [speedMs]
    );

    const {
        steps,
        stepIndex,
        isPlaying,
        isSessionActive: isSorting,
        currentStep,
        directionRef,
        startSession,
        clearSession,
        goNext,
        goPrev,
        togglePlay,
        restart: restartSort,
        pause,
    } = useStepPlayback({
        speedMs,
        getFrameDelay: getFrameDelayForStep,
        onStepChange: handlePlaybackStepChange,
        pauseOnStepTypes: ["sorted"],
    });

    useEffect(() => {
        if (array.length === 0 && activeTab !== 'create') {
            setActiveTab('create');
        }
    }, [array.length]); // eslint-disable-line react-hooks/exhaustive-deps

    // Clears any sort/step state — called before any structural change to
    // the array from the Build panel (create/push/pop/insert/delete).
    const resetSortView = () => {
        setIsSorted(false);
        clearSession();
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

        sortedToastShownRef.current = false;
        setIsSorted(false);
        startSession(buildBubbleSortSteps(array));
    };

    const stopSort = useCallback(() => {
        if (currentStep) {
            setArray(currentStep.array);
        }
        pause();
        clearSession();
        toast.info("Sorting stopped.");
    }, [currentStep, pause, clearSession]);

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
                    ? CELL_STATE_STYLE.swapping
                    : CELL_STATE_STYLE.comparing;
            }
            if (index >= currentStep.sortedFrom) {
                return CELL_STATE_STYLE.sorted;
            }
            return {};
        }
        if (isSorted) {
            return CELL_STATE_STYLE.sorted;
        }
        return {};
    };

    // Only the forward transition INTO 'swap-animating' gets an animated
    // transform. Every other frame change (including the settle onto the
    // swapped data, and any backward navigation) snaps instantly — this is
    // what removes the old "double swap" look.
    const getCellTransform = (index) => {
        if (!isSorting || !currentStep) {
            return { transform: undefined, transition: "none" };
        }

        return getAdjacentPercentSwapTransform(
            index,
            currentStep.compare,
            currentStep.type,
            directionRef.current
        );
    };

    const showSortedBadge = isSorting ? currentStep?.type === 'sorted' : isSorted;

    return (
        <CollapsibleSimulatorSection detailsId="bubbleSortOp" title="Bubble Sort">
                <ArrayWorkbench
                    tabs={OPERATION_TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    arrExist={arrExist}
                    elementCount={array.length}
                    controlsDisabled={isSorting}
                >
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
                </ArrayWorkbench>

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
                            <SpeedSelector speed={speed} onSpeedChange={setSpeed} />
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
                        <PlaybackControls
                            stepIndex={stepIndex}
                            stepsLength={steps.length}
                            isPlaying={isPlaying}
                            onPrev={goPrev}
                            onTogglePlay={togglePlay}
                            onNext={goNext}
                            onRestart={restartSort}
                            onStop={() => stopSort()}
                        />
                    )}

                    {arrExist && array.includes('NULL') && !isSorting && (
                        <p className="mt-2 text-xs text-swapping">
                            Fill every slot before sorting — {array.filter((v) => v === 'NULL').length} slot(s) still empty.
                        </p>
                    )}
                </div>

                <VisualizationViewport
                    subtitle={arrExist ? `${displayArray.length} elements` : 'No array created'}
                    showSortedBadge={showSortedBadge}
                >
                    {arrExist && displayArray.length > 0 ? (
                        <div className="w-max min-w-full">
                            <ArrayVisualization
                                items={displayArray}
                                getCellStyle={getCellStyle}
                                getCellTransform={getCellTransform}
                            />

                            {isSorting && currentStep?.message && (
                                <StepCallout
                                    stepKey={stepIndex}
                                    step={currentStep}
                                    actionMap={BUBBLE_SORT_STEP_ACTIONS}
                                    message={currentStep.message}
                                />
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
                        <EmptyVisualizationPlaceholder />
                    )}
                </VisualizationViewport>
        </CollapsibleSimulatorSection>
    );
}