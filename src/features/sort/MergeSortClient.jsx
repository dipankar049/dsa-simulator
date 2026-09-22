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
    Merge,
    Split,
    CheckCircle2,
} from "lucide-react";
import { buildMergeSortSteps, nodeKey } from "@/lib/algorithms/mergeSort";
import { MERGE_SORT_STEP_ACTIONS } from "@/lib/simulation";
import StepCallout from "@/components/simulator/StepCallout";

const OPERATION_TABS = [
    { id: "create", label: "Create" },
    { id: "pushpop", label: "Push / Pop" },
    { id: "insert", label: "Insert" },
    { id: "delete", label: "Delete" },
];

const SIBLING_GAP = 8;

const SPEED_OPTIONS = [
    { id: "slow", label: "Slow", ms: 2600 },
    { id: "normal", label: "Normal", ms: 1400 },
    { id: "fast", label: "Fast", ms: 650 },
];

const FRAME_PACING = {
    start: 0.75,
    "divide-start": 0.9,
    divide: 0.9,
    "divide-done": 0.75,

    "merge-start": 0.9,

    compare: 1.15,

    "take-left": 0.9,
    "take-right": 0.9,

    "merge-done": 1,

    sorted: 0.75,
};

function getFrameDelay(type, baseMs, speed) {
    const floor = 250;

    const speedMultiplier =
        speed === "slow"
            ? 1.25
            : speed === "fast"
                ? 0.9
                : 1;

    return Math.max(
        floor,
        Math.round(
            baseMs *
            (FRAME_PACING[type] ?? 1) *
            speedMultiplier
        )
    );
}

export default function MergeSortClient() {
    const [array, setArray] = useState([
        20,
        64,
        132,
        95,
        7,
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
    // Sort player
    // =========================================================
    const [steps, setSteps] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);

    const [isSorting, setIsSorting] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isSorted, setIsSorted] = useState(false);
    const [comparisons, setComparisons] = useState(0);
    const [stepMessage, setStepMessage] = useState("");

    const [speed, setSpeed] = useState("normal");

    const directionRef = useRef("forward");
    const sortedToastShownRef = useRef(false);

    const divRefs = useRef([]);

    // =========================================================
    // Recursion tree state
    // =========================================================
    const [tree, setTree] = useState(null);

    const [visibleDepth, setVisibleDepth] =
        useState(-1);

    const [nodeValues, setNodeValues] =
        useState({});

    const [activeNodeKey, setActiveNodeKey] =
        useState(null);

    const [flashKey, setFlashKey] =
        useState(null);

    const [compareInNode, setCompareInNode] =
        useState({
            leftKey: null,
            leftIdx: -1,
            rightKey: null,
            rightIdx: -1,
        });

    const [consumedKeys, setConsumedKeys] =
        useState(new Set());

    const {
        detailsState,
        updateState,
    } = useContext(DetailsStateContext);

    const handleToggle = (id, isOpen) =>
        updateState(id, isOpen);

    const currentStep =
        steps[stepIndex] ?? null;

    // =========================================================
    // Reset visualization when the REAL array changes.
    //
    // During sorting we do NOT mutate `array` every step.
    // The current step contains the visual state instead.
    // This is what makes Previous/Next reliable.
    // =========================================================
    useEffect(() => {
        if (isSorting) {
            return;
        }

        setComparisons(0);
        setStepMessage("");
        setIsSorted(false);

        setTree(null);
        setVisibleDepth(-1);
        setNodeValues({});
        setActiveNodeKey(null);
        setFlashKey(null);

        setCompareInNode({
            leftKey: null,
            leftIdx: -1,
            rightKey: null,
            rightIdx: -1,
        });

        setConsumedKeys(new Set());
    }, [array, isSorting]);

    useEffect(() => {
        if (
            array.length === 0 &&
            activeTab !== "create"
        ) {
            setActiveTab("create");
        }
    }, [array.length, activeTab]);

    // =========================================================
    // Start Sort
    // =========================================================
    const startSort = () => {
        if (!arrExist) {
            toast.error(
                "Please create an array first."
            );
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

        const result =
            buildMergeSortSteps(array);

        setSteps(result.steps);
        setStepIndex(0);

        setTree({
            root: result.root,
            rows: result.rows,
        });

        setIsSorting(true);
        setIsPlaying(true);
        setIsSorted(false);

        setComparisons(0);
        setStepMessage("");

        setNodeValues({});
        setVisibleDepth(-1);
        setActiveNodeKey(null);
        setFlashKey(null);

        setCompareInNode({
            leftKey: null,
            leftIdx: -1,
            rightKey: null,
            rightIdx: -1,
        });

        setConsumedKeys(new Set());

        directionRef.current =
            "forward";

        sortedToastShownRef.current =
            false;
    };

    // =========================================================
    // Stop
    // =========================================================
    const stopSort = (
        commit = true
    ) => {
        if (!isSorting) {
            return;
        }

        const step =
            steps[stepIndex];

        if (step && commit) {
            setArray([...step.array]);
        }

        setIsPlaying(false);
        setIsSorting(false);

        if (step) {
            setComparisons(
                step.comparisons
            );
            setStepMessage(
                step.message
            );

            setNodeValues(
                step.nodeValues
            );

            setVisibleDepth(
                step.visibleDepth
            );

            setActiveNodeKey(
                step.activeNodeKey
            );

            setFlashKey(
                step.flashKey
            );

            setCompareInNode(
                step.compareInNode
            );

            setConsumedKeys(
                new Set(
                    step.consumedKeys
                )
            );

            setIsSorted(
                step.type ===
                "sorted"
            );
        }
    };

    // =========================================================
    // Next
    // =========================================================
    const goNext = () => {
        if (
            !isSorting ||
            !steps.length
        ) {
            return;
        }

        directionRef.current =
            "forward";

        setIsPlaying(false);

        setStepIndex((prev) =>
            Math.min(
                prev + 1,
                steps.length - 1
            )
        );
    };

    // =========================================================
    // Previous
    // =========================================================
    const goPrev = () => {
        if (
            !isSorting ||
            !steps.length
        ) {
            return;
        }

        directionRef.current =
            "backward";

        setIsPlaying(false);

        setStepIndex((prev) =>
            Math.max(0, prev - 1)
        );
    };

    // =========================================================
    // Play / Pause
    // =========================================================
    const togglePlay = () => {
        if (
            !isSorting ||
            !steps.length
        ) {
            return;
        }

        if (
            stepIndex >=
            steps.length - 1
        ) {
            directionRef.current =
                "forward";

            sortedToastShownRef.current =
                false;

            setStepIndex(0);
            setIsSorted(false);
            setIsPlaying(true);

            return;
        }

        directionRef.current =
            "forward";

        setIsPlaying(
            (prev) => !prev
        );
    };

    // =========================================================
    // Restart
    // =========================================================
    const restartSort = () => {
        if (
            !isSorting ||
            !steps.length
        ) {
            return;
        }

        directionRef.current =
            "forward";

        sortedToastShownRef.current =
            false;

        setStepIndex(0);
        setIsSorted(false);
        setIsPlaying(true);
    };

    // =========================================================
    // Apply current step to visual state
    // =========================================================
    useEffect(() => {
        if (
            !isSorting ||
            !currentStep
        ) {
            return;
        }

        setComparisons(
            currentStep.comparisons
        );

        setStepMessage(
            currentStep.message
        );

        setNodeValues(
            currentStep.nodeValues
        );

        setVisibleDepth(
            currentStep.visibleDepth
        );

        setActiveNodeKey(
            currentStep.activeNodeKey
        );

        setFlashKey(
            currentStep.flashKey
        );

        setCompareInNode(
            currentStep.compareInNode
        );

        setConsumedKeys(
            new Set(
                currentStep.consumedKeys
            )
        );

        if (
            currentStep.type ===
            "sorted"
        ) {
            setIsSorted(true);
        } else {
            setIsSorted(false);
        }
    }, [
        currentStep,
        isSorting,
    ]);

    // =========================================================
    // Commit final sorted array
    // =========================================================
    useEffect(() => {
        if (
            !isSorting ||
            !currentStep
        ) {
            return;
        }

        if (
            currentStep.type ===
            "sorted"
        ) {
            setArray([
                ...currentStep.array,
            ]);

            if (
                !sortedToastShownRef.current
            ) {
                toast.success(
                    "Array sorted successfully!",
                    {
                        position:
                            "top-center",
                    }
                );

                sortedToastShownRef.current =
                    true;
            }
        }
    }, [
        currentStep,
        isSorting,
    ]);

    // =========================================================
    // Autoplay
    // =========================================================
    useEffect(() => {
        if (
            !isSorting ||
            !isPlaying ||
            !currentStep
        ) {
            return;
        }

        if (
            stepIndex >=
            steps.length - 1
        ) {
            setIsPlaying(false);
            return;
        }

        const baseMs =
            SPEED_OPTIONS.find(
                (option) =>
                    option.id === speed
            )?.ms ?? 1200;

        const timer =
            setTimeout(() => {
                directionRef.current =
                    "forward";

                setStepIndex(
                    (prev) =>
                        Math.min(
                            prev + 1,
                            steps.length - 1
                        )
                );
            }, getFrameDelay(
                currentStep.type,
                baseMs,
                speed
            ));

        return () =>
            clearTimeout(timer);
    }, [
        isSorting,
        isPlaying,
        currentStep,
        stepIndex,
        steps.length,
        speed,
    ]);

    // =========================================================
    // Keyboard controls
    // =========================================================
    useEffect(() => {
        const handleKeyDown = (
            event
        ) => {
            if (!isSorting) {
                return;
            }

            if (
                event.target instanceof
                HTMLInputElement
            ) {
                return;
            }

            if (
                event.key ===
                "ArrowRight"
            ) {
                event.preventDefault();
                goNext();
            }

            if (
                event.key ===
                "ArrowLeft"
            ) {
                event.preventDefault();
                goPrev();
            }

            if (
                event.code ===
                "Space"
            ) {
                event.preventDefault();
                togglePlay();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [
        isSorting,
        stepIndex,
        steps.length,
    ]);

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

        await new Promise(
            (resolve) =>
                setTimeout(
                    resolve,
                    200
                )
        );

        setOldArray(false);
        setArray([]);
        setArrExist(true);

        await new Promise(
            (resolve) =>
                setTimeout(
                    resolve,
                    500
                )
        );

        setArray(
            Array(
                parseInt(arrayLength)
            ).fill("NULL")
        );

        toast.success(
            "Array created successfully",
            {
                position:
                    "top-center",
            }
        );

        setActiveTab(
            "pushpop"
        );
    };

    // =========================================================
    // Push / Pop
    // =========================================================
    const arrayPushOperation =
        () => {
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

    const arrayPopOperation =
        () => {
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

            setArray(
                array.slice(
                    0,
                    -1
                )
            );

            toast.success(
                "Element popped from the array."
            );
        };

    // =========================================================
    // Insert
    // =========================================================
    const arrayInsert =
        async () => {
            if (!arrExist) {
                toast.error(
                    "Please create an array first."
                );
                return;
            }

            if (
                insertValue === ""
            ) {
                toast.error(
                    "Please enter an element."
                );
                return;
            }

            if (
                insertIndex === ""
            ) {
                toast.error(
                    "Please enter an index."
                );
                return;
            }

            const index =
                parseInt(
                    insertIndex
                );

            const value =
                Number(
                    insertValue
                );

            if (
                index >
                array.length ||
                index < 0
            ) {
                toast.error(
                    `Index must be between 0 and ${array.length}.`
                );
                return;
            }

            await new Promise(
                (resolve) =>
                    setTimeout(
                        resolve,
                        1000
                    )
            );

            if (
                index ===
                array.length
            ) {
                setArray(
                    (prev) => [
                        ...prev,
                        value,
                    ]
                );
            } else {
                setArray(
                    (prev) =>
                        prev.map(
                            (
                                item,
                                i
                            ) =>
                                i ===
                                    index
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
    const removeByEle =
        () => {
            if (!arrExist) {
                toast.error(
                    "Please create an array first."
                );
                return;
            }

            if (
                deleteValue === ""
            ) {
                toast.error(
                    "Please enter an element."
                );
                return;
            }

            if (
                !array.includes(
                    Number(
                        deleteValue
                    )
                )
            ) {
                toast.error(
                    "Element not found."
                );
                return;
            }

            setArray(
                (prev) =>
                    prev.map(
                        (item) =>
                            item ===
                                Number(
                                    deleteValue
                                )
                                ? "NULL"
                                : item
                    )
            );

            toast.success(
                "Element deleted."
            );

            setDeleteValue("");
        };

    const removeArray =
        () => {
            if (!arrExist) {
                toast.error(
                    "Please create an array first."
                );
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

    return (
        <details
            id="mergeSortOp"
            className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
            onToggle={(e) =>
                handleToggle(
                    "mergeSortOp",
                    e.target.open
                )
            }
            open={
                detailsState[
                    "mergeSortOp"
                ] !== undefined
                    ? detailsState[
                    "mergeSortOp"
                    ]
                    : true
            }
        >
            <summary className="cursor-pointer select-none px-4 py-4 text-base font-semibold text-ink marker:text-accent transition-colors hover:bg-bg/50 sm:px-5 sm:text-lg md:text-xl">
                Merge Sort
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
                                            isSorting
                                        }
                                        onClick={() =>
                                            setActiveTab(
                                                tab.id
                                            )
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

                    {activeTab ===
                        "pushpop" && (
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

                    {activeTab ===
                        "insert" && (
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
                                            isSorting
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

                    {activeTab ===
                        "delete" && (
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
                <div className="mt-5 rounded-lg border border-border bg-bg p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-ink">
                                Sort
                            </h3>

                            <p className="text-xs leading-relaxed text-muted">
                                Splits the array recursively, then merges the smaller sorted parts back together.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
                            <span>
                                Tree depth:{" "}
                                {tree
                                    ? tree.rows.length -
                                    1
                                    : "—"}
                            </span>

                            <span>
                                Comparisons:{" "}
                                {comparisons}
                            </span>

                            <div className="flex items-center gap-1.5">
                                <span>
                                    Speed
                                </span>

                                <div className="flex rounded-md border border-borderStrong bg-surface p-0.5">
                                    {SPEED_OPTIONS.map(
                                        (
                                            opt
                                        ) => (
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
                                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${speed ===
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

                    {/* Player controls */}
                    {/* Player controls */}
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
                                    aria-label="Previous step"
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
                                    aria-label={
                                        isPlaying
                                            ? "Pause sorting"
                                            : "Play sorting"
                                    }
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
                                        stepIndex >=
                                        steps.length - 1
                                    }
                                    aria-label="Next step"
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
                                        size={15}
                                        strokeWidth={2.2}
                                        className="sm:h-[17px] sm:w-[17px]"
                                    />

                                    <span className="hidden text-sm sm:inline">
                                        Restart
                                    </span>
                                </button>

                                {/* Stop */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        stopSort(true)
                                    }
                                    aria-label="Stop sorting"
                                    title="Stop"
                                    className="opBtn-danger flex shrink-0 items-center justify-center p-1.5 sm:gap-1.5 sm:px-3 sm:py-1.5"
                                >
                                    <Square
                                        size={14}
                                        strokeWidth={2.2}
                                        className="sm:h-4 sm:w-4"
                                    />

                                    <span className="hidden text-sm sm:inline">
                                        Stop
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    {isSorting &&
                        steps.length >
                        0 && (
                            <div className="mt-3">
                                <div className="mb-1 flex items-center justify-between text-xs text-muted">
                                    <span>
                                        Step{" "}
                                        {stepIndex +
                                            1}{" "}
                                        of{" "}
                                        {
                                            steps.length
                                        }
                                    </span>

                                    <span>
                                        {Math.round(
                                            ((stepIndex +
                                                1) /
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
                                            width: `${((stepIndex +
                                                1) /
                                                steps.length) *
                                                100
                                                }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                    {arrExist &&
                        array.includes(
                            "NULL"
                        ) && (
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
                        {stepMessage && currentStep && (
                            <StepCallout
                                stepKey={stepIndex}
                                step={currentStep}
                                actionMap={MERGE_SORT_STEP_ACTIONS}
                                message={stepMessage}
                            />
                        )}
                        {arrExist &&
                            array.length >
                            0 ? (
                            <div>
                                {/* Index row */}
                                <div
                                    className="mb-2 grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${array.length}, var(--sim-cell-size))`,
                                    }}
                                >
                                    {array.map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <div
                                                key={`idx-${index}`}
                                                className="flex h-5 items-center justify-center text-[10px] font-medium text-muted sm:h-6 sm:text-xs"
                                            >
                                                {
                                                    index
                                                }
                                            </div>
                                        )
                                    )}
                                </div>

                                {!tree ? (
                                    <div
                                        className="grid"
                                        style={{
                                            gridTemplateColumns: `repeat(${array.length}, var(--sim-cell-size))`,
                                        }}
                                    >
                                        {array.map(
                                            (
                                                item,
                                                index
                                            ) => (
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
                                                    className={`cell arrayDiv h-8 w-10 shrink-0 text-xs font-semibold animate-fade-in sm:h-11 sm:w-14 sm:text-base ${item ===
                                                        "NULL"
                                                        ? "italic font-normal text-muted"
                                                        : ""
                                                        }`}
                                                    style={{
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
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {tree.rows
                                            .slice(
                                                0,
                                                visibleDepth +
                                                1
                                            )
                                            .map(
                                                (
                                                    rowNodes,
                                                    depth
                                                ) => (
                                                    <div
                                                        key={
                                                            depth
                                                        }
                                                        className="grid animate-fade-in"
                                                        style={{
                                                            gridTemplateColumns: `repeat(${array.length}, var(--sim-cell-size))`,
                                                            animationFillMode:
                                                                "both",
                                                        }}
                                                    >
                                                        {rowNodes.map(
                                                            (
                                                                node,
                                                                nodeIndex
                                                            ) => {
                                                                const key =
                                                                    nodeKey(
                                                                        node
                                                                    );

                                                                const values =
                                                                    nodeValues[
                                                                    key
                                                                    ] ??
                                                                    [];

                                                                const isActive =
                                                                    activeNodeKey ===
                                                                    key;

                                                                const isFlashing =
                                                                    flashKey ===
                                                                    key;

                                                                const isConsumed =
                                                                    consumedKeys.has(
                                                                        key
                                                                    );

                                                                const span =
                                                                    node.right -
                                                                    node.left +
                                                                    1;

                                                                /*
                                                                 * The margin is intentional:
                                                                 * sibling broken arrays get a
                                                                 * small horizontal visual gap.
                                                                 */
                                                                return (
                                                                    <div
                                                                        key={`${key}-${nodeIndex}`}
                                                                        style={{
                                                                            gridColumn: `${node.left + 1} / ${node.right + 2}`,
                                                                            width: `calc(${span} * var(--sim-cell-size) - ${SIBLING_GAP}px)`,
                                                                            marginRight:
                                                                                `${SIBLING_GAP}px`,
                                                                        }}
                                                                        className={`flex h-8 divide-x divide-border overflow-hidden rounded-md border-2 transition-all duration-300 sm:h-11
                                                                            ${isActive
                                                                                ? "border-accent"
                                                                                : "border-border"
                                                                            }
                                                                            ${isFlashing
                                                                                ? "scale-[1.03] border-sorted"
                                                                                : ""
                                                                            }
                                                                            ${isConsumed
                                                                                ? "opacity-40"
                                                                                : ""
                                                                            }`}
                                                                    >
                                                                        {values.map(
                                                                            (
                                                                                value,
                                                                                idx
                                                                            ) => {
                                                                                const isComparing =
                                                                                    (compareInNode.leftKey ===
                                                                                        key &&
                                                                                        compareInNode.leftIdx ===
                                                                                        idx) ||
                                                                                    (compareInNode.rightKey ===
                                                                                        key &&
                                                                                        compareInNode.rightIdx ===
                                                                                        idx);

                                                                                return (
                                                                                    <div
                                                                                        key={
                                                                                            idx
                                                                                        }
                                                                                        className="flex w-10 shrink-0 items-center justify-center text-xs font-semibold transition-colors duration-200 sm:w-14 sm:text-sm"
                                                                                        style={
                                                                                            isComparing
                                                                                                ? {
                                                                                                    backgroundColor:
                                                                                                        "rgb(var(--color-comparing))",
                                                                                                    color:
                                                                                                        "rgb(var(--color-comparing-text))",
                                                                                                }
                                                                                                : isFlashing
                                                                                                    ? {
                                                                                                        backgroundColor:
                                                                                                            "rgb(var(--color-sorted) / 0.2)",
                                                                                                        color:
                                                                                                            "rgb(var(--color-text-primary))",
                                                                                                    }
                                                                                                    : undefined
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            value
                                                                                        }
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                )
                                            )}
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
                                            {
                                                token: "comparing",
                                                label: "Comparing",
                                            },
                                            {
                                                token: "sorted",
                                                label: "Just merged",
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
            </div>
        </details>
    );
}