/**
 * Bubble sort step generator — pure logic, no React.
 * Each step is a frame for the visualizer (array snapshot + metadata).
 */

export function buildBubbleSortSteps(initialArray) {
    const steps = [];
    let arr = [...initialArray];
    const n = arr.length;
    let sortedFrom = n;

    steps.push({
        type: "start",
        array: [...arr],
        compare: [],
        message:
            "Starting Bubble Sort — we'll walk through every comparison, one step at a time.",
        pass: 0,
        comparison: 0,
        sortedFrom,
    });

    for (let j = 0; j < n - 1; j++) {
        let swappedInPass = false;

        for (let i = 0; i < n - 1 - j; i++) {
            steps.push({
                type: "compare",
                array: [...arr],
                compare: [i, i + 1],
                message: `Comparing ${arr[i]} and ${arr[i + 1]}`,
                pass: j + 1,
                comparison: i + 1,
                sortedFrom,
            });

            const shouldSwap = arr[i] > arr[i + 1];

            steps.push({
                type: shouldSwap ? "decide-swap" : "decide-no-swap",
                array: [...arr],
                compare: [i, i + 1],
                message: shouldSwap
                    ? `${arr[i]} is larger than ${arr[i + 1]} — they are out of order`
                    : `${arr[i]} is not larger than ${arr[i + 1]} — no swap needed`,
                pass: j + 1,
                comparison: i + 1,
                sortedFrom,
            });

            if (shouldSwap) {
                const leftValue = arr[i];
                const rightValue = arr[i + 1];

                steps.push({
                    type: "swap-animating",
                    array: [...arr],
                    compare: [i, i + 1],
                    message: `Swapping ${leftValue} ↔ ${rightValue}`,
                    pass: j + 1,
                    comparison: i + 1,
                    sortedFrom,
                });

                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swappedInPass = true;

                steps.push({
                    type: "swap-done",
                    array: [...arr],
                    compare: [i, i + 1],
                    message: `Swapped — ${arr[i]} and ${arr[i + 1]} are now in the correct order`,
                    pass: j + 1,
                    comparison: i + 1,
                    sortedFrom,
                });
            }
        }

        sortedFrom = n - 1 - j;
        steps.push({
            type: "pass-end",
            array: [...arr],
            compare: [],
            message: swappedInPass
                ? `End of pass ${j + 1} — the largest remaining value has bubbled into place.`
                : `No swaps in pass ${j + 1} — the array is already sorted, stopping early.`,
            pass: j + 1,
            comparison: 0,
            sortedFrom,
        });

        if (!swappedInPass) {
            sortedFrom = 0;
            break;
        }
    }

    steps.push({
        type: "sorted",
        array: [...arr],
        compare: [],
        message: "Array is sorted!",
        pass: steps[steps.length - 1].pass,
        comparison: 0,
        sortedFrom: 0,
    });

    return steps;
}
