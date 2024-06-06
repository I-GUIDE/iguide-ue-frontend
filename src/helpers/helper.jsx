/**
 * extractValueFromJSON extract the value of fieldOut of which entry matches the valueIn of fieldIn.
 * The return value is the extracted value.
 * @param {string} fieldIn: the field of valueIn
 * @param {string} valueIn: the input value
 * @param {string} fieldOut: the field of the output value
 * @param {Array} jsonData: json data in JavaScript Array
 * @param {string} [optionalArg] - An optional argument that is a string
 */
export function extractValueFromJSON(fieldIn, valueIn, fieldOut, jsonData) {
    const index = jsonData.findIndex(entry => entry[fieldIn] == valueIn);
    return jsonData[index][fieldOut];
}