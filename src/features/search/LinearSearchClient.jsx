'use client';

import React, { useState, useRef, useContext, useEffect } from 'react';
import { DetailsStateContext } from '@/context/DetailsContext';
import StateLegend from '@/components/StateLegend';
import { toast } from 'react-toastify';

const OPERATION_TABS = [
    { id: 'create', label: 'Create' },
    { id: 'pushpop', label: 'Push / Pop' },
    { id: 'insert', label: 'Insert' },
    { id: 'delete', label: 'Delete' },
];

export default function LinearSearchClient() {
    const [array, setArray] = useState([42, 17, 88, 5, 63, 29, 74, 11]);
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
    const [idx, setIdx] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isFound, setIsFound] = useState('');
    const [emptySearchElement, setEmptySearchElement] = useState(false);
    const abortRef = useRef(false);
    const divRefs = useRef([]);

    const { detailsState, updateState } = useContext(DetailsStateContext);
    const handleToggle = (id, isOpen) => updateState(id, isOpen);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        setEmptySearchElement(false);
    }, [searchEle]);

    useEffect(() => {
        if (array.length === 0 && activeTab !== 'create') {
            setActiveTab('create');
        }
    }, [array.length]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setIsEqual(false);
        setIsVisible(false);
        setIdx(0);
        setIsFound('');
    }, [array, searchEle]);

    // =========================================================
    // Search
    // =========================================================
    const LinSearch = async () => {
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
            toast.error('Fill every slot first — search needs a complete array, no empty slots.');
            return;
        }

        abortRef.current = false;
        setIsRunning(true);
        setIsFound('');
        setIsEqual(false);
        setIsVisible(true);

        const target = parseInt(searchEle);
        let found = false;

        for (let i = 0; i < array.length; i++) {
            if (abortRef.current) {
                setIsRunning(false);
                setIsVisible(false);
                toast.info('Search aborted.');
                return;
            }
            setIdx(i);
            await delay(800);

            if (array[i] === target) {
                setIsEqual(true);
                found = true;
                break;
            }
        }

        if (found) {
            toast.info('Element found');
            setIsFound('Found');
        } else {
            toast.info('Element not found');
            setIsFound('Not Found');
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
        if (!arrExist) { toast.error('Please create an array first.'); return; }
        if (pushValue === '') { toast.error('Please enter an element'); return; }
        setOldArray(true);
        setArray([...array, Number(pushValue)]);
        toast.success('Element successfully pushed into the array.');
        setPushValue('');
    };

    const arrayPopOperation = () => {
        if (!arrExist) { toast.error('Please create an array first.'); return; }
        if (array.length === 0) { toast.error('Array is already empty.'); return; }
        setArray(array.slice(0, -1));
        toast.success('Element popped from the array.');
    };

    // =========================================================
    // Insert
    // =========================================================
    const arrayInsert = async () => {
        if (!arrExist) { toast.error('Please create an array first.'); return; }
        if (insertValue === '') { toast.error('Please enter an element.'); return; }
        if (insertIndex === '') { toast.error('Please enter an index.'); return; }
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
        if (!arrExist) { toast.error('Please create an array first.'); return; }
        if (deleteValue === '') { toast.error('Please enter an element.'); return; }
        if (!array.includes(Number(deleteValue))) { toast.error('Element not found.'); return; }
        setArray((prev) => prev.map((item) => (item === Number(deleteValue) ? 'NULL' : item)));
        toast.success('Element deleted.');
        setDeleteValue('');
    };

    const removeArray = () => {
        if (!arrExist) { toast.error('Please create an array first.'); return; }
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
            id="linearSearchOp"
            className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
            onToggle={(e) => handleToggle('linearSearchOp', e.target.open)}
            open={detailsState['linearSearchOp'] !== undefined ? detailsState['linearSearchOp'] : true}
        >
            <summary className="cursor-pointer select-none px-4 py-4 sm:px-5 text-base sm:text-lg md:text-xl font-semibold text-ink marker:text-accent hover:bg-bg/50 transition-colors">
                Linear Search
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
                                Linear search doesn't require sorted data — create any array to try it on.
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
                            <p className="text-xs leading-relaxed text-muted">Push adds to the end. Pop removes the last element.</p>
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
                                Insert a value at any index.{' '}
                                {arrExist && (
                                    <>
                                        Valid index range: <span className="font-medium text-ink">0–{array.length}</span>.
                                    </>
                                )}
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
                    <h3 className="mb-1 text-sm font-semibold text-ink">Search</h3>
                    <p className="mb-3 text-xs leading-relaxed text-muted">
                        Checks each element in order, starting from index 0, until it finds a match.
                    </p>
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
                            <button type="button" onClick={LinSearch} className="opBtn w-full whitespace-nowrap sm:w-auto">
                                Search
                            </button>
                        )}
                    </div>
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
                                <div className="grid w-fit grid-rows-2" style={{ gridTemplateColumns: `repeat(${array.length}, auto)` }}>
                                    {array.map((item, index) => (
                                        <div key={`idx-${index}`} className="flex h-6 w-14 shrink-0 items-center justify-center text-xs font-medium text-muted">
                                            {index}
                                        </div>
                                    ))}

                                    {array.map((item, index) => {
                                        const isCurrent = isVisible && index === idx;
                                        const isVisited = isVisible && index < idx;
                                        const isMatch = isCurrent && isEqual;

                                        return (
                                            <div
                                                key={`cell-${index}`}
                                                id={`node-${index}`}
                                                ref={(el) => (divRefs.current[index] = el)}
                                                className={`cell arrayDiv h-11 w-14 shrink-0 font-semibold
                                                    ${item === 'NULL' ? 'italic font-normal text-muted' : ''}
                                                    ${isVisited ? '!border-visited !bg-visited/15 !text-visited' : ''}
                                                    ${isCurrent && !isMatch ? '!border-frontier !bg-frontier text-frontier-text animate-pulse' : ''}
                                                    ${isMatch ? '!border-sorted !bg-sorted text-sorted-text' : ''}`}
                                                style={{ animationDelay: `${oldArray ? '0.2' : index * 0.2}s`, animationFillMode: 'both' }}
                                            >
                                                {item}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 min-h-[1.5rem] text-sm">
                                    {isVisible && (
                                        <p className="font-semibold text-ink">
                                            {searchEle} == Arr[{idx}] ({array[idx]}){' '}
                                            <span className={isEqual ? 'text-sorted' : 'text-frontier'}>{isEqual ? '→ Equal' : '→ Not Equal'}</span>
                                        </p>
                                    )}
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