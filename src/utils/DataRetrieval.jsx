import axios from "axios";
import { fetchWithAuth } from "./FetcherWithJWT";
import { sendBugToSlack } from "./AutomaticBugReporting";

const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

/**
 * Form the error message for the fetch functions
 *
 * @function getErrorMessageToSend
 * @param {string} apiCall - API call
 * @param {string} errorStatus - the error message
 * @returns {string} A markdown message to be sent to the bug report agents
 */
function getErrorMessageToSend(apiCall, errorStatus) {
  var currentTime = new Date();
  currentTime.toUTCString();
  const currentUrl = window.location.href;

  const msgToBeSent = `
    *An error occurred!*
    *Error info*:
      * API call: ${apiCall},
      * Type: Error from backend,
      * Message: ${errorStatus},
      * Time: ${currentTime},
      * URL: ${currentUrl}`;

  return msgToBeSent;
}

/**
 * Retrieve featured elements.
 *
 * @async
 * @function getHomepageElements
 * @param {string} elementType - Element type
 * @param {number} [limit=4] - max number of featured elements returned
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the featured elements.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getHomepageElements(elementType, limit = 4) {
  const apiCall = `${BACKEND_URL_PORT}/api/elements/homepage?element-type=${elementType}&limit=${limit}`;
  const response = await fetch(apiCall);

  if (!response.ok) {
    const msgToBeSent = getErrorMessageToSend(apiCall, response.statusText);
    sendBugToSlack(msgToBeSent);

    throw new Error(`Error fetching featured elements: ${response.statusText}`);
  }

  const data = await response.json();
  return data["elements"];
}

/**
 * Searches for resources based on a keyword, with optional resource type, sorting, and pagination.
 * @async
 * @function DataSearcher
 * @param {string} keyword - The keyword to search for in resources.
 * @param {string} [elementType="any"] - The type of resources to filter by. Defaults to any, which means no filtering by type.
 * @param {string} [sortBy='_score'] - The field to sort the search results by. Defaults to 'prioritize_title_author'.
 * @param {string} [order='desc'] - The order of sorting, either 'asc' or 'desc'. Defaults to 'desc'.
 * @param {number} [from=0] - The starting index for pagination. Defaults to 0.
 * @param {number} [size=10] - The number of resources to return. Defaults to 10.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the search results.
 * @throws {Error} Throws an error if the search operation fails.
 */
export async function DataSearcher(
  keyword,
  elementType = "any",
  sortBy = "_score",
  order = "desc",
  from = 0,
  size = 10
) {
  if (!keyword || keyword === "") {
    return {
      elements: [],
      total_count: 0,
    };
  }

  try {
    const response = await fetch(
      `${BACKEND_URL_PORT}/api/search?keyword=${keyword}&element-type=${elementType}&sort-by=${sortBy}&order=${order}&from=${from}&size=${size}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search element");
    }

    const responseJson = await response.json();

    TEST_MODE &&
      console.log("Search return result from endpoint", responseJson);

    // An array of elements
    const elements = responseJson.elements;
    // Number of elements should have been returned without pagination
    const countOfTotal = responseJson["total_count"];
    // Number of elements should have been returned without pagination regardless element types
    const countsByTypes = responseJson["total_count_by_types"];

    const countsByTypesInArray = [];

    // Track total number of elements regardless of element types
    let countOfAny = 0;

    for (const idx in countsByTypes) {
      countsByTypesInArray.push([
        countsByTypes[idx]["element-type"],
        countsByTypes[idx]["count"],
      ]);
      countOfAny += countsByTypes[idx]["count"];
    }

    if (countOfAny > 0) {
      countsByTypesInArray.splice(0, 0, ["any", countOfAny]);
    }

    const result = {
      elements: elements,
      total_count: countOfTotal,
      total_count_by_types: countsByTypesInArray,
    };

    TEST_MODE && console.log("Search result to be returned", result);

    return result;
  } catch (error) {
    console.error("Error fetching search results: ", error.message);
    return "ERROR";
  }
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
    `${BACKEND_URL_PORT}/api/elements/titles?element-type=${elementType}`
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
 * @param {string} [sortBy='creation_time'] - The field by which to sort the results.
 * @param {string} [order='desc'] - The order of the sorting (ascending or descending).
 * @param {string} [from='0'] - The starting point of the results.
 * @param {string} [size='10'] - The number of results to retrieve.
 * @param {boolean} [countOnly=false] - only return count number.
 * @returns {Promise<Object|number>} The retrieved elements.
 * @throws {Error} If the request fails.
 */
export async function elementRetriever(
  fieldName = null,
  matchValue = null,
  elementType = null,
  sortBy = "creation_time",
  order = "desc",
  from = "0",
  size = "10",
  countOnly = false
) {
  let queries = "";
  if (fieldName !== null) {
    queries += `field-name=${fieldName}&match-value=${matchValue}`;
  }
  if (elementType !== null) {
    queries += `&element-type=${elementType}`;
  }

  try {
    const response = await fetch(
      `${BACKEND_URL_PORT}/api/elements?` +
        queries +
        `&sort-by=${sortBy}&order=${order}&from=${from}&size=${size}&count-only=${countOnly}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve elements");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching a list of elements: ", error.message);
    return "ERROR";
  }
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
  try {
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
      throw new Error(`Failed to fetch element: ${elementId}`);
    }

    const body = await response.json();

    return { ok: true, body: body };
  } catch (error) {
    console.error("Error fetching a single element: ", error.message);
    return {
      ok: false,
      body: `Error fetchSingleElementDetails(): ${error.message}`,
    };
  }
}

/**
 * Fetches a single private element for element pages
 *
 * @async
 * @function fetchSinglePrivateElementDetails
 * @param {string} elementId - Element ID
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the resources.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchSinglePrivateElementDetails(elementId) {
  try {
    const response = await fetchWithAuth(
      `${BACKEND_URL_PORT}/api/elements/private/${elementId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch private element: ${elementId}`);
    }

    const body = await response.json();

    return { ok: true, body: body };
  } catch (error) {
    console.error("Error fetching a single private element: ", error.message);
    return {
      ok: false,
      body: `Error fetchSinglePrivateElementDetails(). elementId: ${elementId}. Message: ${error.message}`,
    };
  }
}

/**
 * Get the number of contributions from a contributor
 *
 * @async
 * @function getNumberOfContributions
 * @param {string} uid - User ID
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the number.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getNumberOfContributions(uid) {
  const numberOfContributions = await elementRetriever(
    "contributor",
    encodeURIComponent(uid),
    null,
    null,
    null,
    "0",
    "0",
    true
  );
  return Number(numberOfContributions);
}

/**
 * Retrieve documentation from the database based on the provided parameters.
 *
 * @param {string} [from='0'] - The starting point of the results.
 * @param {string} [size='20'] - The number of results to retrieve.
 * @returns {Promise<Object|number>} The retrieved elements.
 * @throws {Error} If the request fails.
 */
export async function DocRetriever(from = "0", size = "20", countOnly = false) {
  try {
    const response = await fetch(
      `${BACKEND_URL_PORT}/api/documentation?from=${from}&size=${size}&count-only=${countOnly}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve docs");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching a list of docs: ", error.message);
    return "ERROR";
  }
}

/**
 * Fetches a single documentation
 *
 * @async
 * @function fetchSingleElementDetails
 * @param {string} docName - Documentation name
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the documentation.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchADocumentation(docName) {
  try {
    const response = await fetch(
      `${BACKEND_URL_PORT}/api/documentation/${docName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch documentation ${docName}`);
    }

    const body = await response.json();

    return { ok: true, body: body };
  } catch (error) {
    console.error("Error fetching a single documentation: ", error.message);
    return {
      ok: false,
      body: `Error fetchADocumentation(). docName: ${docName}. Message: ${error.message}`,
    };
  }
}

/**
 * Fetches the neighbors of an element
 *
 * @async
 * @function fetchNeighbors
 * @param {string} elementId - element ID
 * @param {Int} [depth=2] number of level for neighbor search
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the neighbors.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchNeighbors(elementId, depth = 2) {
  try {
    const response = await fetch(
      `${BACKEND_URL_PORT}/api/elements/${elementId}/neighbors`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch neighbors");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching neighbors: ", error.message);
    return "ERROR";
  }
}

/**
 * Fetches the whole connected elements
 *
 * @async
 * @function fetchConnectedGraph
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the connected graph.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function fetchConnectedGraph() {
  const apiCall = `${BACKEND_URL_PORT}/api/connected-graph`;
  try {
    const response = await fetch(apiCall, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const msgToBeSent = getErrorMessageToSend(apiCall, response.statusText);
      sendBugToSlack(msgToBeSent);

      throw new Error("Failed to fetch the connected graph");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching connected graph: ", error.message);
    return "ERROR";
  }
}

/**
 * Verify if there is a duplicate DOI or URL for publication
 *
 * @async
 * @function duplicateDOIExists
 * @param {string} url - DOI or URL
 * @returns {Promise<Object>} A promise that resolves to the JSON response related to DOI duplication.
 * @throws {Error} Throws an error if the verification fails.
 */
export async function duplicateDOIExists(url) {
  const encodedUrl = encodeURIComponent(url);

  try {
    const response = await fetch(
      `${BACKEND_URL_PORT}/api/duplicate?field-name=doi&&value=${encodedUrl}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to verify duplication");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching neighbors: ", error.message);
    return "ERROR";
  }
}

/**
 * Retrieve top search terms
 *
 * @async
 * @function retrieveTopSearchKeywords
 * @param {Int} [numberOfTerms=5] - Number of terms returned. Default 5
 * @param {Int} [timespan=6] - Time window in hours. Default 24
 * @returns {Promise<Object>} A promise that resolves to the JSON response related to top search terms.
 * @throws {Error} Throws an error if the retrieval fails.
 */
export async function retrieveTopSearchKeywords(
  numberOfTerms = 5,
  timespan = 24
) {
  try {
    const response = await fetch(
      `${BACKEND_URL_PORT}/api/top-keywords?k=${numberOfTerms}&t=${timespan}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get top keywords");
    }

    return response.json();
  } catch (error) {
    console.error("Error getting top keywords: ", error.message);
    return "ERROR";
  }
}

/**
 * Retrieve private elements from the database by user id.
 *
 * @param {string} [userId] - User ID.
 * @param {string} [sortBy='creation_time'] - The field by which to sort the results.
 * @param {string} [order='desc'] - The order of the sorting (ascending or descending).
 * @param {string} [from='0'] - The starting point of the results.
 * @param {string} [size='12'] - The number of results to retrieve.
 * @returns {Promise<Object|number>} The retrieved private elements.
 * @throws {Error} If the request fails.
 */
export async function retrievePrivateElementsByUserId(
  userId,
  sortBy = "creation_time",
  order = "desc",
  from = "0",
  size = "12"
) {
  try {
    const response = await fetchWithAuth(
      `${BACKEND_URL_PORT}/api/elements/private?` +
        `user-id=${userId}&sort-by=${sortBy}&order=${order}&from=${from}&size=${size}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve private elements");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching a list of private elements: ", error.message);
    return "ERROR";
  }
}

/**
 * Get whether the element is bookmarked or not by the user
 *
 * @async
 * @function getElementBookmarkStatus
 * @param {string} elementId - Element ID
 * @param {string} elementType - the type of the element
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the bookmark status.
 * @throws {Error} Throws an error if getting the bookmark status fails.
 */
export async function getElementBookmarkStatus(elementId, elementType) {
  let query = "";
  if (elementType) {
    query += `?elementType=${elementType}`;
  }
  try {
    const response = await fetchWithAuth(
      `${BACKEND_URL_PORT}/api/users/bookmark/${elementId}` + query,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get the save status");
    }

    return response.json();
  } catch (error) {
    console.error("Error getting the save status: ", error.message);
    return "ERROR";
  }
}

/**
 * Bookmark or unbookmark an element to the users profile
 *
 * @async
 * @function handleBookmarkingAnElement
 * @param {string} elementId - Element ID
 * @param {boolean} bookmarkElement - True - to bookmark this element; False - to unbookmark this element
 * @param {string} elementType - the type of the element
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the status.
 * @throws {Error} Throws an error if bookmarking or unbookmarking the element fails.
 */
export async function handleBookmarkingAnElement(
  elementId,
  bookmarkElement = true,
  elementType
) {
  let query = `?bookmark=${bookmarkElement}`;
  if (elementType) {
    query += `&elementType=${elementType}`;
  }
  try {
    const response = await fetchWithAuth(
      `${BACKEND_URL_PORT}/api/users/bookmark/${elementId}` + query,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to bookmark or unbookmark an element");
    }

    return response.json();
  } catch (error) {
    console.error(
      "Error bookmarking or unbookmarking an element: ",
      error.message
    );
    return "ERROR";
  }
}

/**
 * Retrieve bookmarked elements from the database by user id.
 *
 * @async
 * @function retrieveBookmarkedElements
 * @param {string} [userId] - User ID.
 * @param {string} [sortBy='creation_time'] - The field by which to sort the results.
 * @param {string} [order='desc'] - The order of the sorting (ascending or descending).
 * @param {string} [from='0'] - The starting point of the results.
 * @param {string} [size='12'] - The number of results to retrieve.
 * @returns {Promise<Object|number>} The retrieved bookmarked elements.
 * @throws {Error} If the request fails.
 */
export async function retrieveBookmarkedElements(
  userId,
  sortBy = "creation_time",
  order = "desc",
  from = "0",
  size = "12"
) {
  try {
    const response = await fetchWithAuth(
      `${BACKEND_URL_PORT}/api/elements/bookmark` +
        `?user-id=${userId}&sort-by=${sortBy}&order=${order}&from=${from}&size=${size}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve bookmarked elements");
    }

    return response.json();
  } catch (error) {
    console.error(
      "Error fetching a list of bookmarked elements: ",
      error.message
    );
    return "ERROR";
  }
}
