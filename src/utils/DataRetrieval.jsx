/**
 * Retrieve data from the database based on the resource type. It will return all the data entry with the
 * provided resource type.
 * @param {string} resourceType the resource type. Should be 'notebook', 'dataset', 'publication' or
 * 'educational-material'.
 * @return {Array<Dict>} an array of all data entries with the provided resource type.
 */
export async function DataRetriever(resourceType) {
    const response = await fetch(`http://149.165.169.173:5000/api/resources?data_name=${resourceType}`);
    if (!response.ok) {
        throw new Error('Error fetching ${data_name}: ${response.statusText}');
    }
    const data = await response.json();
    return data;
}

/**
 * Retrieve data based on the search keyword.
 * @param {string} keyword the keyword that users search.
 * @return {Array<Dict>} an array of all data entries containing the search keyword.
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
    console.log('Search results:', results);

    return results;
}
