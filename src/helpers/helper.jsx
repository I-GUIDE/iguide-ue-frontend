/**
 * Extract the value of fieldOut of which entry matches the valueIn of fieldIn.
 * The return value is the extracted value.
 * @param {string} fieldIn: the field of valueIn
 * @param {string} valueIn: the input value
 * @param {string} fieldOut: the field of the output value
 * @param {Array} jsonData: json data in JavaScript Array
 * @return {string} the value of fieldOut
 */
export function extractValueFromJSON(fieldIn, valueIn, fieldOut, jsonData) {
    const index = jsonData.findIndex(entry => entry[fieldIn] == valueIn);
    return jsonData[index][fieldOut];
}

/**
 * Print a list as a string with the given delimiter
 * @param {Array<string>} listOfItems the list of item
 * @param {string} delimiter the delimiter
 * @return {string} the string with all the items separated by the given delimiter.
 */
export function printListWithDelimiter(listOfItems, delimiter) {
    let returnStr = '';
    for (var idx in listOfItems) {
        returnStr += (listOfItems[idx] + delimiter + ' ')
    }
    return returnStr.slice(0, - 2);
}