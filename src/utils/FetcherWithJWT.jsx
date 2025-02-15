const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL;
const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

// Redirect users to auth backend for logout
function logout() {
  const currentLocation = window.location;
  const redirectURI = currentLocation?.pathname + currentLocation?.search;
  TEST_MODE &&
    console.log("Redirect URI for logout (in JWT func)", redirectURI);

  window.open(
    AUTH_BACKEND_URL +
      "/logout?redirect-uri=" +
      encodeURIComponent(redirectURI),
    "_self"
  );
}

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
    alert("Session expired. Please login again!");
    logout();
  }

  const data = await res.json();
  return data;
}
