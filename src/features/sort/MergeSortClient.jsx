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

const OPERATION_TABS = [
    { id: "create", label: "Create" },
    { id: "pushpop", label: "Push / Pop" },
    { id: "insert", label: "Insert" },
    { id: "delete", label: "Delete" },
];

const CELL_WIDTH = 56;

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

// =========================================================
// Pure tree helpers
// =========================================================
function buildTree(left, right) {
    if (left === right) {
        return {
            left,
            right,
            children: [],
        };
    }

    const mid =
        left + Math.floor((right - left) / 2);

    return {
        left,
        right,
        children: [
            buildTree(left, mid),
            buildTree(mid + 1, right),
        ],
    };
}

function nodeKey(node) {
    return `${node.left}-${node.right}`;
}

function collectRows(root) {
    const rows = [];

    const walk = (node, depth) => {
        if (!rows[depth]) {
            rows[depth] = [];
        }

        rows[depth].push(node);

        node.children.forEach((child) =>
            walk(child, depth + 1)
        );
    };

    walk(root, 0);

    return rows;
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

        case "divide-start":
            return {
                icon: Split,
                label: "Divide",
                tone: "accent",
            };

        case "divide":
            return {
                icon: Split,
                label: "Splitting",
                tone: "accent",
            };

        case "divide-done":
            return {
                icon: Split,
                label: "Split complete",
                tone: "secondary",
            };

        case "merge-start":
            return {
                icon: Merge,
                label: "Merging",
                tone: "accent",
            };

        case "compare":
            return {
                icon: ArrowLeftRight,
                label: "Comparing",
                tone: "comparing",
            };

        case "take-left":
            return {
                icon: ChevronLeft,
                label: "Taking from left",
                tone: "secondary",
            };

        case "take-right":
            return {
                icon: ChevronRight,
                label: "Taking from right",
                tone: "secondary",
            };

        case "merge-done":
            return {
                icon: CheckCircle2,
                label: "Merged",
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

export default function MergeSortClient() {
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
    // Build Merge Sort steps
    // =========================================================
    const buildMergeSortSteps = (
        initialArray
    ) => {
        const working = [...initialArray];

        const root = buildTree(
            0,
            working.length - 1
        );

        const rows = collectRows(root);

        const generatedSteps = [];

        let comparisonCount = 0;

        const initialNodeValues = {};

        rows.forEach((rowNodes) => {
            rowNodes.forEach((node) => {
                initialNodeValues[nodeKey(node)] =
                    working.slice(
                        node.left,
                        node.right + 1
                    );
            });
        });

        const cloneNodeValues = (source) => {
            const result = {};

            Object.entries(source).forEach(
                ([key, values]) => {
                    result[key] = [...values];
                }
            );

            return result;
        };

        const pushStep = ({
            type,
            message,
            values = initialNodeValues,
            depth = 0,
            activeKey = null,
            flash = null,
            compare = null,
            consumed = new Set(),
        }) => {
            generatedSteps.push({
                type,
                message,

                nodeValues:
                    cloneNodeValues(values),

                visibleDepth: depth,

                activeNodeKey: activeKey,

                flashKey: flash,

                compareInNode: compare
                    ? {
                        leftKey:
                            compare.leftKey,
                        leftIdx:
                            compare.leftIdx,
                        rightKey:
                            compare.rightKey,
                        rightIdx:
                            compare.rightIdx,
                    }
                    : {
                        leftKey: null,
                        leftIdx: -1,
                        rightKey: null,
                        rightIdx: -1,
                    },

                consumedKeys: new Set(
                    consumed
                ),

                comparisons:
                    comparisonCount,

                array: [...working],
            });
        };

        // -----------------------------------------------------
        // Initial state
        // -----------------------------------------------------
        pushStep({
            type: "start",
            message:
                "Starting Merge Sort.",
            depth: 0,
        });

        // -----------------------------------------------------
        // Divide phase
        //
        // Each depth reveals another level of the recursion
        // tree.
        // -----------------------------------------------------
        for (
            let depth = 0;
            depth < rows.length;
            depth++
        ) {
            pushStep({
                type:
                    depth === 0
                        ? "divide-start"
                        : "divide",
                message:
                    depth === 0
                        ? "Starting the divide phase."
                        : `Splitting the array into smaller parts — level ${depth + 1
                        }.`,
                depth,
            });

            pushStep({
                type: "divide-done",
                message:
                    depth ===
                        rows.length - 1
                        ? "Every part now contains a single element."
                        : `Level ${depth + 1
                        } split complete.`,
                depth,
            });
        }

        // -----------------------------------------------------
        // Merge phase
        //
        // This recursively creates steps bottom-up.
        // -----------------------------------------------------
        const mergeNode = (
            node,
            depth,
            nodeState,
            consumedState
        ) => {
            if (
                node.children.length === 0
            ) {
                return;
            }

            const [
                leftChild,
                rightChild,
            ] = node.children;

            mergeNode(
                leftChild,
                depth + 1,
                nodeState,
                consumedState
            );

            mergeNode(
                rightChild,
                depth + 1,
                nodeState,
                consumedState
            );

            const key = nodeKey(node);
            const leftKey =
                nodeKey(leftChild);
            const rightKey =
                nodeKey(rightChild);

            const leftValues = [
                ...(nodeState[leftKey] ??
                    []),
            ];

            const rightValues = [
                ...(nodeState[rightKey] ??
                    []),
            ];

            pushStep({
                type: "merge-start",
                message: `Merging [${leftChild.left}..${leftChild.right}] and [${rightChild.left}..${rightChild.right}].`,
                values: nodeState,
                depth: rows.length - 1,
                activeKey: key,
                consumed: consumedState,
            });

            const merged = [];

            let i = 0;
            let j = 0;

            while (
                i < leftValues.length &&
                j < rightValues.length
            ) {
                comparisonCount++;

                pushStep({
                    type: "compare",
                    message: `Comparing ${leftValues[i]} and ${rightValues[j]}.`,
                    values: nodeState,
                    depth: rows.length - 1,
                    activeKey: key,
                    compare: {
                        leftKey,
                        leftIdx: i,
                        rightKey,
                        rightIdx: j,
                    },
                    consumed:
                        consumedState,
                });

                if (
                    leftValues[i] <=
                    rightValues[j]
                ) {
                    merged.push(
                        leftValues[i]
                    );

                    pushStep({
                        type: "take-left",
                        message: `Taking ${leftValues[i]} from the left part.`,
                        values: nodeState,
                        depth:
                            rows.length - 1,
                        activeKey: key,
                        consumed:
                            consumedState,
                    });

                    i++;
                } else {
                    merged.push(
                        rightValues[j]
                    );

                    pushStep({
                        type: "take-right",
                        message: `Taking ${rightValues[j]} from the right part.`,
                        values: nodeState,
                        depth:
                            rows.length - 1,
                        activeKey: key,
                        consumed:
                            consumedState,
                    });

                    j++;
                }
            }

            while (
                i < leftValues.length
            ) {
                merged.push(
                    leftValues[i]
                );

                i++;
            }

            while (
                j < rightValues.length
            ) {
                merged.push(
                    rightValues[j]
                );

                j++;
            }

            // Update the node with the newly merged values.
            nodeState[key] = [
                ...merged,
            ];

            // Children are now consumed into the parent.
            const nextConsumed =
                new Set(consumedState);

            nextConsumed.add(leftKey);
            nextConsumed.add(rightKey);

            pushStep({
                type: "merge-done",
                message: `Merged [${node.left}..${node.right}] into [${merged.join(
                    ", "
                )}].`,
                values: nodeState,
                depth:
                    rows.length - 1,
                activeKey: null,
                flash: key,
                consumed:
                    nextConsumed,
            });

            // Keep this state for the parent.
            consumedState.clear();

            nextConsumed.forEach(
                (item) =>
                    consumedState.add(item)
            );
        };

        const workingNodeValues =
            cloneNodeValues(
                initialNodeValues
            );

        const workingConsumed =
            new Set();

        mergeNode(
            root,
            0,
            workingNodeValues,
            workingConsumed
        );

        // -----------------------------------------------------
        // Final sorted array
        // -----------------------------------------------------
        const finalValues =
            workingNodeValues[
            nodeKey(root)
            ];

        generatedSteps.push({
            type: "sorted",
            message:
                "Array is sorted!",
            nodeValues:
                cloneNodeValues(
                    workingNodeValues
                ),
            visibleDepth:
                rows.length - 1,
            activeNodeKey: null,
            flashKey: null,
            compareInNode: {
                leftKey: null,
                leftIdx: -1,
                rightKey: null,
                rightIdx: -1,
            },
            consumedKeys:
                new Set(),
            comparisons:
                comparisonCount,
            array: [...finalValues],
        });

        return {
            root,
            rows,
            steps: generatedSteps,
            finalValues,
        };
    };

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
                            <div className="mb-4">
                                {(() => {
                                    const action = getStepAction(currentStep);
                                    const Icon =
                                        action?.icon ?? GitCompare;

                                    const toneClasses = {
                                        accent:
                                            "border-accent/30 bg-accent/5 text-accent",

                                        comparing:
                                            "border-comparing/30 bg-comparing/10 text-comparing-text",

                                        sorted:
                                            "border-sorted/30 bg-sorted/10 text-sorted",

                                        secondary:
                                            "border-border bg-surface text-secondary",
                                    };

                                    return (
                                        <div
                                            key={stepIndex}
                                            className={`
                        animate-fade-in
                        flex items-center gap-3
                        rounded-lg border
                        px-3 py-2.5
                        sm:px-4 sm:py-3
                        ${toneClasses[action?.tone] ??
                                                toneClasses.secondary}
                    `}
                                        >
                                            {/* Action icon */}
                                            <div
                                                className="
                            flex h-8 w-8 shrink-0
                            items-center justify-center
                            rounded-md
                            bg-surface
                        "
                                            >
                                                <Icon
                                                    size={17}
                                                    strokeWidth={2.2}
                                                    color="blue"
                                                />
                                            </div>

                                            {/* Action text */}
                                            <div className="min-w-0">
                                                <div className="text-[11px] text-white font-semibold uppercase tracking-wide opacity-70">
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
                        {arrExist &&
                            array.length >
                            0 ? (
                            <div>
                                {/* Index row */}
                                <div
                                    className="mb-2 grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${array.length}, ${CELL_WIDTH}px)`,
                                    }}
                                >
                                    {array.map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <div
                                                key={`idx-${index}`}
                                                className="flex h-6 items-center justify-center text-xs font-medium text-muted"
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
                                            gridTemplateColumns: `repeat(${array.length}, ${CELL_WIDTH}px)`,
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
                                                    className={`cell arrayDiv h-11 w-14 shrink-0 font-semibold animate-fade-in ${item ===
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
                                                            gridTemplateColumns: `repeat(${array.length}, ${CELL_WIDTH}px)`,
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
                                                                            width: `calc(${span * CELL_WIDTH}px - ${SIBLING_GAP}px)`,
                                                                            marginRight:
                                                                                `${SIBLING_GAP}px`,
                                                                        }}
                                                                        className={`flex h-11 divide-x divide-border overflow-hidden rounded-md border-2 transition-all duration-300
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
                                                                                        className="flex w-14 shrink-0 items-center justify-center text-sm font-semibold transition-colors duration-200"
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