import { fetchWithAuth, refreshAccessToken } from "./FetcherWithJWT";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const ENV = import.meta.env.VITE_ENV;

/**
 * Log in user
 */
export async function userLogin() {
  window.open(AUTH_BACKEND_URL + "/login", "_self");
}

/**
 * Log out user, and redirect user back to where they were before logout
 */
export async function userLogout() {
  const currentLocation = window.location;
  const redirectURI = currentLocation?.pathname + currentLocation?.search;
  TEST_MODE && console.log("Redirect URI for logout", redirectURI);

  window.open(
    AUTH_BACKEND_URL +
      "/logout?redirect-uri=" +
      encodeURIComponent(redirectURI),
    "_self"
  );
}

/**
 * Get all user information with pagination
 * @param {number} [from=0] - The starting index for pagination. Defaults to 0.
 * @param {number} [size=24] - The number of resources to return. Defaults to 24.
 * @return {Promise<Array<Dict>>} the information of the user
 * @throws {Error} Throws an error if fetching the user failed.
 */
export async function getAllUsers(from = 0, size = 24) {
  const response = await fetchWithAuth(
    `${USER_BACKEND_URL}/api/users?from=${from}&size=${size}`,
    {
      method: "GET",
    }
  );
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
 * Add a user
 * @param {string} openid the OpenID of the user
 * @param {string} first_name the first name of the user
 * @param {string} last_name the last name of the user
 * @param {string} email the work email of the user
 * @param {string} affiliation the university of organization of the user
 * @param {string} bio a short bio of the user
 * @return {Promise<Array<Dict>>} information of whether the operation was successful
 * @throws {Error} Throws an error if adding a user failed
 */
export async function addUser(
  openid,
  first_name,
  last_name,
  email,
  affiliation,
  bio
) {
  const user = {
    openid: openid,
    first_name: first_name,
    last_name: last_name,
    email: email,
    affiliation: affiliation,
    bio: bio,
  };

  const response = await fetchWithAuth(`${USER_BACKEND_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${error.message}`);
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
    throw new Error(`Error: ${response.status} ${error.message}`);
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
  const encodedUid = encodeURIComponent(uid);
  const response = await fetch(`${USER_BACKEND_URL}/api/users/${encodedUid}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${error.message}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Verify the existence of a user
 * @param {string} uid OpenID (Only when checking user during authentication) or userId
 * @return {Promise<boolean>} boolean value of whether the user exists
 */
export async function checkUser(uid) {
  const encodedUid = encodeURIComponent(uid);
  const response = await fetch(
    `${USER_BACKEND_URL}/api/users/${encodedUid}/valid`
  );
  const exists = await response.json();

  return exists;
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
    throw new Error(`Error: ${response.status} ${error.message}`);
  }

  const resultsFromJWT = await response.json();
  const userRoleFromJWT = resultsFromJWT.role;
  const userIdFromJWT = resultsFromJWT.id;
  const userRoleFromDB = await getUserRole(userIdFromJWT);

  TEST_MODE && console.log("checkTokens(): results from JWT", resultsFromJWT);
  TEST_MODE && console.log("checkTokens(): role from DB", userRoleFromDB);

  // If user permission from DB is higher (role number lower) than JWT, or userRoleFromDB is undefined, refresh token...
  if (userRoleFromDB < userRoleFromJWT || userRoleFromJWT === undefined) {
    TEST_MODE && console.log("checkTokens(): refreshAccessToken...");
    await refreshAccessToken();
    // If user permission from DB is lower (role number higher) than JWT, log user out...
  } else if (userRoleFromDB > userRoleFromJWT) {
    TEST_MODE && console.log("checkTokens(): logging you out...");
    alert(
      `We encountered an issue. Please log in again. If this issue persists, please contact us via the help page. Error: 1001.`
    );
    userLogout();
  } else {
    return userRoleFromJWT;
  }
}
