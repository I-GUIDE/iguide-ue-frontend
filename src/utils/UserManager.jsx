const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL

/**
 * Fetch the information of a user given a uid
 * @param {string} uid the user's OpenID
 * @return {Promise<Array<Dict>>} the information of the user
 * @throws {Error} Throws an error if fetching the user failed.
 */
export async function fetchUser(uid) {
    const openid = encodeURIComponent(uid);
    const response = await fetch(`${USER_BACKEND_URL}/api/users/${openid}`);

    console.log('USER_MANAGER: fetched a user - res', response);

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
    }

    const result = await response.json();
    console.log('USER_MANAGER: fetched a user', result);
    return result;
}

/**
 * Add a user
 * @param {string} uid the OpenID of the user
 * @param {string} first_name the first name of the user
 * @param {string} last_name the last name of the user
 * @param {string} email the work email of the user
 * @param {string} affiliation the university of organization of the user
 * @param {string} bio a short bio of the user
 * @return {Promise<Array<Dict>>} information of whether the operation was successful
 * @throws {Error} Throws an error if adding a user failed
 */
export async function addUser(uid, first_name, last_name, email, affiliation, bio) {
    const user = {
        openid: uid,
        first_name: first_name,
        last_name: last_name,
        email: email,
        affiliation: affiliation,
        bio: bio
    };

    const response = await fetch(`${USER_BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${error.message}`)
    }

    const result = await response.json();
    console.log('USER_MANAGER: added a user', result)
    return result;
}

/**
 * Delete a user
 * @param {string} uid the OpenID of the user
 * @return {Promise<Array<Dict>>} information of whether the operation was successful
 * @throws {Error} Throws an error if deleting a user failed
 */
export async function deleteUser(uid) {
    const openid = encodeURIComponent(uid);
    const response = await fetch(`${USER_BACKEND_URL}/api/users/${openid}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${error.message}`)
    }

    const result = await response.json();
    console.log('USER_MANAGER: deleted a user', result)
    return result;
}

/**
 * Delete a user
 * @param {string} uid the OpenID of the user
 * @return {Promise<boolean>} boolean value of whether the user exists
 */
export async function checkUser(uid) {
    const openid = encodeURIComponent(uid);
    const response = await fetch(`${USER_BACKEND_URL}/api/check_users/${openid}`);
    const exists = await response.json();

    return exists;
}