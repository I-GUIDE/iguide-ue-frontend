import { fetchWithAuth } from "./FetcherWithJWT";

const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

// Initialize file chunk upload. An uploadId will be returned
export async function initializeUpload(filename, filesize, filetype) {
  const response = await fetchWithAuth(
    `${BACKEND_URL_PORT}/api/elements/datasets/upload/chunk/init`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: filename,
        fileSize: filesize,
        mimeType: filetype,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to initialize user dataset upload.");
  }

  return await response.json();
}

// Upload a single chunk
export async function singleChunkUpload(
  uploadId,
  fileChunk,
  chunkIdx,
  totalChunks
) {
  const formData = new FormData();
  formData.append("chunk", fileChunk, `chunk-${chunkIdx}.part`);
  formData.append("chunkNumber", chunkIdx.toString());
  formData.append("totalChunks", totalChunks.toString());

  // Log form content
  for (const pair of formData.entries()) {
    TEST_MODE && console.log("FormData entry:", pair[0], pair[1]);
  }

  const response = await fetchWithAuth(
    `${BACKEND_URL_PORT}/api/elements/datasets/upload/chunk/${uploadId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to upload chunk ${chunkIdx}`);
  }

  return await response.json();
}

// Finish and verify the upload
export async function completeUpload(uploadId) {
  const response = await fetchWithAuth(
    `${BACKEND_URL_PORT}/api/elements/datasets/upload/chunk/complete/${uploadId}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to complete upload");
  }

  return await response.json();
}

// Abort the upload in the middle
export async function abortUpload(uploadId) {
  const response = await fetchWithAuth(
    `${BACKEND_URL_PORT}/api/elements/datasets/upload/chunk/${uploadId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to abort upload");
  }

  return await response.json();
}
