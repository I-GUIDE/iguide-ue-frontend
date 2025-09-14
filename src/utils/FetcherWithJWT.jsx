import { userLogout } from "./UserManager";

const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const ENV = import.meta.env.VITE_ENV;
const LOCALHOST_API_KEY = import.meta.env.VITE_LOCALHOST_API_KEY;

export async function fetchWithAuth(url, options = {}) {
  // When the environment is lcoalhost with correct API key, by pass JWT...
  if (ENV === "localhost" && LOCALHOST_API_KEY) {
    TEST_MODE && console.log("Bypassing JWT for localhost", url, options);
    const res = await fetch(url, {
      ...options,
      headers: {
        "JWT-API-KEY": LOCALHOST_API_KEY,
        ...(options.headers || {}),
      },
    });

    return res;
  }

  TEST_MODE && console.log("Fetch with JWT", url, options);
  let res = await fetch(url, {
    ...options,
    credentials: "include", // Ensure cookies are sent with the request
  });

  TEST_MODE && console.log("Fetch with JWT returned", res);

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

    TEST_MODE && console.log("Fetch retry returned", res);
  }

  // Case: access token missing
  if (res.status === 403) {
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
    const sessionExpiration = {
      showModal: true,
      message:
        "To keep your account safe, we logged you out after some time. Just log back in to continue.",
    };
    sessionStorage.setItem(
      "iguideSessionExpired",
      JSON.stringify(sessionExpiration)
    );
    userLogout();
  }

  const data = await res.json();
  return data;
}
