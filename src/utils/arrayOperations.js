
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function createNewArray(length, defaultValue = 0) {
    if(arrayInputs.arrayLength === '' || parseInt(arrayInputs.arrayLength) <= 0) { 
        return {success: false, error: "Array length must be greater than 0"};
    }

    return { success: true, array: new Array(length).fill(defaultValue) };
}

// function insertInArray(array, element, index)

module.exports = {
    createNewArray,
}