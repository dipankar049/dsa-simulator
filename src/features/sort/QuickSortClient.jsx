"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { DetailsStateContext } from "@/context/DetailsContext";
import StateLegend from "@/components/StateLegend";
import { toast } from "react-toastify";
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Square,
    ArrowLeftRight,
    ArrowLeft,
    CircleDot,
    CheckCircle2,
} from "lucide-react";

const OPERATION_TABS = [
    { id: "create", label: "Create" },
    { id: "pushpop", label: "Push / Pop" },
    { id: "insert", label: "Insert" },
    { id: "delete", label: "Delete" },
];

const CELL_WIDTH = 56;

const SPEED_OPTIONS = [
    { id: "slow", label: "Slow", ms: 1900 },
    { id: "normal", label: "Normal", ms: 1200 },
    { id: "fast", label: "Fast", ms: 550 },
];

const FRAME_PACING = {
    start: 0.5,
    "choose-pivot": 0.7,
    compare: 1,
    "move-left": 0.85,
    "swap-animating": 0.55,
    "swap-done": 0.7,
    "pivot-animating": 0.55,
    "pivot-done": 0.7,
    "partition-done": 0.8,
    sorted: 0.5,
};

const SWAP_SLIDE_MS = 320;

function getFrameDelay(type, baseMs) {
    const floor =
        type === "swap-animating" || type === "pivot-animating"
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

        case "choose-pivot":
            return {
                icon: CircleDot,
                label: "Choosing pivot",
                tone: "pivot",
            };

        case "compare":
            return {
                icon: ArrowLeftRight,
                label: "Comparing",
                tone: "comparing",
            };

        case "move-left":
            return {
                icon: ArrowLeft,
                label: "Moving left",
                tone: "secondary",
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

        case "pivot-animating":
            return {
                icon: CircleDot,
                label: "Placing pivot",
                tone: "pivot",
            };

        case "pivot-done":
            return {
                icon: CheckCircle2,
                label: "Pivot placed",
                tone: "sorted",
            };

        case "partition-done":
            return {
                icon: CheckCircle2,
                label: "Partition complete",
                tone: "sorted",
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

export default function QuickSortClient() {
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

    // =========================================================
    // Sort player state
    // =========================================================
    const [steps, setSteps] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isSorted, setIsSorted] = useState(false);
    const [partitions, setPartitions] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const [stepMessage, setStepMessage] = useState("");

    const [pivotIndex, setPivotIndex] = useState(-1);
    const [scanIndex, setScanIndex] = useState(-1);
    const [sortedIndices, setSortedIndices] = useState(() => new Set());

    const [speed, setSpeed] = useState("normal");

    const directionRef = useRef("forward");
    const sortedToastShownRef = useRef(false);

    const divRefs = useRef([]);

    const { detailsState, updateState } =
        useContext(DetailsStateContext);

    const handleToggle = (id, isOpen) =>
        updateState(id, isOpen);

    const currentStep = steps[stepIndex] ?? null;

    // =========================================================
    // Array tab behavior
    // =========================================================
    useEffect(() => {
        if (array.length === 0 && activeTab !== "create") {
            setActiveTab("create");
        }
    }, [array.length, activeTab]);

    // =========================================================
    // QUICK SORT STEP GENERATOR
    //
    // Lomuto partition:
    // - Last element of the range is the pivot.
    // - Values smaller than pivot move left.
    // - Pivot is placed in its final position.
    // - Recursively sort left and right partitions.
    // =========================================================
    const buildQuickSortSteps = (initialArray) => {
        const working = [...initialArray];
        const generatedSteps = [];

        let partitionCount = 0;
        let comparisonCount = 0;

        const sorted = new Set();

        const pushStep = ({
            type,
            message,
            low = null,
            high = null,
            pivot = null,
            scan = null,
            swap = null,
        }) => {
            generatedSteps.push({
                type,
                array: [...working],
                low,
                high,
                pivot,
                scan,
                swap,
                sorted: new Set(sorted),
                partitions: partitionCount,
                comparisons: comparisonCount,
                message,
            });
        };

        const quickSort = (low, high) => {
            if (low > high) {
                return;
            }

            // One element is already sorted.
            if (low === high) {
                sorted.add(low);

                pushStep({
                    type: "partition-done",
                    low,
                    high,
                    message: `${working[low]} is already in its sorted position.`,
                });

                return;
            }

            partitionCount++;

            const pivotIndex = high;
            const pivotValue = working[pivotIndex];

            pushStep({
                type: "choose-pivot",
                low,
                high,
                pivot: pivotIndex,
                message: `Choosing ${pivotValue} as the pivot.`,
            });

            let i = low - 1;

            for (let j = low; j < high; j++) {
                comparisonCount++;

                pushStep({
                    type: "compare",
                    low,
                    high,
                    pivot: pivotIndex,
                    scan: j,
                    message: `Comparing ${working[j]} with pivot ${pivotValue}.`,
                });

                if (working[j] < pivotValue) {
                    i++;

                    if (i !== j) {
                        pushStep({
                            type: "move-left",
                            low,
                            high,
                            pivot: pivotIndex,
                            scan: j,
                            swap: [i, j],
                            message: `${working[j]} < ${pivotValue} — moving it into the left partition.`,
                        });

                        // Important:
                        // This frame still contains the OLD array.
                        // The visualizer slides these two cells.
                        pushStep({
                            type: "swap-animating",
                            low,
                            high,
                            pivot: pivotIndex,
                            scan: j,
                            swap: [i, j],
                            message: `Swapping ${working[i]} and ${working[j]}.`,
                        });

                        [working[i], working[j]] = [
                            working[j],
                            working[i],
                        ];

                        // New array is committed on this frame.
                        pushStep({
                            type: "swap-done",
                            low,
                            high,
                            pivot: pivotIndex,
                            swap: [i, j],
                            message: `Swapped ${working[j]} and ${working[i]}.`,
                        });
                    }
                }
            }

            const finalPivotIndex = i + 1;

            // Move pivot to its final position.
            if (finalPivotIndex !== pivotIndex) {
                pushStep({
                    type: "pivot-animating",
                    low,
                    high,
                    pivot: pivotIndex,
                    swap: [finalPivotIndex, pivotIndex],
                    message: `Placing pivot ${pivotValue} at position ${finalPivotIndex}.`,
                });

                [working[finalPivotIndex], working[pivotIndex]] = [
                    working[pivotIndex],
                    working[finalPivotIndex],
                ];

                pushStep({
                    type: "pivot-done",
                    low,
                    high,
                    pivot: finalPivotIndex,
                    swap: [finalPivotIndex, pivotIndex],
                    message: `Pivot ${pivotValue} is now in its sorted position.`,
                });
            } else {
                pushStep({
                    type: "pivot-done",
                    low,
                    high,
                    pivot: finalPivotIndex,
                    message: `Pivot ${pivotValue} is already in its sorted position.`,
                });
            }

            sorted.add(finalPivotIndex);

            pushStep({
                type: "partition-done",
                low,
                high,
                pivot: finalPivotIndex,
                message: `Partition complete. ${pivotValue} is fixed at position ${finalPivotIndex}.`,
            });

            // Left partition.
            quickSort(low, finalPivotIndex - 1);

            // Right partition.
            quickSort(finalPivotIndex + 1, high);
        };

        pushStep({
            type: "start",
            message: "Starting Quick Sort.",
        });

        quickSort(0, working.length - 1);

        // Final frame.
        const finalSorted = new Set(
            working.map((_, index) => index)
        );

        generatedSteps.push({
            type: "sorted",
            array: [...working],
            low: null,
            high: null,
            pivot: null,
            scan: null,
            swap: null,
            sorted: finalSorted,
            partitions: partitionCount,
            comparisons: comparisonCount,
            message: "Array is sorted!",
        });

        return generatedSteps;
    };

    // =========================================================
    // START SORT
    // =========================================================
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

        const generatedSteps = buildQuickSortSteps(array);

        setSteps(generatedSteps);
        setStepIndex(0);

        setIsSorting(true);
        setIsPlaying(true);

        setIsSorted(false);
        setPartitions(0);
        setComparisons(0);
        setStepMessage("");

        setPivotIndex(-1);
        setScanIndex(-1);
        setSortedIndices(new Set());

        directionRef.current = "forward";
        sortedToastShownRef.current = false;
    };

    // =========================================================
    // STOP
    //
    // Commits the array from the current visual step.
    // =========================================================
    const stopSort = (commit = true) => {
        if (!isSorting) return;

        const step = steps[stepIndex];

        if (commit && step) {
            setArray([...step.array]);
        }

        setIsPlaying(false);
        setIsSorting(false);

        setPivotIndex(-1);
        setScanIndex(-1);

        if (step) {
            setPartitions(step.partitions);
            setComparisons(step.comparisons);
            setStepMessage(step.message);
            setSortedIndices(new Set(step.sorted));
        }
    };

    // =========================================================
    // NEXT
    // =========================================================
    const goNext = () => {
        if (!isSorting || !steps.length) return;

        directionRef.current = "forward";
        setIsPlaying(false);

        setStepIndex((prev) => {
            if (prev >= steps.length - 1) {
                return prev;
            }

            return prev + 1;
        });
    };

    // =========================================================
    // PREVIOUS
    // =========================================================
    const goPrev = () => {
        if (!isSorting || !steps.length) return;

        directionRef.current = "backward";
        setIsPlaying(false);

        setStepIndex((prev) => Math.max(0, prev - 1));
    };

    // =========================================================
    // PLAY / PAUSE
    // =========================================================
    const togglePlay = () => {
        if (!isSorting || !steps.length) return;

        // If already at the end, start again.
        if (stepIndex >= steps.length - 1) {
            directionRef.current = "forward";
            sortedToastShownRef.current = false;
            setStepIndex(0);
            setIsPlaying(true);
            return;
        }

        directionRef.current = "forward";
        setIsPlaying((prev) => !prev);
    };

    // =========================================================
    // RESTART
    // =========================================================
    const restartSort = () => {
        if (!isSorting || !steps.length) return;

        directionRef.current = "forward";
        sortedToastShownRef.current = false;

        setStepIndex(0);
        setIsPlaying(true);
    };

    // =========================================================
    // STEP SYNCHRONIZATION
    // =========================================================
    useEffect(() => {
        if (!isSorting || !currentStep) {
            return;
        }

        setPartitions(currentStep.partitions);
        setComparisons(currentStep.comparisons);
        setStepMessage(currentStep.message);

        setPivotIndex(
            currentStep.pivot !== null &&
                currentStep.pivot !== undefined
                ? currentStep.pivot
                : -1
        );

        setScanIndex(
            currentStep.scan !== null &&
                currentStep.scan !== undefined
                ? currentStep.scan
                : -1
        );

        setSortedIndices(new Set(currentStep.sorted));

        // Only commit the new array after the animation frame.
        if (
            currentStep.type === "swap-done" ||
            currentStep.type === "pivot-done" ||
            currentStep.type === "sorted"
        ) {
            setArray([...currentStep.array]);
        }
    }, [currentStep, isSorting]);

    // =========================================================
    // SORTED STATE
    // =========================================================
    useEffect(() => {
        if (!isSorting || !currentStep) {
            return;
        }

        if (currentStep.type === "sorted") {
            setArray([...currentStep.array]);
            setIsSorted(true);

            if (!sortedToastShownRef.current) {
                toast.success("Array sorted successfully!", {
                    position: "top-center",
                });

                sortedToastShownRef.current = true;
            }
        } else {
            setIsSorted(false);
        }
    }, [currentStep, isSorting]);

    // =========================================================
    // AUTOPLAY
    // =========================================================
    useEffect(() => {
        if (!isSorting || !isPlaying || !currentStep) {
            return;
        }

        if (stepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }

        const baseMs =
            SPEED_OPTIONS.find((option) => option.id === speed)?.ms ??
            1200;

        const timer = setTimeout(() => {
            directionRef.current = "forward";

            setStepIndex((prev) => {
                if (prev >= steps.length - 1) {
                    return prev;
                }

                return prev + 1;
            });
        }, getFrameDelay(currentStep.type, baseMs));

        return () => clearTimeout(timer);
    }, [
        isSorting,
        isPlaying,
        stepIndex,
        currentStep,
        speed,
        steps.length,
    ]);

    // =========================================================
    // KEYBOARD CONTROLS
    // =========================================================
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isSorting) return;

            if (event.target instanceof HTMLInputElement) {
                return;
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                goNext();
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goPrev();
            }

            if (event.code === "Space") {
                event.preventDefault();
                togglePlay();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isSorting, stepIndex, steps.length]);

    // =========================================================
    // Create array
    // =========================================================
    const createArray = async () => {
        if (
            arrayLength === "" ||
            parseInt(arrayLength) <= 0
        ) {
            toast.error("Array length must be greater than 0.");
            return;
        }

        setOldArray(false);
        setArray([]);

        setArrExist(true);

        await new Promise((resolve) =>
            setTimeout(resolve, 500)
        );

        setArray(
            Array(parseInt(arrayLength)).fill("NULL")
        );

        toast.success("Array created successfully", {
            position: "top-center",
        });

        setActiveTab("pushpop");
    };

    // =========================================================
    // Push / Pop
    // =========================================================
    const arrayPushOperation = () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }

        if (pushValue === "") {
            toast.error("Please enter an element");
            return;
        }

        setOldArray(true);
        setArray([...array, Number(pushValue)]);

        toast.success(
            "Element successfully pushed into the array."
        );

        setPushValue("");
    };

    const arrayPopOperation = () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }

        if (array.length === 0) {
            toast.error("Array is already empty.");
            return;
        }

        setArray(array.slice(0, -1));

        toast.success("Element popped from the array.");
    };

    // =========================================================
    // Insert
    // =========================================================
    const arrayInsert = async () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }

        if (insertValue === "") {
            toast.error("Please enter an element.");
            return;
        }

        if (insertIndex === "") {
            toast.error("Please enter an index.");
            return;
        }

        const index = parseInt(insertIndex);
        const value = Number(insertValue);

        if (
            index > array.length ||
            index < 0
        ) {
            toast.error(
                `Index must be between 0 and ${array.length}.`
            );
            return;
        }

        await new Promise((resolve) =>
            setTimeout(resolve, 1000)
        );

        if (index === array.length) {
            setArray((prev) => [...prev, value]);
        } else {
            setArray((prev) =>
                prev.map((item, i) =>
                    i === index ? value : item
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
            toast.error("Please create an array first.");
            return;
        }

        if (deleteValue === "") {
            toast.error("Please enter an element.");
            return;
        }

        if (!array.includes(Number(deleteValue))) {
            toast.error("Element not found.");
            return;
        }

        setArray((prev) =>
            prev.map((item) =>
                item === Number(deleteValue)
                    ? "NULL"
                    : item
            )
        );

        toast.success("Element deleted.");
        setDeleteValue("");
    };

    const removeArray = () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }

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
    // Cell style
    // =========================================================
    const cellStyle = (index) => {
        if (!isSorting || !currentStep) {
            return {};
        }

        // Swap animation gets swapping state.
        if (
            (
                currentStep.type === "swap-animating" ||
                currentStep.type === "pivot-animating"
            ) &&
            currentStep.swap?.includes(index)
        ) {
            return {
                backgroundColor:
                    "rgb(var(--color-swapping))",
                borderColor:
                    "rgb(var(--color-swapping))",
                color:
                    "rgb(var(--color-swapping-text))",
            };
        }

        // Scanning element.
        if (
            currentStep.scan !== null &&
            currentStep.scan !== undefined &&
            index === currentStep.scan
        ) {
            return {
                backgroundColor:
                    "rgb(var(--color-comparing))",
                borderColor:
                    "rgb(var(--color-comparing))",
                color:
                    "rgb(var(--color-comparing-text))",
            };
        }

        // Pivot.
        if (
            currentStep.pivot !== null &&
            currentStep.pivot !== undefined &&
            index === currentStep.pivot
        ) {
            return {
                backgroundColor:
                    "rgb(var(--color-pivot))",
                borderColor:
                    "rgb(var(--color-pivot))",
                color:
                    "rgb(var(--color-pivot-text))",
            };
        }

        // Already placed correctly.
        if (currentStep.sorted.has(index)) {
            return {
                backgroundColor:
                    "rgb(var(--color-sorted) / 0.15)",
                borderColor:
                    "rgb(var(--color-sorted))",
                color:
                    "rgb(var(--color-text-primary))",
            };
        }

        return {};
    };

    // =========================================================
    // Swap transform
    //
    // IMPORTANT:
    // Only animate while moving FORWARD into the animation
    // frame. Going backward immediately resets the transform.
    // This prevents the double/reverse swap effect.
    // =========================================================
    const getCellTransform = (index) => {
        if (
            !isSorting ||
            !currentStep ||
            !currentStep.swap
        ) {
            return {
                transform: undefined,
                transition: "none",
            };
        }

        const [a, b] = currentStep.swap;

        const isSwapFrame =
            currentStep.type === "swap-animating" ||
            currentStep.type === "pivot-animating";

        if (
            isSwapFrame &&
            directionRef.current === "forward" &&
            (index === a || index === b)
        ) {
            const distance = Math.abs(b - a);

            return {
                transform:
                    index === a
                        ? `translateX(${distance * CELL_WIDTH}px)`
                        : `translateX(-${distance * CELL_WIDTH}px)`,
                transition: `transform ${SWAP_SLIDE_MS}ms ease`,
            };
        }

        return {
            transform: "none",
            transition: "none",
        };
    };

    // =========================================================
    // Render
    // =========================================================
    return (
        <details
            id="quickSortOp"
            className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
            onToggle={(e) =>
                handleToggle(
                    "quickSortOp",
                    e.target.open
                )
            }
            open={
                detailsState["quickSortOp"] !== undefined
                    ? detailsState["quickSortOp"]
                    : true
            }
        >
            <summary className="cursor-pointer select-none px-4 py-4 text-base font-semibold text-ink marker:text-accent transition-colors hover:bg-bg/50 sm:px-5 sm:text-lg md:text-xl">
                Quick Sort
            </summary>

            <div className="px-4 pb-5 sm:px-5">

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
                                        setActiveTab(tab.id)
                                    }
                                    className={`flex-1 basis-1/2 rounded px-3 py-2 text-xs font-medium transition-colors sm:basis-0 sm:text-sm
                                        ${activeTab ===
                                            tab.id
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

                    {/* Create */}
                    {activeTab === "create" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Start with an empty array of a
                                chosen length. New slots start as{" "}
                                <span className="font-medium text-ink">
                                    NULL
                                </span>{" "}
                                — fill them with Push or Insert
                                below.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    min={1}
                                    value={arrayLength}
                                    onChange={(e) =>
                                        setArrayLength(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Array length"
                                    disabled={isSorting}
                                />

                                <button
                                    type="button"
                                    onClick={createArray}
                                    disabled={isSorting}
                                    className="opBtn w-full whitespace-nowrap sm:w-auto"
                                >
                                    Create Array
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Push / Pop */}
                    {activeTab === "pushpop" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Push adds a value to the end of
                                the array. Order doesn't matter yet
                                — that's exactly what sorting will
                                fix.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={pushValue}
                                    onChange={(e) =>
                                        setPushValue(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Value"
                                    disabled={isSorting}
                                />

                                <div className="flex w-full gap-2 sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={
                                            arrayPushOperation
                                        }
                                        disabled={isSorting}
                                        className="opBtn flex-1 whitespace-nowrap sm:flex-none"
                                    >
                                        Push
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            arrayPopOperation
                                        }
                                        disabled={isSorting}
                                        className="opBtn-secondary flex-1 whitespace-nowrap sm:flex-none"
                                    >
                                        Pop
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Insert */}
                    {activeTab === "insert" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Insert at any index — fills an empty
                                NULL slot, or extends the array if
                                you target the end.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={insertValue}
                                    onChange={(e) =>
                                        setInsertValue(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Value"
                                    disabled={isSorting}
                                />

                                <input
                                    type="number"
                                    min={0}
                                    value={insertIndex}
                                    onChange={(e) =>
                                        setInsertIndex(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Index"
                                    disabled={isSorting}
                                />

                                <button
                                    type="button"
                                    onClick={arrayInsert}
                                    disabled={isSorting}
                                    className="opBtn w-full whitespace-nowrap sm:w-auto"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Delete */}
                    {activeTab === "delete" && (
                        <div className="flex flex-col gap-4">
                            <p className="text-xs leading-relaxed text-muted">
                                Delete the first matching value, or
                                clear the whole array.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={deleteValue}
                                    onChange={(e) =>
                                        setDeleteValue(
                                            e.target.value
                                        )
                                    }
                                    className="opInput w-full sm:max-w-[180px]"
                                    placeholder="Value"
                                    disabled={isSorting}
                                />

                                <button
                                    type="button"
                                    onClick={removeByEle}
                                    disabled={isSorting}
                                    className="opBtn-secondary w-full whitespace-nowrap sm:w-auto"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-relaxed text-muted">
                                    Need a fresh array? Remove the
                                    current array and create a new
                                    one.
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
                <div className="mt-5 rounded-lg border border-border bg-bg p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-ink">
                                Sort
                            </h3>

                            <p className="text-xs leading-relaxed text-muted">
                                Picks a pivot, partitions smaller
                                values to its left and larger to
                                its right, then repeats on each side.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
                            <span>
                                Partitions: {partitions}
                            </span>

                            <span>
                                Comparisons: {comparisons}
                            </span>

                            <div className="flex items-center gap-1.5">
                                <span>Speed</span>

                                <div className="flex rounded-md border border-borderStrong bg-surface p-0.5">
                                    {SPEED_OPTIONS.map(
                                        (opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() =>
                                                    setSpeed(
                                                        opt.id
                                                    )
                                                }
                                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${speed ===
                                                    opt.id
                                                    ? "bg-accent text-white"
                                                    : "text-muted hover:bg-element hover:text-ink"
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    {/* Controls */}
                    <div className="mt-4">
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
                            <div className="flex w-full items-center gap-1.5 sm:w-auto sm:gap-2">

                                {/* Previous */}
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    disabled={stepIndex === 0}
                                    className="opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-3 sm:text-sm"
                                >
                                    <ChevronLeft
                                        size={15}
                                        strokeWidth={2.2}
                                        className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                    />

                                    <span>Prev</span>
                                </button>

                                {/* Play / Pause */}
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
                                            <span>Play</span>
                                        </>
                                    )}
                                </button>

                                {/* Next */}
                                <button
                                    type="button"
                                    onClick={goNext}
                                    disabled={
                                        stepIndex >= steps.length - 1
                                    }
                                    className="opBtn-secondary flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-1.5 text-xs whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-3 sm:text-sm"
                                >
                                    <span>Next</span>

                                    <ChevronRight
                                        size={15}
                                        strokeWidth={2.2}
                                        className="shrink-0 sm:h-[17px] sm:w-[17px]"
                                    />
                                </button>

                                {/* Restart */}
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

                                {/* Stop */}
                                <button
                                    type="button"
                                    onClick={() => stopSort(true)}
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
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    {isSorting && steps.length > 0 && (
                        <div className="mt-3">
                            <div className="mb-1 flex items-center justify-between text-xs text-muted">
                                <span>
                                    Step{" "}
                                    {stepIndex + 1} of{" "}
                                    {steps.length}
                                </span>

                                <span>
                                    {Math.round(
                                        ((stepIndex + 1) /
                                            steps.length) *
                                        100
                                    )}
                                    %
                                </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-element">
                                <div
                                    className="h-full rounded-full bg-accent transition-all duration-200"
                                    style={{
                                        width: `${((stepIndex + 1) /
                                            steps.length) *
                                            100
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {arrExist &&
                        array.includes("NULL") && (
                            <p className="mt-2 text-xs text-swapping">
                                Fill every slot before sorting —{" "}
                                {
                                    array.filter(
                                        (v) => v === "NULL"
                                    ).length
                                }{" "}
                                slot(s) still empty.
                            </p>
                        )}

                    {pivotIndex >= 0 &&
                        pivotIndex < array.length && (
                            <p className="mt-2 text-xs text-muted">
                                Current pivot:{" "}
                                <b className="text-ink">
                                    {array[pivotIndex]}
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
                                    ? `${array.length} elements`
                                    : "No array created"}
                            </div>
                        </div>

                        {isSorted && (
                            <span className="rounded-full bg-sorted/10 px-2.5 py-1 text-xs font-medium text-sorted">
                                Sorted ✓
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-5">
                        {arrExist &&
                            array.length > 0 ? (
                            <div className="w-max min-w-full">
                                <div
                                    className="grid w-fit grid-rows-2"
                                    style={{
                                        gridTemplateColumns: `repeat(${array.length}, auto)`,
                                    }}
                                >
                                    {/* Index row */}
                                    {array.map(
                                        (_, index) => (
                                            <div
                                                key={`idx-${index}`}
                                                className="flex h-6 w-14 shrink-0 items-center justify-center text-xs font-medium text-muted"
                                            >
                                                {index}
                                            </div>
                                        )
                                    )}

                                    {/* Cells */}
                                    {array.map(
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
                                                    id={`node-${index}`}
                                                    ref={(el) =>
                                                    (divRefs.current[
                                                        index
                                                    ] =
                                                        el)
                                                    }
                                                    className={`cell arrayDiv h-11 w-14 shrink-0 border-2 font-semibold animate-fade-in
                                                        ${item ===
                                                            "NULL"
                                                            ? "italic font-normal text-muted"
                                                            : ""
                                                        }
                                                        ${transform !==
                                                            "none"
                                                            ? "relative z-10"
                                                            : ""
                                                        }`}
                                                    style={{
                                                        ...cellStyle(
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
                                                    {item}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                {/* Step message */}
                                {stepMessage && currentStep && (
                                    <div className="mb-4 mt-3" aria-live="polite">
                                        {(() => {
                                            const action = getStepAction(currentStep);
                                            const Icon = action?.icon ?? ArrowLeftRight;

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
                                                    className={`animate-fade-in flex items-center gap-3 rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${toneClasses[action?.tone] ??
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
                                                            {action?.label ?? "Processing"}
                                                        </div>

                                                        <div className="mt-0.5 text-xs font-medium leading-relaxed text-ink sm:text-sm">
                                                            {stepMessage}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Legend */}
                                <div className="mt-4">
                                    <StateLegend
                                        items={[
                                            {
                                                token: "pivot",
                                                label: "Pivot",
                                            },
                                            {
                                                token: "comparing",
                                                label: "Scanning",
                                            },
                                            {
                                                token: "sorted",
                                                label: "Placed correctly",
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
                                    Create an array above to
                                    start experimenting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </details>
    );
}