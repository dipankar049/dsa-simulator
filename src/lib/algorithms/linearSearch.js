/**
 * Linear search — builds all frames up front for step playback.
 */

export function buildLinearSearchSteps(inputArray, target) {
    const steps = [];
    const array = [...inputArray];

    if (!array.length) {
        return steps;
    }

    steps.push({
        type: "start",
        array: [...array],
        index: -1,
        message: `Searching for ${target} from left to right, one index at a time.`,
    });

    for (let i = 0; i < array.length; i++) {
        steps.push({
            type: "compare",
            array: [...array],
            index: i,
            message: `Checking index ${i} — value is ${array[i]}.`,
        });

        if (array[i] === target) {
            steps.push({
                type: "found",
                array: [...array],
                index: i,
                message: `${target} matches ${array[i]} at index ${i}.`,
            });
            return steps;
        }
    }

    steps.push({
        type: "not-found",
        array: [...array],
        index: -1,
        message: `${target} is not in the array.`,
    });

    return steps;
}
