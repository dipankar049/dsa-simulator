/** Promise-based delay for operation animations. */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
