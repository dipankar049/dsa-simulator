export function buildQuickSortSteps(initialArray) {
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