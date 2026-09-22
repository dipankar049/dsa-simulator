import { SWAP_SLIDE_MS, CELL_WIDTH } from "./constants";

export function getSwapTransition() {
    return `transform ${SWAP_SLIDE_MS}ms ease`;
}

const NO_TRANSFORM = { transform: "none", transition: "none" };

/**
 * Adjacent pair swap slide (bubble sort style — percentage-based).
 */
export function getAdjacentPercentSwapTransform(
    index,
    comparePair,
    stepType,
    direction
) {
    if (!comparePair || stepType !== "swap-animating" || direction !== "forward") {
        return NO_TRANSFORM;
    }

    const [a, b] = comparePair;
    if (index === a) {
        return { transform: "translateX(100%)", transition: getSwapTransition() };
    }
    if (index === b) {
        return { transform: "translateX(-100%)", transition: getSwapTransition() };
    }

    return NO_TRANSFORM;
}

/**
 * Swap slide using pixel distance (selection / quick sort style).
 */
export function getIndexedSwapTransform(
    index,
    from,
    to,
    stepType,
    direction
) {
    if (
        stepType !== "swap-animating" ||
        direction !== "forward" ||
        from == null ||
        to == null
    ) {
        return NO_TRANSFORM;
    }

    if (index === from) {
        const distance = (to - from) * CELL_WIDTH;
        return {
            transform: `translateX(${distance}px)`,
            transition: getSwapTransition(),
        };
    }

    if (index === to) {
        const distance = (to - from) * CELL_WIDTH;
        return {
            transform: `translateX(${-distance}px)`,
            transition: getSwapTransition(),
        };
    }

    return NO_TRANSFORM;
}

/**
 * Quick sort: swap pair from step.swap array [i, j].
 */
export function getQuickSortSwapTransform(index, step, direction) {
    const pair = step?.swap;
    if (!pair || step.type !== "swap-animating" || direction !== "forward") {
        return NO_TRANSFORM;
    }

    const [from, to] = pair;
    if (from === to) return NO_TRANSFORM;

    if (index === from) {
        const distance = (to - from) * CELL_WIDTH;
        return {
            transform:
                to > from
                    ? `translateX(${distance}px)`
                    : `translateX(-${distance}px)`,
            transition: getSwapTransition(),
        };
    }

    if (index === to) {
        const distance = (to - from) * CELL_WIDTH;
        return {
            transform:
                to > from
                    ? `translateX(-${distance}px)`
                    : `translateX(${distance}px)`,
            transition: getSwapTransition(),
        };
    }

    return NO_TRANSFORM;
}
