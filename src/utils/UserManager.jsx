const USER_BACKEND_URL = "https://backend.i-guide.io:5000"

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

export async function checkUser(uid) {
    const openid = encodeURIComponent(uid);
    const response = await fetch(`${USER_BACKEND_URL}/api/check_users/${openid}`);
    const exists = await response.json();

    return exists;
}