"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { DetailsStateContext } from "../../context/DetailsContext";
import StateLegend from "../../components/StateLegend";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OPERATION_TABS = [
    { id: 'create', label: 'Create' },
    { id: 'pushpop', label: 'Push / Pop' },
    { id: 'insert', label: 'Insert' },
    { id: 'delete', label: 'Delete' },
];

const BinarySearchClient = () => {
    const [array, setArray] = useState([22, 25, 32, 48, 51, 57, 64, 73]);
    const [arrExist, setArrExist] = useState(true);
    const [oldArray, setOldArray] = useState(false);

    const [arrayLength, setArrayLength] = useState('');
    const [pushValue, setPushValue] = useState('');
    const [insertValue, setInsertValue] = useState('');
    const [insertIndex, setInsertIndex] = useState('');
    const [deleteValue, setDeleteValue] = useState('');

    const [activeTab, setActiveTab] = useState('create');

    const [searchEle, setSearchEle] = useState('');
    const [isEqual, setIsEqual] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(array.length - 1);
    const [mid, setMid] = useState(0);
    const [isVisible, setIsVisible] = useState(array.length > 0);
    const [isMidVisible, setIsMidVisible] = useState(false);
    const [isFound, setIsFound] = useState('');
    const [iterations, setIterations] = useState(0);
    const [emptySearchElement, setEmptySearchElement] = useState(false);
    const [stepMessage, setStepMessage] = useState('');
    const abortRef = useRef(false);
    const divRefs = useRef([]);

    const { detailsState, updateState } = useContext(DetailsStateContext);
    const handleToggle = (id, isOpen) => updateState(id, isOpen);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const hasEmptySlots = arrExist && array.includes('NULL');

    useEffect(() => {
        setEmptySearchElement(false);
    }, [searchEle]);

    useEffect(() => {
        if (array.length === 0 && activeTab !== 'create') {
            setActiveTab('create');
        }
    }, [array.length]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (array.length === 0) {
            setIsVisible(false);
            setHigh(0);
        } else {
            setIsVisible(true);
            setHigh(array.length - 1);
        }
        setIsEqual(false);
        setLow(0);
        setIsMidVisible(false);
        setIsFound('');
        setIterations(0);
        setStepMessage('');
    }, [array, searchEle]);

    // =========================================================
    // Search
    // =========================================================
    const binSearch = async () => {
        if (!arrExist) {
            toast.error('Please create an array first.');
            return;
        }
        if (searchEle === '') {
            toast.error('Please enter a search element.');
            setEmptySearchElement(true);
            return;
        }
        if (array.includes('NULL')) {
            toast.error('Fill every slot first — binary search needs a fully sorted array, no empty slots.');
            return;
        }

        abortRef.current = false;
        setIsRunning(true);
        setEmptySearchElement(false);
        let currentLow = low;
        let currentHigh = high;
        setIsFound('');
        setIterations(0);
        let localIsEqual = false;
        let i = 0;
        const target = parseInt(searchEle);

        while (currentLow <= currentHigh) {
            if (abortRef.current) {
                setIsRunning(false);
                setStepMessage('');
                toast.info('Search aborted.');
                return;
            }
            const midValue = Math.floor((currentLow + currentHigh) / 2);
            setStepMessage(`Checking index ${midValue} (value ${array[midValue]}) — the midpoint of [${currentLow}, ${currentHigh}]`);
            await delay(1000);
            setMid(midValue);
            setIsMidVisible(true);
            setIterations(++i);

            await delay(1000);

            if (target === array[midValue]) {
                localIsEqual = true;
                setIsEqual(true);
                setStepMessage(`${target} = ${array[midValue]} — match found at index ${midValue}!`);
                break;
            } else if (target < array[midValue]) {
                setStepMessage(`${target} < ${array[midValue]} — target must be in the left half, so High becomes ${midValue - 1}`);
                currentHigh = midValue - 1;
            } else {
                setStepMessage(`${target} > ${array[midValue]} — target must be in the right half, so Low becomes ${midValue + 1}`);
                currentLow = midValue + 1;
            }

            setLow(currentLow);
            setHigh(currentHigh);
            await delay(1200);
        }

        if (localIsEqual) {
            toast.info('Element found');
            setIsFound('Found');
        } else {
            toast.info('Element not found');
            setIsFound('Not Found');
            setStepMessage(`Low crossed High — ${target} is not in the array.`);
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
    // Push (must maintain ascending order)
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
        if (array.includes('NULL')) {
            toast.error('Fill every empty slot with Insert before pushing a new value.');
            return;
        }
        if (array.length !== 0 && parseInt(pushValue) < array[array.length - 1]) {
            toast.info(
                `Value should be ≥ ${array[array.length - 1]} to keep the array sorted — binary search only works on sorted data.`,
                { autoClose: 8000 }
            );
            return;
        }
        setOldArray(true);
        setArray([...array, parseInt(pushValue)]);
        toast.success('Element successfully pushed into the array.');
        setPushValue('');
    };

    // =========================================================
    // Pop
    // =========================================================
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
    // Insert (with sortedness validation)
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
        const value = parseInt(insertValue);

        if (index > array.length || index < 0) {
            toast.error(`Index must be between 0 and ${array.length}.`);
            return;
        }

        if (index !== 0 && value < array[index - 1]) {
            toast.info(`Value should be ≥ ${array[index - 1]} to keep the array sorted, as binary search requires sorted data.`, {
                autoClose: 8000,
            });
            return;
        }
        if (index !== 0 && index !== array.length - 1 && value > array[index + 1]) {
            toast.info(`Value should be ≤ ${array[index + 1]} to keep the array sorted, as binary search requires sorted data.`, {
                autoClose: 8000,
            });
            return;
        }
        if (index === 0 && array.length > 1 && value > array[1]) {
            toast.info(`Value should be ≤ ${array[1]} to keep the array sorted, as binary search requires sorted data.`, {
                autoClose: 8000,
            });
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
    // Delete by value
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
        if (!array.includes(parseInt(deleteValue))) {
            toast.error('Element not found.');
            return;
        }
        setArray((prev) => prev.map((item) => (item === parseInt(deleteValue) ? 'NULL' : item)));
        toast.success('Element deleted.');
        setDeleteValue('');
    };

    // =========================================================
    // Delete array
    // =========================================================
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
        <details
            id="binarySearchOp"
            className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
            onToggle={(e) => handleToggle('binarySearchOp', e.target.open)}
            open={detailsState['binarySearchOp'] !== undefined ? detailsState['binarySearchOp'] : true}
        >
            <summary className="cursor-pointer select-none px-4 py-4 sm:px-5 text-base sm:text-lg md:text-xl font-semibold text-ink marker:text-accent hover:bg-bg/50 transition-colors">
                Binary Search
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
                                Binary search needs sorted data. New slots start as <span className="font-medium text-ink">NULL</span> — fill them
                                in ascending order using Push or Insert below.
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
                                Push only accepts a value ≥ the current last element, to keep the array sorted. Fill empty slots with Insert first.
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
                                Insert at any index — the value must keep neighboring elements in ascending order.
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
              SEARCH PANEL
          ================================================= */}
                <div className="mt-5 rounded-lg border border-border bg-bg p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-ink">Search</h3>
                            <p className="text-xs leading-relaxed text-muted">Repeatedly halves the range using the midpoint.</p>
                        </div>
                        <span className="text-xs font-medium text-muted">Iterations: {iterations}</span>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="number"
                            value={searchEle}
                            onChange={(e) => setSearchEle(e.target.value)}
                            className={`opInput w-full sm:flex-1 ${emptySearchElement ? '!border-swapping' : ''}`}
                            placeholder="Value to search for"
                            disabled={isRunning}
                        />
                        {isRunning ? (
                            <button type="button" onClick={() => (abortRef.current = true)} className="opBtn-danger w-full whitespace-nowrap sm:w-auto">
                                Abort Search
                            </button>
                        ) : (
                            <button type="button" onClick={binSearch} className="opBtn w-full whitespace-nowrap sm:w-auto">
                                Search
                            </button>
                        )}
                    </div>
                    {hasEmptySlots && (
                        <p className="mt-2 text-xs text-swapping">
                            Fill every slot before searching — {array.filter((v) => v === 'NULL').length} slot(s) still empty.
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
                        {isFound && (
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${isFound === 'Found' ? 'bg-sorted/10 text-sorted' : 'bg-swapping/10 text-swapping'
                                    }`}
                            >
                                {isFound}
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-5">
                        {arrExist && array.length > 0 ? (
                            <div className="w-max min-w-full">
                                <div className="grid w-fit grid-rows-3" style={{ gridTemplateColumns: `repeat(${array.length}, auto)` }}>
                                    {/* Mid label row */}
                                    {array.map((item, index) => (
                                        <div key={`mid-${index}`} className="flex h-6 w-14 shrink-0 items-center justify-center text-xs font-semibold text-pivot">
                                            {index === mid && isMidVisible ? 'Mid' : ''}
                                        </div>
                                    ))}

                                    {/* Low/High label row */}
                                    {array.map((item, index) => (
                                        <div key={`lh-${index}`} className="flex h-6 w-14 shrink-0 items-center justify-center text-xs font-medium text-frontier">
                                            {index === low ? 'Low' : index === high ? 'High' : ''}
                                        </div>
                                    ))}

                                    {/* Cells */}
                                    {array.map((item, index) => {
                                        const eliminated = isVisible && (index < low || index > high);
                                        const isMid = index === mid && isMidVisible;
                                        const isMatch = isMid && isEqual;

                                        return (
                                            <div
                                                key={`cell-${index}`}
                                                id={`node-${index}`}
                                                ref={(el) => (divRefs.current[index] = el)}
                                                className={`cell arrayDiv h-11 w-14 shrink-0 font-semibold
                                                    ${item === 'NULL' ? 'italic font-normal text-muted' : ''}
                                                    ${eliminated ? '!bg-visited/10 !border-visited/40 opacity-40' : ''}
                                                    ${isMid && !isMatch ? '!border-pivot !bg-pivot text-pivot-text animate-pulse' : ''}
                                                    ${isMatch ? '!border-sorted !bg-sorted text-sorted-text' : ''}`}
                                                style={{ animationDelay: `${oldArray ? '0.2' : index * 0.2}s`, animationFillMode: 'both' }}
                                            >
                                                {item}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 min-h-[1.5rem] text-sm font-semibold text-muted">
                                    {isVisible && (
                                        <span>
                                            Low = {low} {isMidVisible ? `· Mid = ${mid}` : ''} · High = {high}
                                        </span>
                                    )}
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
                                            { token: 'frontier', label: 'Low / High' },
                                            { token: 'pivot', label: 'Mid (checking)' },
                                            { token: 'visited', label: 'Eliminated range' },
                                            { token: 'sorted', label: 'Found' },
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
};

export default BinarySearchClient;