"use client";

import React, {
    useState,
    useRef,
    useEffect,
    useContext,
    useCallback,
} from "react";
import StateLegend from "../../components/StateLegend";
import { CollapsibleSimulatorSection } from "@/components/simulator";
import { toast } from "react-toastify";
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Square,
    ArrowLeftRight,
    ArrowDown,
    CheckCircle2,
} from "lucide-react";
import { buildSelectionSortSteps } from "@/lib/algorithms/selectionSort";
import { getSpeedMs, getSelectionSortFrameDelay } from "@/lib/simulation";
import { useSortPlayback } from "@/hooks/useSortPlayback";

const OPERATION_TABS = [
    { id: "create", label: "Create" },
    { id: "pushpop", label: "Push / Pop" },
    { id: "insert", label: "Insert" },
    { id: "delete", label: "Delete" },
];

const SPEED_OPTIONS = [
    { id: "slow", label: "Slow", ms: 1900 },
    { id: "normal", label: "Normal", ms: 1200 },
    { id: "fast", label: "Fast", ms: 550 },
];

const CELL_WIDTH = 56;
const SWAP_SLIDE_MS = 320;

const FRAME_PACING = {
    start: 0.5,
    compare: 1,
    "new-minimum": 0.9,
    "no-change": 0.75,
    swap: 0.85,
    "swap-animating": 0.55,
    "swap-done": 0.7,
    "no-swap": 0.75,
    sorted: 0.5,
};

function getFrameDelay(type, baseMs) {
    const floor =
        type === "swap-animating"
            ? SWAP_SLIDE_MS + 80
            : 200;

    return Math.max(
        floor,
        Math.round(baseMs * (FRAME_PACING[type] ?? 1))
    );
}

function getStepAction(step) {
    if (!step) return null;

    switch (step.type) {
        case "start":
            return {
                icon: Play,
                label: "Starting",
                tone: "accent",
            };

        case "compare":
            return {
                icon: ArrowLeftRight,
                label: "Comparing",
                tone: "comparing",
            };

        case "new-minimum":
            return {
                icon: ArrowDown,
                label: "New minimum",
                tone: "pivot",
            };

        case "no-change":
            return {
                icon: CheckCircle2,
                label: "No change",
                tone: "secondary",
            };

        case "swap":
            return {
                icon: ArrowLeftRight,
                label: "Swapping",
                tone: "swapping",
            };

        case "swap-animating":
            return {
                icon: ArrowLeftRight,
                label: "Swapping",
                tone: "swapping",
            };

        case "swap-done":
            return {
                icon: CheckCircle2,
                label: "Swap complete",
                tone: "sorted",
            };

        case "no-swap":
            return {
                icon: CheckCircle2,
                label: "No swap needed",
                tone: "secondary",
            };

        case "sorted":
            return {
                icon: CheckCircle2,
                label: "Sorted",
                tone: "sorted",
            };

        default:
            return {
                icon: ArrowLeftRight,
                label: "Processing",
                tone: "secondary",
            };
    }
}

const SelectionSortClient = () => {
    const [array, setArray] = useState([
        20,
        64,
        132,
        101,
        95,
        7,
        64,
        153,
        80,
    ]);

    const [arrExist, setArrExist] = useState(true);
    const [oldArray, setOldArray] = useState(false);

    const [arrayLength, setArrayLength] = useState("");
    const [pushValue, setPushValue] = useState("");
    const [insertValue, setInsertValue] = useState("");
    const [insertIndex, setInsertIndex] = useState("");
    const [deleteValue, setDeleteValue] = useState("");

    const [activeTab, setActiveTab] = useState("create");

    const [isSorted, setIsSorted] = useState(false);

    const [speed, setSpeed] = useState("normal");
    const speedMs = getSpeedMs(speed);

    const handleSortedStep = useCallback((step) => {
        setArray(step.array);
        setIsSorted(true);
    }, []);

    const getFrameDelayForStep = useCallback(
        (step) => getSelectionSortFrameDelay(step?.type, speedMs),
        [speedMs]
    );

    const {
        steps,
        stepIndex,
        isPlaying,
        isSorting,
        currentStep,
        directionRef,
        resetSortPlayback,
        startSortPlayback,
        goNext,
        goPrev,
        togglePlay,
        restart: restartSort,
        pause,
        clearSession,
    } = useSortPlayback({
        speedMs,
        getFrameDelay: getFrameDelayForStep,
        onSortedStep: handleSortedStep,
    });

    const resetSortView = () => {
        setIsSorted(false);
        resetSortPlayback();
    };

    const startSort = () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }
        if (array.includes("NULL")) {
            toast.error(
                "Fill every slot first — sorting needs a complete array, no empty slots."
            );
            return;
        }
        if (array.length < 2) {
            toast.info(
                "Array already has fewer than 2 elements — nothing to sort."
            );
            return;
        }

        setIsSorted(false);
        startSortPlayback(buildSelectionSortSteps(array));
    };

    const stopSort = useCallback(() => {
        if (currentStep) setArray(currentStep.array);
        pause();
        clearSession();
        toast.info("Sorting stopped.");
    }, [currentStep, pause, clearSession]);

    // =========================================================
    // Create array
    // =========================================================
    const createArray = async () => {
        if (
            arrayLength === "" ||
            parseInt(arrayLength) <= 0
        ) {
            toast.error(
                "Array length must be greater than 0."
            );
            return;
        }

        resetSortView();

        setOldArray(false);
        setArray([]);
        setArrExist(true);

        await new Promise((r) =>
            setTimeout(r, 500)
        );

        setArray(
            Array(parseInt(arrayLength)).fill("NULL")
        );

        toast.success(
            "Array created successfully",
            { position: "top-center" }
        );

        setActiveTab("pushpop");
    };

    // =========================================================
    // Push / Pop
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

        resetSortView();

        setOldArray(true);
        setArray([
            ...array,
            Number(pushValue),
        ]);

        toast.success(
            "Element successfully pushed into the array."
        );

        setPushValue("");
    };

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

        resetSortView();

        setArray(
            array.slice(0, -1)
        );

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

        const index =
            parseInt(insertIndex);

        const value =
            Number(insertValue);

        if (
            index > array.length ||
            index < 0
        ) {
            toast.error(
                `Index must be between 0 and ${array.length}.`
            );
            return;
        }

        resetSortView();

        await new Promise((r) =>
            setTimeout(r, 400)
        );

        if (index === array.length) {
            setArray((prev) => [
                ...prev,
                value,
            ]);
        } else {
            setArray((prev) =>
                prev.map((item, i) =>
                    i === index
                        ? value
                        : item
                )
            );
        }

        toast.success(
            `"${insertValue}" inserted at index ${insertIndex}`
        );

        setInsertValue("");
        setInsertIndex("");
    };

    // =========================================================
    // Delete
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
                Number(deleteValue)
            )
        ) {
            toast.error(
                "Element not found."
            );
            return;
        }

        resetSortView();

        setArray((prev) =>
            prev.map((item) =>
                item === Number(deleteValue)
                    ? "NULL"
                    : item
            )
        );

        toast.success(
            "Element deleted."
        );

        setDeleteValue("");
    };

    const removeArray = () => {
        if (!arrExist) {
            toast.error(
                "Please create an array first."
            );
            return;
        }

        resetSortView();

        setOldArray(false);
        setArray([]);
        setArrExist(false);

        toast.success(
            "Array has been successfully deleted."
        );

        setPushValue("");
        setInsertValue("");
        setInsertIndex("");
        setDeleteValue("");
    };

    // =========================================================
    // Visualizer
    // =========================================================
    const displayArray =
        isSorting && currentStep
            ? currentStep.array
            : array;

    const getCellStyle = (index) => {
        if (!isSorting || !currentStep) {
            return {};
        }

        const { first, second, min } = currentStep;

        // Currently comparing candidate with minimum
        if (currentStep.type === 'compare' && index === second) {
            return {
                backgroundColor: 'var(--color-comparing)',
                color: 'var(--color-comparing-text)',
                borderColor: 'var(--color-comparing)',
            };
        }

        // New minimum
        if (currentStep.type === 'new-minimum' && index === min) {
            return {
                backgroundColor: 'var(--color-pivot)',
                color: 'var(--color-pivot-text)',
                borderColor: 'var(--color-pivot)',
            };
        }

        // During swap animation, highlight the two cells being swapped
        if (
            currentStep.type === 'swap-animating' &&
            (index === first || index === min)
        ) {
            return {
                backgroundColor: 'var(--color-swapping)',
                color: 'var(--color-swapping-text)',
                borderColor: 'var(--color-swapping)',
            };
        }

        // Minimum so far
        if (
            min !== null &&
            min !== undefined &&
            index === min &&
            currentStep.type !== 'swap-done'
        ) {
            return {
                backgroundColor: 'var(--color-pivot)',
                color: 'var(--color-pivot-text)',
                borderColor: 'var(--color-pivot)',
            };
        }

        // Current position / sorted boundary
        if (
            first !== null &&
            first !== undefined &&
            index === first &&
            currentStep.type !== 'sorted'
        ) {
            return {
                backgroundColor: 'var(--color-frontier)',
                color: 'var(--color-frontier-text)',
                borderColor: 'var(--color-frontier)',
            };
        }

        return {};
    };

    // =========================================================
    // Swap transform
    // Only the forward transition INTO swap-animating
    // gets a transform.
    //
    // This intentionally matches Bubble Sort behaviour:
    // - swap frame: no movement
    // - swap-animating: slide
    // - swap-done: snap
    // - backward: snap
    // =========================================================
    const getCellTransform = (index) => {
        if (
            !isSorting ||
            !currentStep
        ) {
            return {
                transform: undefined,
                transition: "none",
            };
        }

        if (
            currentStep.type ===
            "swap-animating" &&
            directionRef.current ===
            "forward"
        ) {
            const from =
                currentStep.swapFrom;

            const to =
                currentStep.swapTo;

            if (index === from) {
                const distance =
                    (to - from) *
                    CELL_WIDTH;

                return {
                    transform: `translateX(${distance}px)`,
                    transition: `transform ${SWAP_SLIDE_MS}ms ease`,
                };
            }

            if (index === to) {
                const distance =
                    (to - from) *
                    CELL_WIDTH;

                return {
                    transform: `translateX(${-distance}px)`,
                    transition: `transform ${SWAP_SLIDE_MS}ms ease`,
                };
            }
        }

        return {
            transform: "none",
            transition: "none",
        };
    };

    const showSortedBadge =
        isSorting
            ? currentStep?.type === "sorted"
            : isSorted;

    return (
        <CollapsibleSimulatorSection detailsId="selectionSortOp" title="Selection Sort">
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

                    <div className="mb-4 flex w-full flex-wrap rounded-md border border-borderStrong bg-surface p-0.5 sm:flex-nowrap sm:p-1">
                        {OPERATION_TABS.map((tab) => {
                            const disabled =
                                tab.id !== "create" &&
                                !arrExist;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    disabled={
                                        disabled ||
                                        isSorting
                                    }
                                    onClick={() =>
                                        setActiveTab(
                                            tab.id
                                        )
                                    }
                                    className={`flex-1 basis-[calc(50%-4px)] m-0.5 rounded px-2 py-1.5 text-[10px] sm:basis-0 sm:m-0 sm:px-3 sm:py-2 sm:text-sm font-medium transition-colors
                      ${activeTab === tab.id
                                            ? "bg-accent text-white"
                                            : "text-muted hover:bg-element hover:text-ink"
                                        }
                      ${disabled ||
                                            isSorting
                                            ? "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted"
                                            : ""
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {activeTab === "create" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Start with an empty array of a chosen length. New slots start as{" "}
                                <span className="font-medium text-ink">
                                    NULL
                                </span>{" "}
                                — fill them with Push or Insert below.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    min={1}
                                    value={
                                        arrayLength
                                    }
                                    onChange={(e) =>
                                        setArrayLength(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Array length"
                                    disabled={
                                        isSorting
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={
                                        createArray
                                    }
                                    disabled={
                                        isSorting
                                    }
                                    className="opBtn w-full whitespace-nowrap sm:w-auto"
                                >
                                    Create Array
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "pushpop" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Push adds a value to the end of the array. Order doesn't matter yet — that's exactly what sorting will fix.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={
                                        pushValue
                                    }
                                    onChange={(e) =>
                                        setPushValue(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Value"
                                    disabled={
                                        isSorting
                                    }
                                />

                                <div className="flex w-full gap-2 sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={
                                            arrayPushOperation
                                        }
                                        disabled={
                                            isSorting
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
                                            isSorting
                                        }
                                        className="opBtn-secondary flex-1 whitespace-nowrap sm:flex-none"
                                    >
                                        Pop
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "insert" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Insert at any index — fills an empty NULL slot, or extends the array if you target the end.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={
                                        insertValue
                                    }
                                    onChange={(e) =>
                                        setInsertValue(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Value"
                                    disabled={
                                        isSorting
                                    }
                                />

                                <input
                                    type="number"
                                    min={0}
                                    value={
                                        insertIndex
                                    }
                                    onChange={(e) =>
                                        setInsertIndex(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Index"
                                    disabled={
                                        isSorting
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={
                                        arrayInsert
                                    }
                                    disabled={
                                        isSorting
                                    }
                                    className="opBtn w-full whitespace-nowrap sm:w-auto"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "delete" && (
                        <div className="flex flex-col gap-4">
                            <p className="text-xs leading-relaxed text-muted">
                                Delete the first matching value, or clear the whole array.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={
                                        deleteValue
                                    }
                                    onChange={(e) =>
                                        setDeleteValue(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:max-w-[180px]"
                                    placeholder="Value"
                                    disabled={
                                        isSorting
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={
                                        removeByEle
                                    }
                                    disabled={
                                        isSorting
                                    }
                                    className="opBtn-secondary w-full whitespace-nowrap sm:w-auto"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-relaxed text-muted">
                                    Need a fresh array? Remove the current array and create a new one.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        removeArray
                                    }
                                    disabled={
                                        isSorting
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
                    SORT PANEL
                ================================================= */}
                <div className="mt-4 rounded-lg border border-border bg-bg p-3 sm:mt-5 sm:p-4">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-ink">
                                Sort
                            </h3>

                            <p className="text-[10px] leading-relaxed text-muted sm:text-xs">
                                Finds the smallest value in the unsorted part and moves it to the front.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-muted sm:text-xs">
                            <div className="flex gap-3">
                                <span>
                                    Pass:{" "}
                                    {currentStep?.pass ??
                                        0}
                                </span>

                                <span>
                                    Comparison:{" "}
                                    {currentStep?.comparison ??
                                        0}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <span>
                                    Speed
                                </span>

                                <div className="flex rounded-md border border-borderStrong bg-surface p-0.5">
                                    {SPEED_OPTIONS.map(
                                        (opt) => (
                                            <button
                                                key={
                                                    opt.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setSpeed(
                                                        opt.id
                                                    )
                                                }
                                                className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors sm:px-2 sm:py-1 sm:text-xs ${speed ===
                                                    opt.id
                                                    ? "bg-accent text-white"
                                                    : "text-muted hover:bg-element hover:text-ink"
                                                    }`}
                                            >
                                                {
                                                    opt.label
                                                }
                                            </button>
                                        )
                                    )}
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
                            <div className="flex w-full items-center gap-1.5 sm:w-auto sm:gap-2">
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    disabled={stepIndex <= 0}
                                    className="opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-3 sm:text-sm"
                                >
                                    <ChevronLeft
                                        size={15}
                                        strokeWidth={2.2}
                                        className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                    />
                                    <span>Prev</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={togglePlay}
                                    className="opBtn flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs whitespace-nowrap sm:flex-none sm:px-3 sm:text-sm"
                                >
                                    {isPlaying ? (
                                        <>
                                            <Pause
                                                size={15}
                                                strokeWidth={2.2}
                                                className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                            />
                                            <span>Pause</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play
                                                size={15}
                                                strokeWidth={2.2}
                                                className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                            />
                                            <span>
                                                {stepIndex >= steps.length - 1
                                                    ? "Replay"
                                                    : "Play"}
                                            </span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={goNext}
                                    disabled={stepIndex >= steps.length - 1}
                                    className="opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-3 sm:text-sm"
                                >
                                    <span>Next</span>
                                    <ChevronRight
                                        size={15}
                                        strokeWidth={2.2}
                                        className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={restartSort}
                                    aria-label="Restart sorting"
                                    title="Restart"
                                    className="opBtn-secondary flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
                                >
                                    <RotateCcw
                                        size={16}
                                        strokeWidth={2.2}
                                        className="shrink-0"
                                    />
                                    <span className="hidden text-sm sm:inline">
                                        Restart
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => stopSort()}
                                    aria-label="Stop sorting"
                                    title="Stop"
                                    className="opBtn-danger flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
                                >
                                    <Square
                                        size={16}
                                        strokeWidth={2.2}
                                        className="shrink-0"
                                    />
                                    <span className="hidden text-sm sm:inline">
                                        Stop
                                    </span>
                                </button>

                                <span className="ml-auto hidden text-[10px] text-muted sm:inline sm:text-xs">
                                    Step{" "}
                                    {Math.min(
                                        stepIndex + 1,
                                        steps.length
                                    )}{" "}
                                    / {steps.length}
                                </span>
                            </div>

                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-element">
                                <div
                                    className="h-full rounded-full bg-accent transition-all duration-200"
                                    style={{
                                        width: `${steps.length
                                            ? ((stepIndex +
                                                1) /
                                                steps.length) *
                                            100
                                            : 0
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {arrExist &&
                        array.includes(
                            "NULL"
                        ) &&
                        !isSorting && (
                            <p className="mt-2 text-xs text-swapping">
                                Fill every slot before sorting —{" "}
                                {
                                    array.filter(
                                        (v) =>
                                            v ===
                                            "NULL"
                                    ).length
                                }{" "}
                                slot(s) still empty.
                            </p>
                        )}

                    {isSorting && (
                        <p className="mt-2 text-xs text-muted">
                            Current minimum:{" "}
                            <b className="text-ink">
                                {currentStep?.min >=
                                    0
                                    ? currentStep
                                        .array[
                                    currentStep
                                        .min
                                    ]
                                    : "—"}
                            </b>
                        </p>
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
                                    ? `${displayArray.length} elements`
                                    : "No array created"}
                            </div>
                        </div>

                        {showSortedBadge && (
                            <span className="rounded-full bg-sorted/10 px-2.5 py-1 text-xs font-medium text-sorted">
                                Sorted ✓
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-5">
                        {arrExist &&
                            displayArray.length >
                            0 ? (
                            <div className="w-max min-w-full">
                                <div
                                    className="grid w-fit grid-rows-2"
                                    style={{
                                        gridTemplateColumns: `repeat(${displayArray.length}, auto)`,
                                    }}
                                >
                                    {/* Index row */}
                                    {displayArray.map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <div
                                                key={`idx-${index}`}
                                                className="flex h-5 w-10 shrink-0 items-center justify-center text-[10px] font-medium text-muted sm:h-6 sm:w-14 sm:text-xs"
                                            >
                                                {
                                                    index
                                                }
                                            </div>
                                        )
                                    )}

                                    {/* Cells */}
                                    {displayArray.map(
                                        (
                                            item,
                                            index
                                        ) => {
                                            const {
                                                transform,
                                                transition,
                                            } =
                                                getCellTransform(
                                                    index
                                                );

                                            return (
                                                <div
                                                    key={`cell-${index}`}
                                                    className={`cell arrayDiv h-8 w-10 shrink-0 text-xs sm:h-11 sm:w-14 sm:text-base font-semibold relative
                ${item ===
                                                            "NULL"
                                                            ? "italic font-normal text-muted"
                                                            : ""
                                                        }
                ${transform !==
                                                            "none"
                                                            ? "z-10"
                                                            : ""
                                                        }`}
                                                    style={{
                                                        ...getCellStyle(
                                                            index
                                                        ),
                                                        transform,
                                                        transition,
                                                        animationDelay:
                                                            `${oldArray
                                                                ? "0.2"
                                                                : index *
                                                                0.2
                                                            }s`,
                                                        animationFillMode:
                                                            "both",
                                                    }}
                                                >
                                                    {
                                                        item
                                                    }
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                {isSorting && currentStep?.message && (
                                    <div className="mb-4 mt-3" aria-live="polite">
                                        {(() => {
                                            const action = getStepAction(currentStep);
                                            const Icon =
                                                action?.icon ?? ArrowLeftRight;

                                            const toneClasses = {
                                                accent:
                                                    "border-accent/30 bg-accent/5 text-accent",

                                                comparing:
                                                    "border-comparing/30 bg-comparing/10 text-comparing-text",

                                                swapping:
                                                    "border-swapping/30 bg-swapping/10 text-swapping-text",

                                                pivot:
                                                    "border-pivot/30 bg-pivot/10 text-pivot-text",

                                                sorted:
                                                    "border-sorted/30 bg-sorted/10 text-sorted-text",

                                                secondary:
                                                    "border-border bg-surface text-secondary",
                                            };

                                            return (
                                                <div
                                                    key={stepIndex}
                                                    className={`animate-fade-in flex items-center gap-3 rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${toneClasses[
                                                        action?.tone
                                                    ] ??
                                                        toneClasses.secondary
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
                                                            {action?.label ??
                                                                "Processing"}
                                                        </div>

                                                        <div className="mt-0.5 text-xs font-medium leading-relaxed text-ink sm:text-sm">
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
                                            {
                                                token: "frontier",
                                                label: "Sorted boundary",
                                            },
                                            {
                                                token: "comparing",
                                                label: "New minimum",
                                            },
                                            {
                                                token: "pivot",
                                                label: "Minimum so far",
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
                                    No array to visualize
                                </p>

                                <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                                    Create an array above to start experimenting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
        </CollapsibleSimulatorSection>
    );
};

export default SelectionSortClient;