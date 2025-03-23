const TEST_MODE = import.meta.env.VITE_TEST_MODE;

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
  const apiCall = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=jsonv2&polygon_text=true&polygon_threshold=0.001`;
  const response = await fetch(apiCall);

  if (!response.ok) {
    throw new Error(
      `Error autofilling the spatial metadata: ${response.statusText}`
    );
  }

  const data = await response.json();
  TEST_MODE && console.log("Returned spatial metadata", data);
  if (!data || data.length === 0) {
    return null;
  }

  return data;
}
