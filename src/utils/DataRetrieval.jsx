const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL;
import axios from "axios";
import { fetchWithAuth } from "./FetcherWithJWT.jsx";

/**
 * Retrieve elements for the homepage from the database.
 * @return {Promise<Array<Dict>>} an array of all elements for homepage.
 */
export async function getHomepageElements() {
  const response = await fetch(`${BACKEND_URL_PORT}/api/elements/homepage`);
  if (!response.ok) {
    throw new Error(
      `Error fetching featured resources: ${response.statusText}`
    );
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
export async function DataSearcher(
  keyword,
  resourceType = "any",
  sortBy = "prioritize_title_author",
  order = "desc",
  from = 0,
  size = 10
) {
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to search resources");
  }
  return response.json();
}

/**
 * Fetches all titles of elements of a specified type from the backend.
 *
 * @async
 * @function fetchAllTitlesByElementType
 * @param {string} elementType - The type of resources to fetch titles for.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of all titles.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchAllTitlesByElementType(elementType) {
  const response = await fetch(
    `${BACKEND_URL_PORT}/api/elements/titles?element_type=${elementType}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch titles");
  }
  return response.json();
}

/**
 * Fetches publication metadata via Crossref
 *
 * @async
 * @function getMetadataByDOI
 * @param {string} doi - The DOI of the publication
 * @returns {Promise<Array<string>>} A promise that contains the metadata of the publication
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getMetadataByDOI(doi) {
  const encodedDOI = encodeURIComponent(doi);
  try {
    // Construct the CrossRef API URL
    const url = `https://api.crossref.org/works/${encodedDOI}`;

    // Make the HTTP request to the CrossRef API
    const response = await axios.get(url);

    // Extract metadata from the response
    const metadata = response.data.message;

    return metadata;
  } catch (error) {
    console.warn("Error fetching metadata:", error);
    return "Publication not found";
  }
}

/**
 * Retrieve elements from the database based on the provided parameters.
 *
 * @param {string} [fieldName=''] - The name of the field in the element database.
 * @param {(string[]|null)} [matchValue=null] - The value used for filtering. If it provides an empty array, returns an empty array as result. If it provides "null", return everything.
 * @param {(string[]|null)} [elementType=null] - Type of the element. If it provides an empty array, returns an empty array as result. If it provides "null", return everything.
 * @param {string} [sortBy='_score'] - The field by which to sort the results.
 * @param {string} [order='desc'] - The order of the sorting (ascending or descending).
 * @param {string} [from='0'] - The starting point of the results.
 * @param {string} [size='10'] - The number of results to retrieve.
 * @returns {Promise<Object|number>} The retrieved elements.
 * @throws {Error} If the request fails.
 */
export async function elementRetriever(
  fieldName = null,
  matchValue = null,
  elementType = null,
  sortBy = "_score",
  order = "desc",
  from = "0",
  size = "10"
) {
  let queries = "";
  if (fieldName !== null) {
    queries += `field-name=${fieldName}&match-value=${matchValue}`;
  }
  if (elementType !== null) {
    queries += `&element-type=${elementType}`;
  }

  const response = await fetch(
    `${BACKEND_URL_PORT}/api/elements?` +
      queries +
      `&sort-by=${sortBy}&order=${order}&from=${from}&size=${size}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to retrieve elements");
  }

  return response.json();
}

/**
 * Fetches a single element for element pages
 *
 * @async
 * @function fetchSingleElementDetails
 * @param {string} elementId - Element ID
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the resources.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchSingleElementDetails(elementId) {
  const response = await fetch(
    `${BACKEND_URL_PORT}/api/elements/${elementId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }
  return response.json();
}
