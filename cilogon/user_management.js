const { logger } = require("./logger.js");
require('dotenv').config({ quiet: true });

const AUTH_API_KEY = process.env.AUTH_API_KEY;
const USER_BACKEND_URL = process.env.REACT_DATABASE_BACKEND_URL;

/**
 * Add a user
 * @param {string} openId the OpenID of the user
 * @param {string} first_name the first name of the user
 * @param {string} last_name the last name of the user
 * @param {string} email the work email of the user
 * @param {string} affiliation the university of organization of the user
 * @return {Promise<Array<Dict>>} information of whether the operation was successful
 * @throws {Error} Throws an error if adding a user failed
 */
async function addUser(
  openId,
  first_name,
  last_name,
  email,
  affiliation
) {
  const userPayload = {
    openid: openId,
    first_name: first_name,
    last_name: last_name,
    email: email,
    affiliation: affiliation
  };

  try {
    const response = await fetch(`${USER_BACKEND_URL}/api/auth/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Auth-API-Key": AUTH_API_KEY
      },
      body: JSON.stringify(userPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error({
        type: "Failed to create user",
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        user: userPayload,
      });
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    logger.info({
      type: "Added a new user to the database",
      user: userPayload,
    });

    // Return the user information, including id and role.
    return result.user;
  } catch (error) {
    logger.error({
      type: 'Error during user creation',
      message: error.message || error,
      stack: error.stack,
      user: userPayload,
    });
    throw error;
  }
}

/**
 * Verify the existence of a user
 * @param {string} openId OpenID
 * @return {Promise<boolean>} boolean value of whether the user exists
 */
async function checkUser(openId) {
  const encodedOpenId = encodeURIComponent(openId);

  try {
    const response = await fetch(
      `${USER_BACKEND_URL}/api/users/${encodedOpenId}/valid`
    );

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error({
        type: "Failed to validate user existence",
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        openid: openId
      });
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const exists = await response.json();
    return exists;
  } catch (error) {
    logger.error({
      type: 'Error during user validation',
      error: error.message || error,
      stack: error.stack,
      openid: openId,
    });
    throw error;
  }
}

/**
 * Get user role number
 * @param {string} openId OpenID
 * @return {Promise<Int>} The user role number. Or the lowest permission if it fails to retrieve user role
 */
async function getUserRole(openId) {
  const encodedOpenId = encodeURIComponent(openId);

  try {
    const response = await fetch(
      `${USER_BACKEND_URL}/api/users/${encodedOpenId}/role`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error({
        type: "Failed to retrieve user role",
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        openid: openId
      });
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result.role;
  } catch (error) {
    logger.error({
      type: 'Error during retrieving user role',
      error: error.message || error,
      stack: error.stack,
      openid: openId,
    });
    throw error;
  }
}

module.exports = {
  addUser,
  checkUser,
  getUserRole
}