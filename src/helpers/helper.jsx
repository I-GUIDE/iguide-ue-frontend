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
    console.log(jsonData)
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

/**
 * Print a list as a string with the given delimiter
 * @param {Array<string>} listOfItems the list of item
 * @return {Int} the length of the array. If the object is undefine or not an array, return 0.
 */
export function arrayLength(listOfItems) {
    if (!listOfItems || !Array.isArray(listOfItems)) {
        return 0;
    }

    return listOfItems.length;
}

/**
 * Convert data URL to a file
 * @param {string} dataURL the data URL object
 * @param {string} filename filename
 * @return {File} the file object converted from dataURL
 */
export function dataURLtoFile(dataURL, filename) {
    var arr = dataURL.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}