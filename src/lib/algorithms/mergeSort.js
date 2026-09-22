/**
 * Merge sort step generator and recursion tree helpers.
 */

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

export function nodeKey(node) {
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

export function buildMergeSortSteps(initialArray) {
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
}