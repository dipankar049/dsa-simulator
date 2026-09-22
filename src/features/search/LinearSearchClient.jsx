'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { buildLinearSearchSteps } from '@/lib/algorithms/linearSearch';
import {
    getSpeedMs,
    getLinearSearchFrameDelay,
    LINEAR_SEARCH_STEP_ACTIONS,
} from '@/lib/simulation';
import { useStepPlayback } from '@/hooks/useStepPlayback';
import {
    CollapsibleSimulatorSection,
    ArrayWorkbench,
    SpeedSelector,
    PlaybackControls,
    StepCallout,
    VisualizationViewport,
    EmptyVisualizationPlaceholder,
} from '@/components/simulator';

const OPERATION_TABS = [
    { id: 'create', label: 'Create' },
    { id: 'pushpop', label: 'Push / Pop' },
    { id: 'insert', label: 'Insert' },
    { id: 'delete', label: 'Delete' },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function LinearSearchClient() {
    const [array, setArray] = useState([42, 17, 63, 29, 74, 11]);
    const [arrExist, setArrExist] = useState(true);
    const [oldArray, setOldArray] = useState(false);

    const [arrayLength, setArrayLength] = useState('');
    const [pushValue, setPushValue] = useState('');
    const [insertValue, setInsertValue] = useState('');
    const [insertIndex, setInsertIndex] = useState('');
    const [deleteValue, setDeleteValue] = useState('');

    const [activeTab, setActiveTab] = useState('create');

    const [searchEle, setSearchEle] = useState('');
    const [emptySearchElement, setEmptySearchElement] = useState(false);
    const [speed, setSpeed] = useState('normal');
    const speedMs = getSpeedMs(speed);

    const resultToastShownRef = useRef(false);

    const handlePlaybackStepChange = useCallback((step) => {
        if (!step) return;
        if (step.type === 'found' && !resultToastShownRef.current) {
            toast.info('Element found');
            resultToastShownRef.current = true;
        }
        if (step.type === 'not-found' && !resultToastShownRef.current) {
            toast.info('Element not found');
            resultToastShownRef.current = true;
        }
    }, []);

    const getFrameDelayForStep = useCallback(
        (step) => getLinearSearchFrameDelay(step?.type, speedMs),
        [speedMs]
    );

    const {
        stepIndex,
        isPlaying,
        isSessionActive: isSearching,
        currentStep,
        startSession,
        clearSession,
        goNext,
        goPrev,
        togglePlay,
        restart,
        pause,
        steps,
    } = useStepPlayback({
        speedMs,
        getFrameDelay: getFrameDelayForStep,
        onStepChange: handlePlaybackStepChange,
        pauseOnStepTypes: ['found', 'not-found'],
    });

    const divRefs = useRef([]);

    useEffect(() => {
        setEmptySearchElement(false);
    }, [searchEle]);

    useEffect(() => {
        if (array.length === 0 && activeTab !== 'create') {
            setActiveTab('create');
        }
    }, [array.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const resetSearchView = () => {
        clearSession();
        resultToastShownRef.current = false;
    };

    const startSearch = () => {
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

        const target = Number(searchEle);
        const generated = buildLinearSearchSteps(array, target);
        if (!generated.length) return;

        resultToastShownRef.current = false;
        startSession(generated);
    };

    const abortSearch = () => {
        pause();
        clearSession();
        toast.info('Search aborted.');
    };

    const createArray = async () => {
        if (arrayLength === '' || parseInt(arrayLength) <= 0) {
            toast.error('Array length must be greater than 0.');
            return;
        }
        resetSearchView();
        await delay(200);
        setOldArray(false);
        setArray([]);
        setArrExist(true);
        await delay(500);
        setArray(Array(parseInt(arrayLength)).fill('NULL'));
        toast.success('Array created successfully', { position: 'top-center' });
        setActiveTab('pushpop');
    };

    const arrayPushOperation = () => {
        if (!arrExist) { toast.error('Please create an array first.'); return; }
        if (pushValue === '') { toast.error('Please enter an element'); return; }
        resetSearchView();
        setOldArray(true);
        setArray([...array, Number(pushValue)]);
        toast.success('Element successfully pushed into the array.');
        setPushValue('');
    };

    const arrayPopOperation = () => {
        if (!arrExist) { toast.error('Please create an array first.'); return; }
        if (array.length === 0) { toast.error('Array is already empty.'); return; }
        resetSearchView();
        setArray(array.slice(0, -1));
        toast.success('Element popped from the array.');
    };

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
        resetSearchView();
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

    const removeByEle = () => {
        if (!arrExist) { toast.error('Please create an array first.'); return; }
        if (deleteValue === '') { toast.error('Please enter an element.'); return; }
        if (!array.includes(Number(deleteValue))) { toast.error('Element not found.'); return; }
        resetSearchView();
        setArray((prev) => prev.map((item) => (item === Number(deleteValue) ? 'NULL' : item)));
        toast.success('Element deleted.');
        setDeleteValue('');
    };

    const removeArray = () => {
        if (!arrExist) { toast.error('Please create an array first.'); return; }
        resetSearchView();
        setOldArray(false);
        setArray([]);
        setArrExist(false);
        toast.success('Array has been successfully deleted.');
        setPushValue('');
        setInsertValue('');
        setInsertIndex('');
        setDeleteValue('');
    };

    const activeIndex = isSearching && currentStep ? currentStep.index : -1;
    const showPointer = isSearching && currentStep && currentStep.type !== 'start';
    const isMatch = currentStep?.type === 'found';
    const resultLabel =
        currentStep?.type === 'found'
            ? 'Found'
            : currentStep?.type === 'not-found'
                ? 'Not Found'
                : '';

    return (
        <CollapsibleSimulatorSection detailsId="linearSearchOp" title="Linear Search">
            <ArrayWorkbench
                tabs={OPERATION_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                arrExist={arrExist}
                elementCount={array.length}
                controlsDisabled={isSearching}
            >
                {activeTab === 'create' && (
                    <div className="flex flex-col gap-3">
                        <p className="text-xs leading-relaxed text-muted">
                            Linear search doesn&apos;t require sorted data — create any array to try it on.
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                type="number"
                                min={1}
                                value={arrayLength}
                                onChange={(e) => setArrayLength(e.target.value)}
                                className="opInput w-full sm:flex-1"
                                placeholder="Array length"
                                disabled={isSearching}
                            />
                            <button type="button" onClick={createArray} disabled={isSearching} className="opBtn w-full whitespace-nowrap sm:w-auto">
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
                                disabled={isSearching}
                            />
                            <div className="flex w-full gap-2 sm:w-auto">
                                <button type="button" onClick={arrayPushOperation} disabled={isSearching} className="opBtn flex-1 whitespace-nowrap sm:flex-none">
                                    Push
                                </button>
                                <button type="button" onClick={arrayPopOperation} disabled={isSearching} className="opBtn-secondary flex-1 whitespace-nowrap sm:flex-none">
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
                                <>Valid index range: <span className="font-medium text-ink">0–{array.length}</span>.</>
                            )}
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                type="number"
                                value={insertValue}
                                onChange={(e) => setInsertValue(e.target.value)}
                                className="opInput w-full sm:flex-1"
                                placeholder="Value"
                                disabled={isSearching}
                            />
                            <input
                                type="number"
                                min={0}
                                value={insertIndex}
                                onChange={(e) => setInsertIndex(e.target.value)}
                                className="opInput w-full sm:flex-1"
                                placeholder="Index"
                                disabled={isSearching}
                            />
                            <button type="button" onClick={arrayInsert} disabled={isSearching} className="opBtn w-full whitespace-nowrap sm:w-auto">
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
                                disabled={isSearching}
                            />
                            <button type="button" onClick={removeByEle} disabled={isSearching} className="opBtn-secondary w-full whitespace-nowrap sm:w-auto">
                                Delete
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-relaxed text-muted">Need a fresh array? Remove the current array and create a new one.</p>
                            <button type="button" onClick={removeArray} className="opBtn-danger w-full whitespace-nowrap sm:w-auto">
                                Delete Array
                            </button>
                        </div>
                    </div>
                )}
            </ArrayWorkbench>

            <div className="mt-5 rounded-lg border border-border bg-bg p-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h3 className="mb-1 text-sm font-semibold text-ink">Search</h3>
                        <p className="text-xs leading-relaxed text-muted">
                            Checks each element in order, starting from index 0, until it finds a match.
                        </p>
                    </div>
                    <SpeedSelector speed={speed} onSpeedChange={setSpeed} />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                        type="number"
                        value={searchEle}
                        onChange={(e) => setSearchEle(e.target.value)}
                        className={`opInput w-full sm:flex-1 ${emptySearchElement ? '!border-swapping' : ''}`}
                        placeholder="Value to search for"
                        disabled={isSearching}
                    />
                    {!isSearching ? (
                        <button type="button" onClick={startSearch} className="opBtn w-full whitespace-nowrap sm:w-auto">
                            Search
                        </button>
                    ) : (
                        <button type="button" onClick={abortSearch} className="opBtn-danger w-full whitespace-nowrap sm:w-auto">
                            Stop
                        </button>
                    )}
                </div>
                {isSearching && (
                    <div className="mt-3">
                        <PlaybackControls
                            stepIndex={stepIndex}
                            stepsLength={steps.length}
                            isPlaying={isPlaying}
                            onPrev={goPrev}
                            onTogglePlay={togglePlay}
                            onNext={goNext}
                            onRestart={restart}
                            onStop={abortSearch}
                        />
                    </div>
                )}
            </div>

            <VisualizationViewport
                subtitle={
                    resultLabel
                        ? `${arrExist ? `${array.length} elements` : 'No array created'} · ${resultLabel}`
                        : arrExist
                            ? `${array.length} elements`
                            : 'No array created'
                }
            >
                {arrExist && array.length > 0 ? (
                    <div className="w-max min-w-full">
                        <div className="grid w-fit grid-rows-2" style={{ gridTemplateColumns: `repeat(${array.length}, auto)` }}>
                            {array.map((_, index) => (
                                <div key={`idx-${index}`} className="flex h-5 w-10 shrink-0 items-center justify-center text-[10px] font-medium text-muted sm:h-6 sm:w-14 sm:text-xs">
                                    {index}
                                </div>
                            ))}

                            {array.map((item, index) => {
                                const isCurrent = showPointer && index === activeIndex;
                                const isVisited = showPointer && activeIndex >= 0 && index < activeIndex;

                                return (
                                    <div
                                        key={`cell-${index}`}
                                        id={`node-${index}`}
                                        ref={(el) => { divRefs.current[index] = el; }}
                                        className={`cell arrayDiv h-8 w-10 shrink-0 text-xs font-semibold sm:h-11 sm:w-14 sm:text-base
                                            ${item === 'NULL' ? 'italic font-normal text-muted' : ''}
                                            ${isVisited ? '!border-visited !bg-visited/15 !text-visited' : ''}
                                            ${isCurrent && !isMatch ? '!border-frontier !bg-frontier text-frontier-text animate-pulse' : ''}
                                            ${isMatch && isCurrent ? '!border-sorted !bg-sorted text-sorted-text' : ''}`}
                                        style={{ animationDelay: `${oldArray ? '0.2' : index * 0.2}s`, animationFillMode: 'both' }}
                                    >
                                        {item}
                                    </div>
                                );
                            })}
                        </div>

                        {isSearching && currentStep?.message && (
                            <StepCallout
                                stepKey={stepIndex}
                                step={currentStep}
                                actionMap={LINEAR_SEARCH_STEP_ACTIONS}
                                message={currentStep.message}
                            />
                        )}

                        {showPointer && activeIndex >= 0 && (
                            <div className="mt-4 min-h-[1.5rem] text-sm">
                                <p className="font-semibold text-ink">
                                    {searchEle} == Arr[{activeIndex}] ({array[activeIndex]}){' '}
                                    <span className={isMatch ? 'text-sorted' : 'text-frontier'}>
                                        {isMatch ? '→ Equal' : '→ Not Equal'}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyVisualizationPlaceholder />
                )}
            </VisualizationViewport>
        </CollapsibleSimulatorSection>
    );
}
