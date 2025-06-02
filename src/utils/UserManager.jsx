import { fetchWithAuth, refreshAccessToken } from "./FetcherWithJWT";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const ENV = import.meta.env.VITE_ENV;

/**
 * Log in user
 */
export async function userLogin() {
  const currentLocation = window.location;

  // redirect users to the default page if the login appears at the home page
  if (currentLocation.pathname === "/") {
    window.open(AUTH_BACKEND_URL + "/login", "_self");
    return;
  }
  const redirectURI = currentLocation?.pathname + currentLocation?.search;
  TEST_MODE && console.log("Redirect URI for login", redirectURI);

  window.open(
    AUTH_BACKEND_URL +
      "/login?redirect-path=" +
      encodeURIComponent(redirectURI),
    "_self"
  );
}

/**
 * Log out user, and redirect user back to where they were before logout
 */
export async function userLogout() {
  const currentLocation = window.location;
  const redirectURI = currentLocation?.pathname + currentLocation?.search;
  TEST_MODE && console.log("Redirect URI for logout", redirectURI);

  // Log user out with redirect path
  window.open(
    AUTH_BACKEND_URL +
      "/logout?redirect-path=" +
      encodeURIComponent(redirectURI),
    "_self"
  );
}

/**
 * Get all user information with pagination
 * @param {number} [from=0] - The starting index for pagination. Defaults to 0.
 * @param {number} [size=24] - The number of resources to return. Defaults to 24.
 * @param {number} [sortBy="last_name"] - Sorting method. Defaults to last name.
 * @param {string} [order="asc"] - The order of sorting, either 'asc' or 'desc'. Defaults to 'asc'.
 * @param {string} filterName - Filter name
 * @param {string} filterValue - Filter value
 * @return {Promise<Array<Dict>>} the information of the user
 * @throws {Error} Throws an error if fetching the user failed.
 */
export async function getAllUsers(
  from = 0,
  size = 24,
  sortBy = "last_name",
  order = "asc",
  filterName,
  filterValue
) {
  let uri = `${USER_BACKEND_URL}/api/users?from=${from}&size=${size}&sort-by=${sortBy}&sort-order=${order}`;
  if (filterName && filterValue) {
    uri += `&filter-name=${filterName}&filter-value=${filterValue}`;
  }

  const response = await fetchWithAuth(uri, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const result = await response.json();
  TEST_MODE &&
    console.log("Retrieve users from index", from, "of size", size, result);

  return result;
}

/**
 * Get user role number
 * @param {string} uid OpenID (Only when getting user role during authentication) or userId
 * @return {Promise<Int>} The user role number. Or the lowest permission if it fails to retrieve user role
 */
export async function getUserRole(uid) {
  const encodedUid = encodeURIComponent(uid);
  const response = await fetch(
    `${USER_BACKEND_URL}/api/users/${encodedUid}/role`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    console.warn("Failed to retrieve user role...");
    TEST_MODE && console.log(`Error: ${response.status}`);
    return 10;
  }

  const result = await response.json();

  TEST_MODE &&
    console.log(`GET user role. UserId: ${uid}, return: ${result.role}`);

  return result.role;
}

/**
 * Get user role number
 * @param {string} uid OpenID (Only when getting user role during authentication) or userId
 * @param {string} newRole New role number
 * @return {Promise<Int>} The user role number. Or the lowest permission if it fails to retrieve user role
 */
export async function updateUserRole(uid, newRole) {
  TEST_MODE && console.log("Update user role", uid, newRole);
  const encodedUid = encodeURIComponent(uid);
  try {
    const response = await fetchWithAuth(
      `${USER_BACKEND_URL}/api/users/${encodedUid}/role`,
      {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to update user role...");
      TEST_MODE && console.log(`Error: ${response.status}`);
      return "ERROR";
    }

    TEST_MODE &&
      console.log(`Changed user role. UserId: ${uid}, return: ${newRole}`);

    return newRole;
  } catch (error) {
    console.error("Error updating user role: ", error.message);
    return "ERROR";
  }
}

/**
 * Fetch the information of a user given a uid
 * @param {string} uid OpenID (Only when fetching user info during authentication) or userId
 * @return {Promise<Array<Dict>>} the information of the user
 * @throws {Error} Throws an error if fetching the user failed.
 */
export async function fetchUser(uid) {
  const encodedUid = encodeURIComponent(uid);
  const response = await fetch(`${USER_BACKEND_URL}/api/users/${encodedUid}`);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Update a user
 * @param {string} uid UserId
 * @param {string} first_name the first name of the user
 * @param {string} last_name the last name of the user
 * @param {string} email the work email of the user
 * @param {string} affiliation the university of organization of the user
 * @param {string} bio a short bio of the user
 * @param {string} avatar_url the link to the profile picture
 * @return {Promise<Array<Dict>>} information of whether the operation was successful
 * @throws {Error} Throws an error if updating a user failed
 */
export async function updateUser(
  uid,
  first_name,
  last_name,
  email,
  affiliation,
  bio,
  gitHubLink,
  linkedInLink,
  googleScholarLink,
  personalWebsiteLink,
  avatar_url
) {
  const encodedUid = encodeURIComponent(uid);
  const user = {
    id: encodedUid,
    first_name: first_name,
    last_name: last_name,
    email: email,
    affiliation: affiliation,
    bio: bio,
    gitHubLink: gitHubLink,
    linkedInLink,
    googleScholarLink: googleScholarLink,
    personalWebsiteLink: personalWebsiteLink,
    avatar_url: avatar_url,
  };

  TEST_MODE && console.log("User update", user);

  const response = await fetchWithAuth(
    `${USER_BACKEND_URL}/api/users/${encodedUid}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Delete a user
 * @param {string} uid UserId
 * @return {Promise<Array<Dict>>} information of whether the operation was successful
 * @throws {Error} Throws an error if deleting a user failed
 */
export async function deleteUser(uid) {
  try {
    const encodedUid = encodeURIComponent(uid);
    const response = await fetchWithAuth(
      `${USER_BACKEND_URL}/api/users/${encodedUid}`,
      {
        method: "DELETE",
      }
    );

    // Handle case when there is a logical conflict that prevents a user from being deleted.
    //  Could be either: the user is a super admin. 2. the user has contributions.
    if (response.status === 409) {
      console.warn("Cannot delete this user due to a conflict.");
      return "CONFLICT";
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting user: ", error.message);
    return "ERROR";
  }
}

/**
 * Verify whether the refresh token has expired
 * The checkTokens function will redirect users to /logout if the refresh token has expired.
 */
export async function checkTokens() {
  // Don't check token in the localhost environment
  if (ENV === "localhost") {
    return;
  }
  const response = await fetchWithAuth(`${USER_BACKEND_URL}/api/check-tokens`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const resultFromJWT = await response.json();
  const userRoleFromJWT = resultFromJWT?.role;
  const userIdFromJWT = resultFromJWT?.id;
  const userRoleFromDB = await getUserRole(userIdFromJWT);

  TEST_MODE && console.log("checkTokens: result from JWT", resultFromJWT);
  TEST_MODE && console.log("checkTokens: user role from DB", userRoleFromDB);

  // If user permission from DB is higher (role number lower) than JWT, or userRoleFromDB is undefined, refresh token...
  if (userRoleFromDB < userRoleFromJWT || userRoleFromJWT === undefined) {
    TEST_MODE && console.log("checkTokens(): refreshAccessToken...");
    // After refreshing the token, it will return the up-to-date user role
    const resultFromRefresh = await refreshAccessToken();
    TEST_MODE &&
      console.log(
        "checkTokens: result from refreshAccessToken",
        resultFromRefresh
      );
    return resultFromRefresh;
    // If user permission from DB is lower (role number higher) than JWT, log user out...
  } else if (userRoleFromDB > userRoleFromJWT) {
    console.warn("Logging out due to a role conflict");
    const sessionExpiration = {
      showModal: true,
      message:
        "We encountered an issue. Please log in again. If this issue persists, please contact us via the help page. Error code: 1001.",
    };
    sessionStorage.setItem(
      "iguideSessionExpired",
      JSON.stringify(sessionExpiration)
    );
    userLogout();
  } else {
    return resultFromJWT;
  }
}
