/**
 * Retrieve data from the database based on the resource type, [sortBy, order, from, and size].
 * @param {string} resourceType the resource type. Should be 'notebook', 'dataset', 'publication' or
 * 'educational-material'.
 * @param {string} [sortBy='_score'] - The field to sort the resources by. Defaults to '_score'.
 * @param {string} [order='desc'] - The order of sorting, either 'asc' or 'desc'. Defaults to 'desc'.
 * @param {int} [from=0] - The starting index for pagination. Defaults to 0.
 * @param {int} [size=10] - The number of resources to fetch. Defaults to 10.
 * @return {Promise<Array<Dict>>} an array of all data entries with the provided resource type.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function DataRetriever(resourceType, sortBy = '_score', order = 'desc', from = 0, size = 10) {
    const response = await fetch(`http://149.165.169.173:5000/api/resources?data_name=${resourceType}&sort_by=${sortBy}&order=${order}&from=${from}&size=${size}`);
    if (!response.ok) {
        throw new Error('Error fetching ${data_name}: ${response.statusText}');
    }
    const data = await response.json();
    return data;
}

/**
 * Retrieve featured resources from the database. It will return all the data entry with the
 * field 'featured' as true.
 * @return {Promise<Array<Dict>>} an array of all data entries with the field 'featured' as true.
 */
export async function featuredResourcesRetriever() {
    const response = await fetch('http://149.165.169.173:5000/api/featured-resources');
    if (!response.ok) {
        throw new Error('Error fetching featured resources: ${response.statusText}');
    }
    const data = await response.json();
    return data;
}

/**
 * Retrieve data based on the search keyword.
 * @param {string} keyword the keyword that users search.
 * @return {Promise<Array<Dict>>} an array of all data entries containing the search keyword.
 */
export async function DataSearcher(keyword) {
    const response = await fetch('http://149.165.169.173:5000/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
    });

    if (!response.ok) {
        console.error('Error with search request:', response.statusText);
        return;
    }

    const results = await response.json();

    return results;
}
