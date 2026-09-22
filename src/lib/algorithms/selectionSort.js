export function buildSelectionSortSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;

    steps.push({
        type: "start",
        array: [...arr],
        min: -1,
        first: -1,
        second: -1,
        pass: 0,
        comparison: 0,
        sortedFrom: n,
        message:
            "Starting Selection Sort — we'll find the smallest value in each unsorted section and move it to the front.",
    });

    for (let j = 0; j < n - 1; j++) {
        let minIndex = j;

        // ---------------------------------------------------------
        // Start of pass — current position becomes the boundary.
        // ---------------------------------------------------------
        steps.push({
            type: "compare",
            array: [...arr],
            min: minIndex,
            first: j,
            second: -1,
            pass: j + 1,
            comparison: 0,
            sortedFrom: j,
            message:
                `Starting pass ${j + 1}. ${arr[j]} is the current minimum candidate.`,
        });

        for (let i = j + 1; i < n; i++) {
            steps.push({
                type: "compare",
                array: [...arr],
                min: minIndex,
                first: j,
                second: i,
                pass: j + 1,
                comparison: i - j,
                sortedFrom: j,
                message:
                    `Comparing ${arr[i]} with the current minimum ${arr[minIndex]}.`,
            });

            if (arr[i] < arr[minIndex]) {
                minIndex = i;

                steps.push({
                    type: "new-minimum",
                    array: [...arr],
                    min: minIndex,
                    first: j,
                    second: i,
                    pass: j + 1,
                    comparison: i - j,
                    sortedFrom: j,
                    message:
                        `${arr[i]} is smaller — it becomes the new minimum.`,
                });
            } else {
                steps.push({
                    type: "no-change",
                    array: [...arr],
                    min: minIndex,
                    first: j,
                    second: i,
                    pass: j + 1,
                    comparison: i - j,
                    sortedFrom: j,
                    message:
                        `${arr[i]} is not smaller — the current minimum stays ${arr[minIndex]}.`,
                });
            }
        }

        // ---------------------------------------------------------
        // Swap if a smaller value was found.
        // ---------------------------------------------------------
        if (minIndex !== j) {
            const leftValue = arr[j];
            const minValue = arr[minIndex];

            steps.push({
                type: "swap",
                array: [...arr],
                min: minIndex,
                first: j,
                second: minIndex,
                pass: j + 1,
                comparison: 0,
                sortedFrom: j,
                message:
                    `${minValue} is the smallest value found, so we'll swap it with ${leftValue}.`,
            });

            steps.push({
                type: "swap-animating",
                array: [...arr],
                min: minIndex,
                first: j,
                second: minIndex,
                pass: j + 1,
                comparison: 0,
                sortedFrom: j,
                swapFrom: j,
                swapTo: minIndex,
                message:
                    `Moving ${minValue} to position ${j} and ${leftValue} to position ${minIndex}.`,
            });

            [arr[j], arr[minIndex]] = [arr[minIndex], arr[j]];

            steps.push({
                type: "swap-done",
                array: [...arr],
                min: -1,
                first: j,
                second: -1,
                pass: j + 1,
                comparison: 0,
                sortedFrom: j + 1,
                message:
                    `Swap complete — ${arr[j]} is now in its sorted position.`,
            });
        } else {
            steps.push({
                type: "no-swap",
                array: [...arr],
                min: -1,
                first: j,
                second: -1,
                pass: j + 1,
                comparison: 0,
                sortedFrom: j + 1,
                message:
                    `${arr[j]} is already the smallest value in the unsorted part — no swap needed.`,
            });
        }
    }

    steps.push({
        type: "sorted",
        array: [...arr],
        min: -1,
        first: -1,
        second: -1,
        pass: n > 1 ? n - 1 : 0,
        comparison: 0,
        sortedFrom: 0,
        message:
            "Array is sorted! Every value is now in its correct position.",
    });

    return steps;
}