export function buildBinarySearchSteps(inputArray, target) {
    const steps = [];

    if (!inputArray.length) {
        return steps;
    }

    let low = 0;
    let high = inputArray.length - 1;
    let iterations = 0;

    const pushStep = ({
        type,
        message,
        currentLow = low,
        currentHigh = high,
        currentMid = -1,
        midVisible = false,
        equal = false,
        found = "",
        iteration = iterations,
    }) => {
        steps.push({
            type,
            message,
            array: [...inputArray],
            low: currentLow,
            high: currentHigh,
            mid: currentMid,
            midVisible,
            equal,
            found,
            iterations: iteration,
        });
    };

    pushStep({
        type: "start",
        message: `Searching for ${target}. The search range starts from index 0 to ${inputArray.length - 1}.`,
    });

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midValue = inputArray[mid];

        iterations += 1;

        pushStep({
            type: "compare",
            currentLow: low,
            currentHigh: high,
            currentMid: mid,
            midVisible: true,
            iteration: iterations,
            message: `Checking index ${mid} with value ${midValue} — the midpoint of [${low}, ${high}].`,
        });

        if (target === midValue) {
            pushStep({
                type: "found",
                currentLow: low,
                currentHigh: high,
                currentMid: mid,
                midVisible: true,
                equal: true,
                found: "Found",
                iteration: iterations,
                message: `${target} = ${midValue} — match found at index ${mid}!`,
            });

            return steps;
        }

        if (target < midValue) {
            const newHigh = mid - 1;

            pushStep({
                type: "move-left",
                currentLow: low,
                currentHigh: newHigh,
                currentMid: mid,
                midVisible: true,
                iteration: iterations,
                message: `${target} < ${midValue} — target must be in the left half, so High moves to ${newHigh}.`,
            });

            high = newHigh;
        } else {
            const newLow = mid + 1;

            pushStep({
                type: "move-right",
                currentLow: newLow,
                currentHigh: high,
                currentMid: mid,
                midVisible: true,
                iteration: iterations,
                message: `${target} > ${midValue} — target must be in the right half, so Low moves to ${newLow}.`,
            });

            low = newLow;
        }
    }

    pushStep({
        type: "not-found",
        currentLow: low,
        currentHigh: high,
        currentMid: -1,
        midVisible: false,
        found: "Not Found",
        iteration: iterations,
        message: `Low crossed High — ${target} is not in the array.`,
    });

    return steps;
}