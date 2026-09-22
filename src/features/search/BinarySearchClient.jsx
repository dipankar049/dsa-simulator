"use client";

import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
} from "react";
import StateLegend from "../../components/StateLegend";
import { toast } from "react-toastify";
import { CollapsibleSimulatorSection, SpeedSelector, PlaybackControls, StepCallout, VisualizationViewport, EmptyVisualizationPlaceholder, ArrayWorkbench } from "@/components/simulator";
import { useStepPlayback } from "@/hooks/useStepPlayback";
import { getSpeedMs, getBinarySearchFrameDelay, BINARY_SEARCH_STEP_ACTIONS, resolveStepAction, toneClassFor } from "@/lib/simulation";
import { delay } from "@/lib/simulation/timing";
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Square,
    ArrowLeftRight,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    Search,
} from "lucide-react";
import { buildBinarySearchSteps } from "@/lib/algorithms/binarySearch";

const OPERATION_TABS = [
    { id: "create", label: "Create" },
    { id: "pushpop", label: "Push / Pop" },
    { id: "insert", label: "Insert" },
    { id: "delete", label: "Delete" },
];

const BinarySearchClient = () => {
    const [array, setArray] = useState([
        22,
        25,
        32,
        48,
        51,
        73,
    ]);

    const [arrExist, setArrExist] = useState(true);
    const [oldArray, setOldArray] = useState(false);

    const [arrayLength, setArrayLength] = useState("");
    const [pushValue, setPushValue] = useState("");
    const [insertValue, setInsertValue] = useState("");
    const [insertIndex, setInsertIndex] = useState("");
    const [deleteValue, setDeleteValue] = useState("");

    const [activeTab, setActiveTab] = useState("create");

    const [searchEle, setSearchEle] = useState("");
    const [emptySearchElement, setEmptySearchElement] = useState(false);

    const [speed, setSpeed] = useState("normal");
    const speedMs = getSpeedMs(speed);
    const resultToastShownRef = useRef(false);

    const getFrameDelayForStep = useCallback(
        (step) => getBinarySearchFrameDelay(step, speedMs),
        [speedMs]
    );

    const handleSearchStepChange = useCallback((step) => {
        if (!step) return;
        if (step.type === "found" && !resultToastShownRef.current) {
            toast.info("Element found");
            resultToastShownRef.current = true;
        }
        if (step.type === "not-found" && !resultToastShownRef.current) {
            toast.info("Element not found");
            resultToastShownRef.current = true;
        }
    }, []);

    const {
        steps,
        stepIndex,
        isPlaying,
        isSessionActive: isSearching,
        currentStep,
        directionRef,
        startSession,
        clearSession,
        goNext,
        goPrev,
        togglePlay,
        restart,
        pause,
    } = useStepPlayback({
        speedMs,
        getFrameDelay: getFrameDelayForStep,
        onStepChange: handleSearchStepChange,
        pauseOnStepTypes: ["found", "not-found"],
    });

    // Current visual state
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(array.length - 1);
    const [mid, setMid] = useState(-1);
    const [isVisible, setIsVisible] = useState(array.length > 0);
    const [isMidVisible, setIsMidVisible] = useState(false);
    const [isEqual, setIsEqual] = useState(false);
    const [isFound, setIsFound] = useState("");
    const [iterations, setIterations] = useState(0);
    const [stepMessage, setStepMessage] = useState("");

    const divRefs = useRef([]);

    const hasEmptySlots =
        arrExist && array.includes("NULL");

    // =========================================================
    // Apply one search frame to the visualizer
    // =========================================================
    const applyStep = useCallback(
        (step) => {
            if (!step) return;

            setLow(step.low);
            setHigh(step.high);
            setMid(step.mid);
            setIsMidVisible(step.midVisible);
            setIsEqual(step.equal);
            setIsFound(step.found);
            setIterations(step.iterations);
            setStepMessage(step.message);
            setIsVisible(step.array.length > 0);
        },
        []
    );

    // =========================================================
    // Reset search visual state
    // =========================================================
    const resetSearchView = useCallback(
        (nextArray = array) => {
            clearSession();
            resultToastShownRef.current = false;

            setIsEqual(false);
            setLow(0);
            setHigh(
                nextArray.length > 0
                    ? nextArray.length - 1
                    : 0
            );
            setMid(-1);
            setIsVisible(nextArray.length > 0);
            setIsMidVisible(false);
            setIsFound("");
            setIterations(0);
            setStepMessage("");
        },
        [array, clearSession]
    );

    // =========================================================
    // Sync current step into UI
    // =========================================================
    useEffect(() => {
        if (currentStep) {
            applyStep(currentStep);
        }
    }, [currentStep, applyStep]);

    // =========================================================
    // Reset when search value changes
    // =========================================================
    useEffect(() => {
        setEmptySearchElement(false);

        if (isSearching) return;

        setIsEqual(false);
        setLow(0);
        setHigh(
            array.length > 0
                ? array.length - 1
                : 0
        );
        setMid(-1);
        setIsMidVisible(false);
        setIsFound("");
        setIterations(0);
        setStepMessage("");
    }, [searchEle, array.length, isSearching]);

    // =========================================================
    // Empty array behavior
    // =========================================================
    useEffect(() => {
        if (array.length === 0 && activeTab !== "create") {
            setActiveTab("create");
        }
    }, [array.length, activeTab]);

    const binSearch = () => {
        if (!arrExist) {
            toast.error(
                "Please create an array first."
            );
            return;
        }

        if (searchEle === "") {
            toast.error(
                "Please enter a search element."
            );
            setEmptySearchElement(true);
            return;
        }

        if (array.includes("NULL")) {
            toast.error(
                "Fill every slot first — binary search needs a fully sorted array, no empty slots."
            );
            return;
        }

        const target = parseInt(searchEle, 10);

        if (Number.isNaN(target)) {
            toast.error(
                "Please enter a valid number."
            );
            return;
        }

        const generatedSteps = buildBinarySearchSteps(array, target);

        if (!generatedSteps.length) {
            return;
        }

        resultToastShownRef.current = false;
        setEmptySearchElement(false);
        startSession(generatedSteps);
    };

    const handleStop = () => {
        pause();
        clearSession();
    };

    // =========================================================
    // Create array
    // =========================================================
    const createArray = async () => {
        if (
            arrayLength === "" ||
            parseInt(arrayLength, 10) <= 0
        ) {
            toast.error(
                "Array length must be greater than 0."
            );
            return;
        }

        handleStop();

        await delay(200);

        setOldArray(false);
        setArray([]);
        setArrExist(true);

        await delay(500);

        setArray(
            Array(
                parseInt(arrayLength, 10)
            ).fill("NULL")
        );

        resetSearchView([]);

        toast.success(
            "Array created successfully",
            {
                position: "top-center",
            }
        );

        setActiveTab("pushpop");
    };

    // =========================================================
    // Push
    // =========================================================
    const arrayPushOperation = () => {
        if (!arrExist) {
            toast.error(
                "Please create an array first."
            );
            return;
        }

        if (pushValue === "") {
            toast.error(
                "Please enter an element"
            );
            return;
        }

        if (array.includes("NULL")) {
            toast.error(
                "Fill every empty slot with Insert before pushing a new value."
            );
            return;
        }

        if (
            array.length !== 0 &&
            parseInt(pushValue, 10) <
            array[array.length - 1]
        ) {
            toast.info(
                `Value should be ≥ ${array[array.length - 1]
                } to keep the array sorted — binary search only works on sorted data.`,
                {
                    autoClose: 8000,
                }
            );
            return;
        }

        handleStop();

        const nextArray = [
            ...array,
            parseInt(pushValue, 10),
        ];

        setOldArray(true);
        setArray(nextArray);
        resetSearchView(nextArray);

        toast.success(
            "Element successfully pushed into the array."
        );

        setPushValue("");
    };

    // =========================================================
    // Pop
    // =========================================================
    const arrayPopOperation = () => {
        if (!arrExist) {
            toast.error(
                "Please create an array first."
            );
            return;
        }

        if (array.length === 0) {
            toast.error(
                "Array is already empty."
            );
            return;
        }

        handleStop();

        const nextArray = array.slice(0, -1);

        setArray(nextArray);
        resetSearchView(nextArray);

        toast.success(
            "Element popped from the array."
        );
    };

    // =========================================================
    // Insert
    // =========================================================
    const arrayInsert = async () => {
        if (!arrExist) {
            toast.error(
                "Please create an array first."
            );
            return;
        }

        if (insertValue === "") {
            toast.error(
                "Please enter an element."
            );
            return;
        }

        if (insertIndex === "") {
            toast.error(
                "Please enter an index."
            );
            return;
        }

        const index = parseInt(
            insertIndex,
            10
        );

        const value = parseInt(
            insertValue,
            10
        );

        if (
            index > array.length ||
            index < 0
        ) {
            toast.error(
                `Index must be between 0 and ${array.length}.`
            );
            return;
        }

        if (
            index !== 0 &&
            value < array[index - 1]
        ) {
            toast.info(
                `Value should be ≥ ${array[index - 1]
                } to keep the array sorted, as binary search requires sorted data.`,
                {
                    autoClose: 8000,
                }
            );
            return;
        }

        if (
            index !== 0 &&
            index !== array.length - 1 &&
            value > array[index + 1]
        ) {
            toast.info(
                `Value should be ≤ ${array[index + 1]
                } to keep the array sorted, as binary search requires sorted data.`,
                {
                    autoClose: 8000,
                }
            );
            return;
        }

        if (
            index === 0 &&
            array.length > 1 &&
            value > array[1]
        ) {
            toast.info(
                `Value should be ≤ ${array[1]
                } to keep the array sorted, as binary search requires sorted data.`,
                {
                    autoClose: 8000,
                }
            );
            return;
        }

        handleStop();

        await delay(1000);

        let nextArray;

        if (index === array.length) {
            nextArray = [
                ...array,
                value,
            ];
        } else {
            nextArray = array.map(
                (item, i) =>
                    i === index
                        ? value
                        : item
            );
        }

        setArray(nextArray);
        resetSearchView(nextArray);

        toast.success(
            `"${insertValue}" inserted at index ${insertIndex}`
        );

        setInsertValue("");
        setInsertIndex("");
    };

    // =========================================================
    // Delete by value
    // =========================================================
    const removeByEle = () => {
        if (!arrExist) {
            toast.error(
                "Please create an array first."
            );
            return;
        }

        if (deleteValue === "") {
            toast.error(
                "Please enter an element."
            );
            return;
        }

        if (
            !array.includes(
                parseInt(deleteValue, 10)
            )
        ) {
            toast.error(
                "Element not found."
            );
            return;
        }

        handleStop();

        const nextArray = array.map(
            (item) =>
                item ===
                    parseInt(
                        deleteValue,
                        10
                    )
                    ? "NULL"
                    : item
        );

        setArray(nextArray);
        resetSearchView(nextArray);

        toast.success(
            "Element deleted."
        );

        setDeleteValue("");
    };

    // =========================================================
    // Delete array
    // =========================================================
    const removeArray = () => {
        if (!arrExist) {
            toast.error(
                "Please create an array first."
            );
            return;
        }

        handleStop();

        setOldArray(false);
        setArray([]);
        setArrExist(false);

        resetSearchView([]);

        toast.success(
            "Array has been successfully deleted."
        );

        setPushValue("");
        setInsertValue("");
        setInsertIndex("");
        setDeleteValue("");
    };

    // =========================================================
    // Step action card
    // =========================================================
    const renderStepMessage = () => {
        if (!isSearching || !currentStep?.message) {
            return null;
        }

        const action = resolveStepAction(
            currentStep,
            BINARY_SEARCH_STEP_ACTIONS
        );

        const Icon =
            action?.icon ?? Search;

        const toneClasses = {
            accent:
                "border-accent/30 bg-accent/5 text-accent",

            comparing:
                "border-comparing/30 bg-comparing/10 text-comparing-text",

            pivot:
                "border-pivot/30 bg-pivot/10 text-pivot-text",

            sorted:
                "border-sorted/30 bg-sorted/10 text-sorted-text",

            swapping:
                "border-swapping/30 bg-swapping/10 text-swapping-text",

            secondary:
                "border-border bg-surface text-secondary",
        };

        return (
            <div
                key={stepIndex}
                className={`animate-fade-in mb-4 flex items-center gap-3 rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${toneClasses[
                    action?.tone
                ] ??
                    toneClasses.secondary
                    }`}
                aria-live="polite"
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface sm:h-9 sm:w-9">
                    <Icon
                        size={17}
                        strokeWidth={2.2}
                        className="shrink-0"
                        color="blue"
                    />
                </div>

                <div className="min-w-0">
                    <div className="text-[10px] text-white font-semibold uppercase tracking-[0.08em] opacity-70 sm:text-[11px]">
                        {action?.label ??
                            "Processing"}
                    </div>

                    <div className="mt-0.5 break-words text-xs font-medium leading-relaxed text-ink sm:text-sm">
                        {
                            currentStep.message
                        }
                    </div>
                </div>
            </div>
        );
    };

    // =========================================================
    // Player controls
    // =========================================================
    const renderPlayerControls = () => {
        if (!isSearching || !steps.length) {
            return null;
        }

        const atStart = stepIndex <= 0;
        const atEnd =
            stepIndex >= steps.length - 1;

        return (
            <div className="mb-4 w-full min-w-0 rounded-lg border border-border bg-surface p-2 sm:p-3">

                {/* =========================
                PLAYER CONTROLS
            ========================= */}
                <div className="flex w-full min-w-0 items-center gap-1 sm:gap-2">
                    {/* Previous */}
                    <button
                        type="button"
                        onClick={goPrev}
                        disabled={atStart}
                        title="Previous step"
                        className="opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-0.5 px-1.5 py-2 text-[11px] sm:flex-none sm:gap-1 sm:px-3 sm:text-sm"
                    >
                        <ChevronLeft
                            size={15}
                            className="shrink-0 sm:h-4 sm:w-4"
                        />
                        <span>Prev</span>
                    </button>

                    {/* Play / Pause */}
                    <button
                        type="button"
                        onClick={togglePlay}
                        title={
                            isPlaying
                                ? "Pause"
                                : "Play"
                        }
                        className="opBtn-primary flex min-w-0 flex-1 items-center justify-center gap-0.5 px-1.5 py-2 text-[11px] sm:flex-none sm:gap-1 sm:px-4 sm:text-sm"
                    >
                        {isPlaying ? (
                            <>
                                <Pause
                                    size={15}
                                    className="shrink-0 sm:h-4 sm:w-4"
                                />
                                <span>Pause</span>
                            </>
                        ) : (
                            <>
                                <Play
                                    size={15}
                                    className="shrink-0 sm:h-4 sm:w-4"
                                />
                                <span>Play</span>
                            </>
                        )}
                    </button>

                    {/* Next */}
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={atEnd}
                        title="Next step"
                        className="opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-0.5 px-1.5 py-2 text-[11px] sm:flex-none sm:gap-1 sm:px-3 sm:text-sm"
                    >
                        <span>Next</span>
                        <ChevronRight
                            size={15}
                            className="shrink-0 sm:h-4 sm:w-4"
                        />
                    </button>

                    {/* Restart */}
                    <button
                        type="button"
                        onClick={restart}
                        title="Restart"
                        aria-label="Restart"
                        className="opBtn-secondary flex h-9 w-9 shrink-0 items-center justify-center px-0 sm:h-auto sm:w-auto sm:gap-1 sm:px-3 sm:py-2"
                    >
                        <RotateCcw
                            size={15}
                            className="shrink-0 sm:h-4 sm:w-4"
                        />
                        <span className="hidden sm:inline">
                            Restart
                        </span>
                    </button>

                    {/* Stop */}
                    <button
                        type="button"
                        onClick={handleStop}
                        title="Stop"
                        aria-label="Stop"
                        className="opBtn-danger flex h-9 w-9 shrink-0 items-center justify-center px-0 sm:h-auto sm:w-auto sm:gap-1 sm:px-3 sm:py-2"
                    >
                        <Square
                            size={14}
                            className="shrink-0 sm:h-[15px] sm:w-[15px]"
                        />
                        <span className="hidden sm:inline">
                            Stop
                        </span>
                    </button>
                </div>

                {/* =========================
                STEP INFO
            ========================= */}
                <div className="mt-2 flex min-w-0 items-center justify-between gap-2 text-[10px] text-muted sm:text-xs">
                    <span className="shrink-0">
                        Step {stepIndex + 1} of{" "}
                        {steps.length}
                    </span>

                    <span className="hidden truncate sm:inline">
                        Space: Play/Pause · ← → Navigate
                    </span>
                </div>
            </div>
        );
    };

    return (
        <CollapsibleSimulatorSection detailsId="binarySearchOp" title="Binary Search">
                {/* =================================================
                    OPERATIONS PANEL
                ================================================= */}
                <div className="rounded-lg border border-border bg-bg p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink">
                            Build Array
                        </h3>

                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                            {arrExist
                                ? `${array.length} elements`
                                : "No array yet"}
                        </span>
                    </div>

                    <div className="mb-4 flex w-full flex-wrap rounded-md border border-borderStrong bg-surface p-1 sm:flex-nowrap">
                        {OPERATION_TABS.map(
                            (tab) => {
                                const disabled =
                                    tab.id !==
                                    "create" &&
                                    !arrExist;

                                return (
                                    <button
                                        key={
                                            tab.id
                                        }
                                        type="button"
                                        disabled={
                                            disabled ||
                                            isSearching
                                        }
                                        onClick={() =>
                                            setActiveTab(
                                                tab.id
                                            )
                                        }
                                        className={`flex-1 basis-1/2 rounded px-3 py-2 text-xs font-medium transition-colors sm:basis-0 sm:text-sm ${activeTab ===
                                            tab.id
                                            ? "bg-accent text-white"
                                            : "text-muted hover:bg-element hover:text-ink"
                                            } ${disabled ||
                                                isSearching
                                                ? "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted"
                                                : ""
                                            }`}
                                    >
                                        {
                                            tab.label
                                        }
                                    </button>
                                );
                            }
                        )}
                    </div>

                    {activeTab ===
                        "create" && (
                            <div className="flex flex-col gap-3">
                                <p className="text-xs leading-relaxed text-muted">
                                    Binary search
                                    needs sorted
                                    data. New
                                    slots start
                                    as{" "}
                                    <span className="font-medium text-ink">
                                        NULL
                                    </span>
                                    {" "}— fill them
                                    in ascending
                                    order using
                                    Push or Insert
                                    below.
                                </p>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="number"
                                        min={1}
                                        value={
                                            arrayLength
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setArrayLength(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="opInput w-full sm:flex-1"
                                        placeholder="Array length"
                                        disabled={
                                            isSearching
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            createArray
                                        }
                                        disabled={
                                            isSearching
                                        }
                                        className="opBtn w-full whitespace-nowrap sm:w-auto"
                                    >
                                        Create Array
                                    </button>
                                </div>
                            </div>
                        )}

                    {activeTab ===
                        "pushpop" && (
                            <div className="flex flex-col gap-3">
                                <p className="text-xs leading-relaxed text-muted">
                                    Push only
                                    accepts a
                                    value ≥ the
                                    current last
                                    element, to
                                    keep the
                                    array sorted.
                                    Fill empty
                                    slots with
                                    Insert first.
                                </p>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="number"
                                        value={
                                            pushValue
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setPushValue(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="opInput w-full sm:flex-1"
                                        placeholder="Value"
                                        disabled={
                                            isSearching
                                        }
                                    />

                                    <div className="flex w-full gap-2 sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={
                                                arrayPushOperation
                                            }
                                            disabled={
                                                isSearching
                                            }
                                            className="opBtn flex-1 whitespace-nowrap sm:flex-none"
                                        >
                                            Push
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                arrayPopOperation
                                            }
                                            disabled={
                                                isSearching
                                            }
                                            className="opBtn-secondary flex-1 whitespace-nowrap sm:flex-none"
                                        >
                                            Pop
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    {activeTab ===
                        "insert" && (
                            <div className="flex flex-col gap-3">
                                <p className="text-xs leading-relaxed text-muted">
                                    Insert at any
                                    index — the
                                    value must
                                    keep
                                    neighboring
                                    elements in
                                    ascending
                                    order.
                                </p>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="number"
                                        value={
                                            insertValue
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setInsertValue(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="opInput w-full sm:flex-1"
                                        placeholder="Value"
                                        disabled={
                                            isSearching
                                        }
                                    />

                                    <input
                                        type="number"
                                        min={0}
                                        value={
                                            insertIndex
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setInsertIndex(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="opInput w-full sm:flex-1"
                                        placeholder="Index"
                                        disabled={
                                            isSearching
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            arrayInsert
                                        }
                                        disabled={
                                            isSearching
                                        }
                                        className="opBtn w-full whitespace-nowrap sm:w-auto"
                                    >
                                        Insert
                                    </button>
                                </div>
                            </div>
                        )}

                    {activeTab ===
                        "delete" && (
                            <div className="flex flex-col gap-4">
                                <p className="text-xs leading-relaxed text-muted">
                                    Delete the
                                    first matching
                                    value, or
                                    clear the
                                    whole array.
                                </p>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="number"
                                        value={
                                            deleteValue
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setDeleteValue(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="opInput w-full sm:max-w-[180px]"
                                        placeholder="Value"
                                        disabled={
                                            isSearching
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeByEle
                                        }
                                        disabled={
                                            isSearching
                                        }
                                        className="opBtn-secondary w-full whitespace-nowrap sm:w-auto"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs leading-relaxed text-muted">
                                        Need a fresh
                                        array? Remove
                                        the current
                                        array and
                                        create a new
                                        one.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            removeArray
                                        }
                                        disabled={
                                            isSearching
                                        }
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
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
    <div>
        <h3 className="text-sm font-semibold text-ink">
            Search
        </h3>

        <p className="text-[10px] leading-relaxed text-muted sm:text-xs">
            Repeatedly halves the range using the midpoint.
        </p>
    </div>

    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-muted sm:text-xs">
        <span>
            Iterations: {iterations}
        </span>

        <SpeedSelector speed={speed} onSpeedChange={setSpeed} />
    </div>
</div>

                    <div className="flex flex-col gap-2 sm:flex-row">
    <input
        type="number"
        value={searchEle}
        onChange={(e) =>
            setSearchEle(e.target.value)
        }
        className={`opInput w-full sm:flex-1 ${
            emptySearchElement
                ? "!border-swapping"
                : ""
        }`}
        placeholder="Value to search for"
        disabled={isSearching}
    />

    {!isSearching ? (
        <button
            type="button"
            onClick={binSearch}
            className="opBtn flex w-full items-center justify-center gap-1.5 whitespace-nowrap sm:w-auto"
        >
            <Search
                size={16}
                strokeWidth={2.2}
            />
            Search
        </button>
    ) : (
        <div className="flex w-full gap-2 sm:w-auto">
            <button
                type="button"
                onClick={handleStop}
                className="opBtn-danger w-full whitespace-nowrap sm:w-auto"
            >
                Stop Search
            </button>
        </div>
    )}
</div>

{hasEmptySlots && (
    <p className="mt-2 text-xs text-swapping">
        Fill every slot before searching —{" "}
        {
            array.filter(
                (v) => v === "NULL"
            ).length
        }{" "}
        slot(s) still empty.
    </p>
)}

{/* Search player controls — same placement concept as Bubble Sort */}
{isSearching && steps.length > 0 && (
    <div className="mt-3 flex w-full items-center gap-1.5 sm:gap-2">
        <button
            type="button"
            onClick={goPrev}
            disabled={stepIndex <= 0}
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
                    <Pause
                        size={15}
                        className="shrink-0 sm:h-[17px] sm:w-[17px]"
                    />
                    <span>Pause</span>
                </>
            ) : (
                <>
                    <Play
                        size={15}
                        className="shrink-0 sm:h-[17px] sm:w-[17px]"
                    />
                    <span>Play</span>
                </>
            )}
        </button>

        <button
            type="button"
            onClick={goNext}
            disabled={
                stepIndex >= steps.length - 1
            }
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
            onClick={restart}
            aria-label="Restart"
            title="Restart"
            className="opBtn opBtn-secondary flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
        >
            <RotateCcw
                size={15}
                className="sm:h-[17px] sm:w-[17px]"
            />
            <span className="hidden sm:inline text-sm">
                Restart
            </span>
        </button>

        <button
            type="button"
            onClick={handleStop}
            aria-label="Stop"
            title="Stop"
            className="opBtn-danger flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
        >
            <Square
                size={14}
                className="sm:h-4 sm:w-4"
            />
            <span className="hidden sm:inline text-sm">
                Stop
            </span>
        </button>
    </div>
)}
                </div>

                {/* =================================================
                    VISUALIZER
                ================================================= */}
                <div className="mt-5 overflow-hidden rounded-xl border border-border bg-bg">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
                        <div>
                            <div className="text-sm font-semibold text-ink">
                                Array Visualizer
                            </div>

                            <div className="mt-0.5 text-xs text-muted">
                                {arrExist
                                    ? `${array.length} elements`
                                    : "No array created"}
                            </div>
                        </div>

                        {isFound && (
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${isFound ===
                                    "Found"
                                    ? "bg-sorted/10 text-sorted"
                                    : "bg-swapping/10 text-swapping"
                                    }`}
                            >
                                {isFound}
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-5">
                        {arrExist &&
                            array.length > 0 ? (
                            <div className="w-full min-w-0">
                                {/* =================================================
                                    STEP MESSAGE
                                ================================================= */}
                                {renderStepMessage()}

                                {/* =================================================
                                    PLAYER CONTROLS
                                ================================================= */}
                                {/* {renderPlayerControls()} */}

                                {/* =================================================
                                    ARRAY
                                ================================================= */}
                                <div
                                    className="grid w-fit grid-rows-3"
                                    style={{
                                        gridTemplateColumns: `repeat(${array.length}, auto)`,
                                    }}
                                >
                                    {/* Mid label row */}
                                    {array.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <div
                                                key={`mid-${index}`}
                                                className="flex h-5 w-10 shrink-0 items-center justify-center text-[10px] font-semibold text-pivot sm:h-6 sm:w-14 sm:text-xs"
                                            >
                                                {index ===
                                                    mid &&
                                                    isMidVisible
                                                    ? "Mid"
                                                    : ""}
                                            </div>
                                        )
                                    )}

                                    {/* Low / High label row */}
                                    {array.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <div
                                                key={`lh-${index}`}
                                                className="flex h-5 w-10 shrink-0 items-center justify-center text-[10px] font-medium text-frontier sm:h-6 sm:w-14 sm:text-xs"
                                            >
                                                {index ===
                                                    low ? (
                                                    "Low"
                                                ) : index ===
                                                    high ? (
                                                    "High"
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        )
                                    )}

                                    {/* Cells */}
                                    {array.map(
                                        (
                                            item,
                                            index
                                        ) => {
                                            const eliminated =
                                                isSearching &&
                                                isVisible &&
                                                (index <
                                                    low ||
                                                    index >
                                                    high);

                                            const isMid =
                                                index ===
                                                mid &&
                                                isMidVisible;

                                            const isMatch =
                                                isMid &&
                                                isEqual;

                                            return (
                                                <div
                                                    key={`cell-${index}`}
                                                    id={`node-${index}`}
                                                    ref={(
                                                        el
                                                    ) =>
                                                    (divRefs.current[
                                                        index
                                                    ] =
                                                        el)
                                                    }
                                                    className={`cell arrayDiv h-8 w-10 shrink-0 text-xs font-semibold sm:h-11 sm:w-14 sm:text-base
                                                        ${item ===
                                                            "NULL"
                                                            ? "italic font-normal text-white"
                                                            : ""
                                                        }
                                                        ${eliminated
                                                            ? "!border-visited/40 !bg-visited/10 !text-ink opacity-60"
                                                            : ""
                                                        }
                                                        ${isMid &&
                                                            !isMatch
                                                            ? "!border-pivot !bg-pivot !text-white animate-pulse"
                                                            : ""
                                                        }
                                                        ${isMatch
                                                            ? "!border-sorted !bg-sorted !text-white"
                                                            : ""
                                                        }`}
                                                    style={{
                                                        animationDelay: `${oldArray ? "0.2" : index * 0.2}s`,
                                                        animationFillMode:
                                                            "both",
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                {/* Range info */}
                                <div className="mt-4 min-h-[1.5rem] text-sm font-semibold text-muted">
                                    {isVisible &&
                                        isSearching ? (
                                        <span>
                                            Low ={" "}
                                            {low}{" "}
                                            {isMidVisible
                                                ? `· Mid = ${mid}`
                                                : ""}{" "}
                                            · High ={" "}
                                            {high}
                                        </span>
                                    ) : null}
                                </div>

                                {/* Legend */}
                                <div className="mt-4">
                                    <StateLegend
                                        items={[
                                            {
                                                token: "frontier",
                                                label: "Low / High",
                                            },
                                            {
                                                token: "pivot",
                                                label: "Mid (checking)",
                                            },
                                            {
                                                token: "visited",
                                                label: "Eliminated range",
                                            },
                                            {
                                                token: "sorted",
                                                label: "Found",
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-element text-muted">
                                    ∅
                                </div>

                                <p className="text-sm font-medium text-ink">
                                    No array to
                                    visualize
                                </p>

                                <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                                    Create an
                                    array above
                                    to start
                                    experimenting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
        </CollapsibleSimulatorSection>
    );
};

export default BinarySearchClient;