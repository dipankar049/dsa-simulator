"use client";

import React, { useState, useRef, useEffect, useContext } from 'react';
import { DetailsStateContext } from '@/context/DetailsContext';
import StateLegend from '@/components/StateLegend';
import { toast } from 'react-toastify';

const OPERATION_TABS = [
    { id: 'create', label: 'Create' },
    { id: 'pushpop', label: 'Push / Pop' },
    { id: 'insert', label: 'Insert' },
    { id: 'delete', label: 'Delete' },
];

const CELL_WIDTH = 56;
const SPEED_OPTIONS = [
    { id: 'slow', label: 'Slow', multiplier: 1.6 },
    { id: 'normal', label: 'Normal', multiplier: 1 },
    { id: 'fast', label: 'Fast', multiplier: 0.5 },
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

    const abortRef = useRef(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const [stepMessage, setStepMessage] = useState('');
    const divRefs = useRef([]);

    const [isGreater, setIsGreater] = useState(false);
    const [firstEle, setFirstEle] = useState(-1);
    const [secondEle, setSecondEle] = useState(-1);

    // Cells currently mid-swap get a translateX offset here so they visibly
    // slide past each other instead of just flashing a new value in place.
    const [swapOffsets, setSwapOffsets] = useState({});

    const [speed, setSpeed] = useState('normal');
    const speedRef = useRef(1);
    useEffect(() => {
        speedRef.current = SPEED_OPTIONS.find((o) => o.id === speed)?.multiplier ?? 1;
    }, [speed]);

    const { detailsState, updateState } = useContext(DetailsStateContext);
    const handleToggle = (id, isOpen) => updateState(id, isOpen);

    // Reads speedRef fresh on every call, so changing speed mid-sort takes
    // effect immediately instead of only on the next run.
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms * speedRef.current));

    useEffect(() => {
        if (array.length === 0 && activeTab !== 'create') {
            setActiveTab('create');
        }
    }, [array.length]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setIsGreater(false);
        setIterations(0);
        setComparisons(0);
        setFirstEle(-1);
        setSecondEle(-1);
        setIsSorted(false);
        setStepMessage('');
        setSwapOffsets({});
    }, [array]);

    // =========================================================
    // Sort
    // =========================================================
    const bubbleSort = async () => {
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

        abortRef.current = false;
        setIsRunning(true);
        setIsSorted(false);
        setComparisons(0);

        // Work on a local copy so every visual update goes through setArray
        // instead of mutating state directly.
        let workingArray = [...array];

        for (let j = 0; j < workingArray.length - 1; j++) {
            setIterations(j + 1);
            let swappedInPass = false;

            for (let i = 0; i < workingArray.length - 1 - j; i++) {
                if (abortRef.current) {
                    setIsRunning(false);
                    setStepMessage('');
                    setSwapOffsets({});
                    toast.info('Sorting aborted.');
                    return;
                }
                setComparisons(i + 1);
                setFirstEle(i);
                setSecondEle(i + 1);
                setStepMessage(`Comparing ${workingArray[i]} and ${workingArray[i + 1]}`);
                await delay(1000);

                if (workingArray[i] > workingArray[i + 1]) {
                    setIsGreater(true);
                    setStepMessage(`${workingArray[i]} > ${workingArray[i + 1]} — swapping`);
                    // Slide the two cells toward each other's slot first...
                    setSwapOffsets({ [i]: CELL_WIDTH, [i + 1]: -CELL_WIDTH });
                    await delay(500);

                    // ...then commit the data change. Because the offset resets to 0
                    // in the same update as the new (already-swapped) values, the
                    // cells appear to glide the rest of the way into their new home.
                    const swapped = [...workingArray];
                    [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
                    workingArray = swapped;
                    setArray(swapped);
                    setSwapOffsets({});
                    swappedInPass = true;
                    await delay(400);
                } else {
                    setStepMessage(`${workingArray[i]} ≤ ${workingArray[i + 1]} — already in order, no swap`);
                    await delay(700);
                }

                setIsGreater(false);
                await delay(300);
            }

            if (!swappedInPass) {
                setStepMessage('No swaps this pass — the array is already sorted, stopping early.');
                break;
            }
        }
        setFirstEle(-1);
        setSecondEle(-1);
        setIsRunning(false);
        setIsSorted(true);
        setStepMessage('Array is sorted!');
    };

    // =========================================================
    // Create array
    // =========================================================
    const createArray = async () => {
        if (arrayLength === '' || parseInt(arrayLength) <= 0) {
            toast.error('Array length must be greater than 0.');
            return;
        }

        await delay(200);
        setOldArray(false);
        setArray([]);
        setArrExist(true);
        await delay(500);
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

        await delay(1000);

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
        setArray((prev) => prev.map((item) => (item === Number(deleteValue) ? 'NULL' : item)));
        toast.success('Element deleted.');
        setDeleteValue('');
    };

    const removeArray = () => {
        if (!arrExist) {
            toast.error('Please create an array first.');
            return;
        }
        setOldArray(false);
        setArray([]);
        setArrExist(false);
        toast.success('Array has been successfully deleted.');
        setPushValue('');
        setInsertValue('');
        setInsertIndex('');
        setDeleteValue('');
    };

    const cellStyle = (index) => {
        const isComparing = index === firstEle || index === secondEle;

        if (isComparing) {
            return {
                backgroundColor: isGreater ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))',
                borderColor: isGreater ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))',
                color: isGreater ? 'rgb(var(--color-swapping-text))' : 'rgb(var(--color-comparing-text))',
            };
        }

        return {};
    };

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
                                    disabled={disabled || isRunning}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 basis-[calc(50%-4px)] m-0.5 rounded px-2 py-1.5 text-[10px] sm:basis-0 sm:m-0 sm:px-3 sm:py-2 sm:text-sm font-medium transition-colors
                      ${activeTab === tab.id ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'}
                      ${disabled || isRunning ? 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted' : ''}`}
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
                                    disabled={isRunning}
                                />
                                <button type="button" onClick={createArray} disabled={isRunning} className="opBtn w-full whitespace-nowrap sm:w-auto">
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
                                    disabled={isRunning}
                                />
                                <div className="flex w-full gap-2 sm:w-auto">
                                    <button type="button" onClick={arrayPushOperation} disabled={isRunning} className="opBtn flex-1 whitespace-nowrap sm:flex-none">
                                        Push
                                    </button>
                                    <button type="button" onClick={arrayPopOperation} disabled={isRunning} className="opBtn-secondary flex-1 whitespace-nowrap sm:flex-none">
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
                                    disabled={isRunning}
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={insertIndex}
                                    onChange={(e) => setInsertIndex(e.target.value)}
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Index"
                                    disabled={isRunning}
                                />
                                <button type="button" onClick={arrayInsert} disabled={isRunning} className="opBtn w-full whitespace-nowrap sm:w-auto">
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
                                    disabled={isRunning}
                                />
                                <button type="button" onClick={removeByEle} disabled={isRunning} className="opBtn-secondary w-full whitespace-nowrap sm:w-auto">
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
                                    disabled={isRunning}
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
                            <p className="text-[10px] leading-relaxed text-muted sm:text-xs">Compares each adjacent pair and swaps them if they're out of order.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-muted sm:text-xs">
                            <div className="flex gap-3">
                                <span>Pass: {iterations}</span>
                                <span>Comparisons: {comparisons}</span>
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
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        {isRunning ? (
                            <button type="button" onClick={() => (abortRef.current = true)} className="opBtn-danger w-full whitespace-nowrap sm:w-auto">
                                Abort Sorting
                            </button>
                        ) : (
                            <button type="button" onClick={bubbleSort} className="opBtn w-full whitespace-nowrap sm:w-auto">
                                Sort
                            </button>
                        )}
                    </div>
                    {arrExist && array.includes('NULL') && (
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
                            <div className="mt-0.5 text-xs text-muted">{arrExist ? `${array.length} elements` : 'No array created'}</div>
                        </div>
                        {isSorted && (
                            <span className="rounded-full bg-sorted/10 px-2.5 py-1 text-xs font-medium text-sorted">Sorted ✓</span>
                        )}
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-5">
                        {arrExist && array.length > 0 ? (
                            <div className="w-max min-w-full">
                                <div className="grid w-fit grid-rows-2" style={{ gridTemplateColumns: `repeat(${array.length}, auto)` }}>
                                    {/* Index row */}
                                    {array.map((_, index) => (
                                        <div key={`idx-${index}`} className="flex h-5 w-10 shrink-0 items-center justify-center text-[10px] font-medium text-muted sm:h-6 sm:w-14 sm:text-xs">
                                            {index}
                                        </div>
                                    ))}

                                    {/* Cells */}
                                    {array.map((item, index) => {
                                        const offset = swapOffsets[index];
                                        // The multiplier for translateX must match the cell width on mobile vs desktop.
                                        // In our JS logic, CELL_WIDTH is fixed at 56 (w-14).
                                        // To fix this perfectly, we'd need a dynamic CELL_WIDTH or CSS variables.
                                        // For now, let's keep the size consistent or adjust CELL_WIDTH logic.
                                        // Let's try to maintain w-14 on desktop and w-10 on mobile.
                                        return (
                                            <div
                                                key={`cell-${index}`}
                                                id={`node-${index}`}
                                                ref={(el) => (divRefs.current[index] = el)}
                                                className={`cell arrayDiv h-8 w-10 shrink-0 text-xs sm:h-11 sm:w-14 sm:text-base font-semibold animate-fade-in
                                                    ${item === 'NULL' ? 'italic font-normal text-muted' : ''}
                                                    ${offset ? 'relative z-10' : ''}`}
                                                style={{
                                                    ...cellStyle(index),
                                                    // If we change the width from 56 (w-14) to 40 (w-10), we must adjust the offset.
                                                    transform: offset ? `translateX(${(offset / 56) * (window.innerWidth < 640 ? 40 : 56)}px)` : undefined,
                                                    transition: 'transform 0.35s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                                                    animationDelay: `${oldArray ? '0.2' : index * 0.2}s`,
                                                    animationFillMode: 'both',
                                                }}
                                            >
                                                {item}
                                            </div>
                                        );
                                    })}
                                </div>

                                {stepMessage && (
                                    <div
                                        className="mt-3 rounded-md border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-secondary sm:text-sm"
                                        aria-live="polite"
                                    >
                                        {stepMessage}
                                    </div>
                                )}

                                <div className="mt-4">
                                    <StateLegend
                                        items={[
                                            { token: 'comparing', label: 'Comparing' },
                                            { token: 'swapping', label: 'Swapping' },
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