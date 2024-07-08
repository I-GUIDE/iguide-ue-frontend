const BACKEND_URL_PORT = "https://backend.i-guide.io:5000"

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
    const response = await fetch(`${BACKEND_URL_PORT}/api/resources?data_name=${resourceType}&sort_by=${sortBy}&order=${order}&from=${from}&size=${size}`);
    if (!response.ok) {
        throw new Error(`Error fetching ${resourceType}: ${response.statusText}`);
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
    const response = await fetch(`${BACKEND_URL_PORT}/api/featured-resources`);
    if (!response.ok) {
        throw new Error(`Error fetching featured resources: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

/**
 * Searches for resources based on a keyword, with optional resource type, sorting, and pagination.
 * @async
 * @function searchResources
 * @param {string} keyword - The keyword to search for in resources.
 * @param {string} [resourceType=null] - The type of resources to filter by. Defaults to any, which means no filtering by type.
 * @param {string} [sortBy='_score'] - The field to sort the search results by. Defaults to 'prioritize_title_author'.
 * @param {string} [order='desc'] - The order of sorting, either 'asc' or 'desc'. Defaults to 'desc'.
 * @param {number} [from=0] - The starting index for pagination. Defaults to 0.
 * @param {number} [size=10] - The number of resources to return. Defaults to 10.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the search results.
 * @throws {Error} Throws an error if the search operation fails.
 */
export async function DataSearcher(keyword, resourceType = 'any', sortBy = 'prioritize_title_author', order = 'desc', from = 0, size = 10) {
    const body = {
        keyword,
        sort_by: sortBy,
        order,
        from,
        size,
    };

    if (resourceType) {
        body.resource_type = resourceType;
    }

    const response = await fetch(`${BACKEND_URL_PORT}/api/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error('Failed to search resources');
    }
    return response.json();
}

/**
 * Fetches the count of resources based on the specified resource type and/or keywords.
 * @async
 * @function getResourceCount
 * @param {string} [resourceType] - The type of resources to count. Optional. If 'any', it matches all resource types.
 * @param {string} [keywords] - Search keywords to count the resources. Optional.
 * @returns {Promise<number>} A promise that resolves to the count of resources.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getResourceCount(resourceType, keywords) {
    const response = await fetch(`${BACKEND_URL_PORT}/api/resource-count`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resourceType, keywords })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch resource count');
    }

    const data = await response.json();
    return data.count;
}

/**
 * Fetches resources by a specified field and array of values from the backend.
 *
 * @async
 * @function fetchResourcesByField
 * @param {string} field - The field to query.
 * @param {Array<string>} values - The array of values to match.
 * @returns {Promise<Array<Object>>} A promise that resolves to the JSON response containing the resources.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchResourcesByField(field, values) {
    const valueString = values.join(',');
    const response = await fetch(`${BACKEND_URL_PORT}/api/resources/${field}/${valueString}`);
    if (!response.ok) {
        throw new Error('Failed to fetch resources');
    }
    return response.json();
}

/**
 * Fetches the count of resources by a specified field and array of values from the backend.
 *
 * @async
 * @function fetchResourceCountByField
 * @param {string} field - The field to query.
 * @param {Array<string>} values - The array of values to match.
 * @returns {Promise<number>} A promise that resolves to the JSON response containing the count of resources.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchResourceCountByField(field, values) {
    const encodedValues = values.map(value => encodeURIComponent(value)).join(',');
    const response = await fetch(`${BACKEND_URL_PORT}/api/resources/count/${field}/${encodedValues}`);
    if (!response.ok) {
        throw new Error('Failed to fetch resource count');
    }
    const data = await response.json();
    return data.count;
}

/**
 * Fetches resources created by a specified contributor from the backend with optional sorting and pagination.
 *
 * @async
 * @function fetchResourcesByContributor
 * @param {string} openid - The openid of the contributor.
 * @param {string} [sortBy='_score'] - The field to sort the resources by. Defaults to '_score'.
 * @param {string} [order='desc'] - The order of sorting, either 'asc' or 'desc'. Defaults to 'desc'.
 * @param {number} [from=0] - The starting index for pagination. Defaults to 0.
 * @param {number} [size=15] - The number of resources to fetch. Defaults to 15.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the resources.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchResourcesByContributor(openid, sortBy = '_score', order = 'desc', from = 0, size = 5) {
    const response = await fetch(`${BACKEND_URL_PORT}/api/searchByCreator`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            openid,
            sort_by: sortBy,
            order: order,
            from: from,
            size: size,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch resources');
    }
    return response.json();
}