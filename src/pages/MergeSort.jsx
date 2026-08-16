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

const CELL_WIDTH = 56; // px — matches the `w-14` cell class used elsewhere

// Slow is deliberately much slower than normal here — with a full recursion
// tree on screen there's a lot to read at each step.
const SPEED_OPTIONS = [
    { id: 'slow', label: 'Slow', multiplier: 2.4 },
    { id: 'normal', label: 'Normal', multiplier: 1 },
    { id: 'fast', label: 'Fast', multiplier: 0.45 },
];

// =========================================================
// Pure tree helpers — build the real divide/conquer recursion
// tree for a range [left, right], the same way merge sort actually
// recurses (so it's correct for any length, not just powers of two).
// =========================================================
function buildTree(left, right) {
    if (left === right) {
        return { left, right, children: [] };
    }
    const mid = left + Math.floor((right - left) / 2);
    return {
        left,
        right,
        children: [buildTree(left, mid), buildTree(mid + 1, right)],
    };
}

function nodeKey(node) {
    return `${node.left}-${node.right}`;
}

// Depth-first walk that still yields each row in correct left-to-right
// order, because a node is recorded at the start of its own visit —
// before its subtree is explored — so siblings land in order.
function collectRows(root) {
    const rows = [];
    const walk = (node, depth) => {
        if (!rows[depth]) rows[depth] = [];
        rows[depth].push(node);
        node.children.forEach((child) => walk(child, depth + 1));
    };
    walk(root, 0);
    return rows;
}

const MergeSort = () => {
    const [array, setArray] = useState([20, 64, 132, 101, 95, 7, 64, 153, 80]);
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
    const [comparisons, setComparisons] = useState(0);
    const [stepMessage, setStepMessage] = useState('');
    const divRefs = useRef([]);

    // The recursion tree for the current sort run. Null = nothing sorted
    // yet, so the Visualizer just shows the plain array as one row.
    const [tree, setTree] = useState(null);
    // How many rows of the tree are currently revealed (divide phase).
    const [visibleDepth, setVisibleDepth] = useState(-1);
    // key -> array of values currently shown in that node's block.
    const [nodeValues, setNodeValues] = useState({});
    const nodeValuesRef = useRef({}); // mirrors nodeValues, read synchronously during recursion
    // The node currently receiving a merge (accent border).
    const [activeNodeKey, setActiveNodeKey] = useState(null);
    // Node that just finished merging — brief "sorted" pulse.
    const [flashKey, setFlashKey] = useState(null);
    // Which two cells (by node key + index within that node) are being compared.
    const [compareInNode, setCompareInNode] = useState({ leftKey: null, leftIdx: -1, rightKey: null, rightIdx: -1 });
    // Nodes whose values have already been folded into their parent — dimmed.
    const [consumedKeys, setConsumedKeys] = useState(new Set());

    // Set right before we write the final sorted result back into `array`,
    // so the reset effect below doesn't wipe the tree we just finished animating.
    const skipResetRef = useRef(false);

    const [speed, setSpeed] = useState('normal');
    const speedRef = useRef(1);
    useEffect(() => {
        speedRef.current = SPEED_OPTIONS.find((o) => o.id === speed)?.multiplier ?? 1;
    }, [speed]);

    const { detailsState, updateState } = useContext(DetailsStateContext);
    const handleToggle = (id, isOpen) => updateState(id, isOpen);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms * speedRef.current));

    useEffect(() => {
        if (array.length === 0 && activeTab !== 'create') {
            setActiveTab('create');
        }
    }, [array.length]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (skipResetRef.current) {
            // This array change is us committing the sorted result — keep
            // the finished tree on screen instead of clearing it.
            skipResetRef.current = false;
            return;
        }
        setComparisons(0);
        setStepMessage('');
        setIsSorted(false);
        setTree(null);
        setVisibleDepth(-1);
        setNodeValues({});
        nodeValuesRef.current = {};
        setActiveNodeKey(null);
        setFlashKey(null);
        setCompareInNode({ leftKey: null, leftIdx: -1, rightKey: null, rightIdx: -1 });
        setConsumedKeys(new Set());
    }, [array]);

    // =========================================================
    // Conquer — real recursive post-order merge. Children are always
    // fully resolved before their parent, which is exactly why this
    // naturally works its way from the bottom of the tree back up.
    // Returns true if the sort was aborted partway through.
    // =========================================================
    const mergeNode = async (node) => {
        if (abortRef.current) return true;

        if (node.children.length === 0) {
            // A single element is trivially already sorted — a quick pulse
            // marks the recursion's base case.
            const key = nodeKey(node);
            setFlashKey(key);
            await delay(120);
            setFlashKey(null);
            return false;
        }

        const [leftChild, rightChild] = node.children;
        if (await mergeNode(leftChild)) return true;
        if (await mergeNode(rightChild)) return true;
        if (abortRef.current) return true;

        const key = nodeKey(node);
        const leftKey = nodeKey(leftChild);
        const rightKey = nodeKey(rightChild);
        const leftValues = nodeValuesRef.current[leftKey];
        const rightValues = nodeValuesRef.current[rightKey];

        setActiveNodeKey(key);
        setStepMessage(`Merging [${leftChild.left}..${leftChild.right}] and [${rightChild.left}..${rightChild.right}]`);
        await delay(550);

        const merged = [];
        let i = 0;
        let j = 0;

        while (i < leftValues.length && j < rightValues.length) {
            if (abortRef.current) return true;
            setCompareInNode({ leftKey, leftIdx: i, rightKey, rightIdx: j });
            setComparisons((c) => c + 1);
            setStepMessage(`Comparing ${leftValues[i]} and ${rightValues[j]}`);
            await delay(600);

            if (leftValues[i] <= rightValues[j]) {
                merged.push(leftValues[i]);
                i++;
            } else {
                merged.push(rightValues[j]);
                j++;
            }
            setCompareInNode({ leftKey: null, leftIdx: -1, rightKey: null, rightIdx: -1 });
            await delay(150);
        }
        while (i < leftValues.length) {
            merged.push(leftValues[i]);
            i++;
        }
        while (j < rightValues.length) {
            merged.push(rightValues[j]);
            j++;
        }

        nodeValuesRef.current[key] = merged;
        setNodeValues((prev) => ({ ...prev, [key]: merged }));
        setConsumedKeys((prev) => {
            const next = new Set(prev);
            next.add(leftKey);
            next.add(rightKey);
            return next;
        });
        setFlashKey(key);
        setActiveNodeKey(null);
        await delay(400);
        setFlashKey(null);

        return false;
    };

    // =========================================================
    // Sort — build the tree, reveal it top-down (divide), then run
    // the real recursive merge (conquer) which resolves bottom-up.
    // =========================================================
    const mergeSort = async () => {
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
        setStepMessage('');

        const root = buildTree(0, array.length - 1);
        const rows = collectRows(root);

        const initialValues = {};
        rows.forEach((rowNodes) => {
            rowNodes.forEach((node) => {
                initialValues[nodeKey(node)] = array.slice(node.left, node.right + 1);
            });
        });
        nodeValuesRef.current = initialValues;
        setNodeValues(initialValues);
        setConsumedKeys(new Set());
        setActiveNodeKey(null);
        setFlashKey(null);
        setCompareInNode({ leftKey: null, leftIdx: -1, rightKey: null, rightIdx: -1 });
        setTree({ root, rows });
        setVisibleDepth(0);

        // ---- Divide phase: reveal each level of the split, top to bottom ----
        setStepMessage('Dividing the array in half, repeatedly, down to single elements.');
        await delay(500);
        for (let d = 1; d < rows.length; d++) {
            if (abortRef.current) {
                setIsRunning(false);
                setStepMessage('');
                toast.info('Sorting aborted.');
                return;
            }
            setVisibleDepth(d);
            await delay(550);
        }
        await delay(500);

        // ---- Conquer phase: merge back up, level by level, in practice ----
        setStepMessage('Merging pairs back together, smallest first, until the array is fully sorted.');
        await delay(500);

        const aborted = await mergeNode(root);

        setActiveNodeKey(null);
        setFlashKey(null);
        setCompareInNode({ leftKey: null, leftIdx: -1, rightKey: null, rightIdx: -1 });

        if (aborted) {
            setIsRunning(false);
            setStepMessage('');
            toast.info('Sorting aborted.');
            return;
        }

        const finalValues = nodeValuesRef.current[nodeKey(root)];
        skipResetRef.current = true;
        setArray(finalValues);
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

    return (
        <div>
            <Helmet>
                <title>Merge Sort Visualizer | Divide &amp; Conquer Simulator</title>
                <meta
                    name="description"
                    content="Watch Merge Sort split an array into halves and merge them back together in sorted order."
                />
                <meta name="keywords" content="merge sort simulator, divide and conquer visualizer, recursive sorting tool" />
            </Helmet>

            <TopicCard topicName="Merge Sort" />

            <details
                id="mergeSortOp"
                className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
                onToggle={(e) => handleToggle('mergeSortOp', e.target.open)}
                open={detailsState['mergeSortOp'] !== undefined ? detailsState['mergeSortOp'] : true}
            >
                <summary className="cursor-pointer select-none px-4 py-4 sm:px-5 text-base sm:text-lg md:text-xl font-semibold text-ink marker:text-accent hover:bg-bg/50 transition-colors">
                    Merge Sort
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
                                <p className="text-xs leading-relaxed text-muted">
                                    Splits the array in half, recursively, down to single elements — then merges pairs back together, sorted, all the way up.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
                                <span>Tree depth: {tree ? tree.rows.length - 1 : '—'}</span>
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
                                <button type="button" onClick={mergeSort} className="opBtn w-full whitespace-nowrap sm:w-auto">
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
                                <div>
                                    {/* Index row */}
                                    <div className="mb-2 grid" style={{ gridTemplateColumns: `repeat(${array.length}, ${CELL_WIDTH}px)` }}>
                                        {array.map((_, index) => (
                                            <div key={`idx-${index}`} className="flex h-6 items-center justify-center text-xs font-medium text-muted">
                                                {index}
                                            </div>
                                        ))}
                                    </div>

                                    {!tree ? (
                                        // Plain single row — shown until Sort builds the recursion tree.
                                        <div className="grid" style={{ gridTemplateColumns: `repeat(${array.length}, ${CELL_WIDTH}px)` }}>
                                            {array.map((item, index) => (
                                                <div
                                                    key={`cell-${index}`}
                                                    id={`node-${index}`}
                                                    ref={(el) => (divRefs.current[index] = el)}
                                                    className={`cell arrayDiv h-11 w-14 shrink-0 font-semibold animate-fadeIn
                                                    ${item === 'NULL' ? 'italic font-normal text-muted' : ''}`}
                                                    style={{ animationDelay: `${oldArray ? '0.2' : index * 0.2}s`, animationFillMode: 'both' }}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Full recursion tree — one row per depth, each block a sub-array.
                                        <div className="flex flex-col gap-2">
                                            {tree.rows.slice(0, visibleDepth + 1).map((rowNodes, depth) => (
                                                <div
                                                    key={depth}
                                                    className="grid animate-fadeIn"
                                                    style={{ gridTemplateColumns: `repeat(${array.length}, ${CELL_WIDTH}px)`, animationFillMode: 'both' }}
                                                >
                                                    {rowNodes.map((node) => {
                                                        const key = nodeKey(node);
                                                        const values = nodeValues[key] || [];
                                                        const isActive = activeNodeKey === key;
                                                        const isFlashing = flashKey === key;
                                                        const isConsumed = consumedKeys.has(key);

                                                        return (
                                                            <div
                                                                key={key}
                                                                style={{ gridColumn: `${node.left + 1} / ${node.right + 2}` }}
                                                                className={`flex h-11 divide-x divide-border overflow-hidden rounded-md border-2 transition-all duration-300
                                                                ${isActive ? 'border-accent' : 'border-border'}
                                                                ${isFlashing ? 'scale-105 border-sorted' : ''}
                                                                ${isConsumed ? 'opacity-40' : ''}`}
                                                            >
                                                                {values.map((v, idx) => {
                                                                    const isComparing =
                                                                        (compareInNode.leftKey === key && compareInNode.leftIdx === idx) ||
                                                                        (compareInNode.rightKey === key && compareInNode.rightIdx === idx);
                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            className="flex w-14 shrink-0 items-center justify-center text-sm font-semibold transition-colors duration-200"
                                                                            style={
                                                                                isComparing
                                                                                    ? {
                                                                                        backgroundColor: 'rgb(var(--color-comparing))',
                                                                                        color: 'rgb(var(--color-comparing-text))',
                                                                                    }
                                                                                    : isFlashing
                                                                                        ? {
                                                                                            backgroundColor: 'rgb(var(--color-sorted) / 0.2)',
                                                                                            color: 'rgb(var(--color-text-primary))',
                                                                                        }
                                                                                        : undefined
                                                                            }
                                                                        >
                                                                            {v}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {stepMessage && (
                                        <div
                                            className="mt-3 rounded-md border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-secondary sm:text-sm"
                                            aria-live="polite"
                                        >
                                            {stepMessage}
                                        </div>
                                    )}

                                    {tree && (
                                        <p className="mt-2 text-xs leading-relaxed text-muted">
                                            Each row is one level of the split. Faded blocks have already been merged upward into the row above.
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <StateLegend
                                            items={[
                                                { token: 'comparing', label: 'Comparing' },
                                                { token: 'sorted', label: 'Just merged' },
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

            <TopicCard topicName="Real-life Use (Merge Sort)" />
        </div>
    );
};

export default MergeSort;