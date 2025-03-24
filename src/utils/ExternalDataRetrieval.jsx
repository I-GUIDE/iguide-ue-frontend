const TEST_MODE = import.meta.env.VITE_TEST_MODE;

/**
 * Fetches publication metadata via Crossref
 *
 * @async
 * @function getPublicationMetadata
 * @param {string} doi - The DOI of the publication
 * @returns {Promise<Array<string>>} A promise that contains the metadata of the publication
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getPublicationMetadata(doi) {
  const encodedDOI = encodeURIComponent(doi);
  try {
    // Construct the CrossRef API URL
    const apiCall = `https://api.crossref.org/works/${encodedDOI}`;
    const response = await fetch(apiCall);

    // Make the HTTP request to the CrossRef API
    if (!response.ok) {
      throw new Error(
        `Error fetching publication metadata: ${response.statusText}`
      );
    }

    // Extract metadata from the response
    const metadata = await response.json();
    TEST_MODE && console.log("Returned publication metadata", metadata);

    return metadata?.message;
  } catch (error) {
    console.warn("Error fetching metadata:", error);
    return "Publication not found";
  }
}

/**
 * Retrieve spatial metadata.
 *
 * @async
 * @function getSpatialMetadata
 * @param {string} location - Location users input
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the spatial metadata.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getSpatialMetadata(location) {
  const encodedLocation = encodeURIComponent(location);
  try {
    const apiCall = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=jsonv2&polygon_text=true&polygon_threshold=0.001`;
    const response = await fetch(apiCall);

    if (!response.ok) {
      throw new Error(
        `Error fetching the spatial metadata: ${response.statusText}`
      );
    }

    const data = await response.json();
    TEST_MODE && console.log("Returned spatial metadata", data);
    if (!data || data.length === 0) {
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Error fetching spatial metadata: ", error.message);
    return "ERROR";
  }
}
