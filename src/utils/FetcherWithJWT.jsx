import { userLogout } from "./UserManager";

const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export async function fetchWithAuth(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include", // Ensure cookies are sent with the request
  });

  // Case: access token expired, try using the refresh token
  if (res.status === 401) {
    TEST_MODE && console.log("Token expired, try to refresh");
    // Access token has expired, refresh it
    await refreshAccessToken();

    // Retry the original request
    res = await fetch(url, {
      ...options,
      credentials: "include",
    });
    // Case: access token missing
  } else if (res.status === 403) {
    alert("Invalid credential: You don't have permission to access this page!");
  }

  return res;
}

export async function refreshAccessToken() {
  const res = await fetch(`${BACKEND_URL_PORT}/api/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  // Refresh token expired or missing
  if (!res.ok) {
    alert("Your session has expired. Please log in again.");
    userLogout();
  }

  const data = await res.json();
  return data;
}
