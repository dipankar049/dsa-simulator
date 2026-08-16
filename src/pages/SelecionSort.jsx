import React, { useState, useRef, useEffect, useContext } from 'react';
import { DetailsStateContext } from '../context/DetailsContext';
import TopicCard from '../components/TopicCard';
import StateLegend from '../components/Statelegend';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const OPERATION_TABS = [
    { id: 'create', label: 'Create' },
    { id: 'pushpop', label: 'Push / Pop' },
    { id: 'insert', label: 'Insert' },
    { id: 'delete', label: 'Delete' },
];

const CELL_WIDTH = 56; // px — matches the `w-14` cell class, used to slide swapped cells
const SPEED_OPTIONS = [
    { id: 'slow', label: 'Slow', multiplier: 1.6 },
    { id: 'normal', label: 'Normal', multiplier: 1 },
    { id: 'fast', label: 'Fast', multiplier: 0.5 },
];

const SelectionSort = () => {
    const [array, setArray] = useState([20, 64, 132, 101, 95, 7, 64, 153, 80]);
    const [arrExist, setArrExist] = useState(true);
    const [oldArray, setOldArray] = useState(false);

    const [arrayLength, setArrayLength] = useState('');
    const [pushValue, setPushValue] = useState('');
    const [insertValue, setInsertValue] = useState('');
    const [insertIndex, setInsertIndex] = useState('');
    const [deleteValue, setDeleteValue] = useState('');

    const [activeTab, setActiveTab] = useState('create');

    const [isVisible, setIsVisible] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const [stepMessage, setStepMessage] = useState('');
    const divRefs = useRef([]);
    const abortRef = useRef(false);
    const [isRunning, setIsRunning] = useState(false);

    const [isSmaller, setIsSmaller] = useState(false);
    const [min, setMin] = useState(-1);
    const [firstEle, setFirstEle] = useState(-1);
    const [secondEle, setSecondEle] = useState(-1);

    // Cells currently mid-swap get a translateX offset here so they visibly
    // slide across to their new slot instead of just flashing a new value.
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
        if (array.length === 0) {
            setIsVisible(false);
        }
        setIsSorted(false);
        setStepMessage('');
        setSwapOffsets({});
    }, [array]);

    // =========================================================
    // Sort
    // =========================================================
    const selectionSort = async () => {
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

        setIsVisible(true);
        abortRef.current = false;
        setIsRunning(true);
        setIsSorted(false);
        setComparisons(0);

        // Work on a local copy so every visual update goes through setArray.
        let workingArray = [...array];

        for (let j = 0; j < workingArray.length - 1; j++) {
            setFirstEle(j);
            setIterations(j + 1);
            setMin(j);
            let minIndex = j;

            // Start at j + 1 — comparing the minimum to itself is wasted work.
            for (let i = j + 1; i < workingArray.length; i++) {
                if (abortRef.current) {
                    setIsRunning(false);
                    setStepMessage('');
                    setSwapOffsets({});
                    toast.info('Sorting aborted.');
                    return;
                }
                setComparisons(i - j);
                setSecondEle(i);
                setStepMessage(`Is ${workingArray[i]} smaller than the current minimum ${workingArray[minIndex]}?`);
                await delay(1000);

                if (workingArray[i] < workingArray[minIndex]) {
                    setIsSmaller(true);
                    minIndex = i;
                    setStepMessage(`${workingArray[i]} is the new minimum for this pass.`);
                    await delay(1000);
                } else {
                    setIsSmaller(false);
                    setStepMessage(`${workingArray[i]} ≥ ${workingArray[minIndex]} — minimum stays the same.`);
                    await delay(700);
                }
                setMin(minIndex);
            }

            if (minIndex !== j) {
                setStepMessage(`Swapping ${workingArray[j]} (position ${j}) with the minimum ${workingArray[minIndex]} (position ${minIndex}).`);
                // The two positions can be any distance apart here (unlike bubble
                // sort's adjacent swaps), so scale the slide by that distance.
                const distance = (minIndex - j) * CELL_WIDTH;
                setSwapOffsets({ [j]: distance, [minIndex]: -distance });
                await delay(650);

                const swapped = [...workingArray];
                [swapped[j], swapped[minIndex]] = [swapped[minIndex], swapped[j]];
                workingArray = swapped;
                setArray(swapped);
                setSwapOffsets({});
                await delay(350);
            } else {
                setStepMessage(`${workingArray[j]} is already the minimum for this pass — no swap needed.`);
                await delay(700);
            }

            if (j === workingArray.length - 2) {
                setIsSorted(true);
                setMin(-1);
                setFirstEle(-1);
                setSecondEle(-1);
                setStepMessage('Array is sorted!');
            }
        }
        setIsRunning(false);
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
        if (index === min) {
            return {
                backgroundColor: 'rgb(var(--color-pivot))',
                borderColor: 'rgb(var(--color-pivot))',
                color: 'rgb(var(--color-pivot-text))',
            };
        }

        if (index === firstEle) {
            return {
                backgroundColor: 'rgb(var(--color-frontier))',
                borderColor: 'rgb(var(--color-frontier))',
                color: 'rgb(var(--color-frontier-text))',
            };
        }

        if (index === secondEle) {
            return {
                backgroundColor: isSmaller ? 'rgb(var(--color-comparing))' : 'rgb(var(--color-element))',
                borderColor: isSmaller ? 'rgb(var(--color-comparing))' : 'rgb(var(--color-element-border))',
                color: isSmaller ? 'rgb(var(--color-comparing-text))' : 'rgb(var(--color-text-primary))',
            };
        }
        return {};
    };

    return (
        <div>
            <Helmet>
                <title>Selection Sort Visualizer | Minimum Element Swapping Simulator</title>
                <meta
                    name="description"
                    content="See how Selection Sort scans for the minimum element in an unsorted list and brings it to the front step-by-step."
                />
                <meta name="keywords" content="selection sort simulator, unsorted array scan animation, linear sorting tool" />
            </Helmet>

            <TopicCard topicName="Selection Sort" />

            <details
                id="selectionSortOp"
                className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
                onToggle={(e) => handleToggle('selectionSortOp', e.target.open)}
                open={detailsState['selectionSortOp'] !== undefined ? detailsState['selectionSortOp'] : true}
            >
                <summary className="cursor-pointer select-none px-4 py-4 sm:px-5 text-base sm:text-lg md:text-xl font-semibold text-ink marker:text-accent hover:bg-bg/50 transition-colors">
                    Selection Sort
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

                        <div className="mb-4 flex w-full flex-wrap rounded-md border border-borderStrong bg-surface p-1 sm:flex-nowrap">
                            {OPERATION_TABS.map((tab) => {
                                const disabled = tab.id !== 'create' && !arrExist;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        disabled={disabled || isRunning}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 basis-1/2 rounded px-3 py-2 text-xs sm:basis-0 sm:text-sm font-medium transition-colors
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
                    <div className="mt-5 rounded-lg border border-border bg-bg p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h3 className="text-sm font-semibold text-ink">Sort</h3>
                                <p className="text-xs leading-relaxed text-muted">Scans the unsorted part for the smallest value and moves it to the front.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
                                <span>Pass: {iterations}</span>
                                <span>Comparisons: {comparisons}</span>
                                <div className="flex items-center gap-1.5">
                                    <span>Speed</span>
                                    <div className="flex rounded-md border border-borderStrong bg-surface p-0.5">
                                        {SPEED_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setSpeed(opt.id)}
                                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${speed === opt.id ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'
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
                                <button type="button" onClick={selectionSort} className="opBtn w-full whitespace-nowrap sm:w-auto">
                                    Sort
                                </button>
                            )}
                        </div>
                        {arrExist && array.includes('NULL') && (
                            <p className="mt-2 text-xs text-swapping">
                                Fill every slot before sorting — {array.filter((v) => v === 'NULL').length} slot(s) still empty.
                            </p>
                        )}
                        {isVisible && (
                            <p className="mt-2 text-xs text-muted">
                                Current minimum: <b className="text-ink">{min >= 0 ? array[min] : '—'}</b>
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
                                            <div key={`idx-${index}`} className="flex h-6 w-14 shrink-0 items-center justify-center text-xs font-medium text-muted">
                                                {index}
                                            </div>
                                        ))}

                                        {/* Cells */}
                                        {array.map((item, index) => {
                                            const offset = swapOffsets[index];
                                            return (
                                                <div
                                                    key={`cell-${index}`}
                                                    id={`node-${index}`}
                                                    ref={(el) => (divRefs.current[index] = el)}
                                                    className={`cell arrayDiv h-11 w-14 shrink-0 font-semibold animate-fadeIn
                                                    ${item === 'NULL' ? 'italic font-normal text-muted' : ''}
                                                    ${offset ? 'relative z-10' : ''}`}
                                                    style={{
                                                        ...cellStyle(index),
                                                        transform: offset ? `translateX(${offset}px)` : undefined,
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
                                                { token: 'frontier', label: 'Sorted boundary' },
                                                { token: 'comparing', label: 'New minimum' },
                                                { token: 'pivot', label: 'Minimum so far' },
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

            <TopicCard topicName="Real-life Use (Selection Sort)" />
        </div>
    );
};

export default SelectionSort;