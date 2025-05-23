const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const DEEP_TEST_MODE = import.meta.env.VITE_DEEP_TEST_MODE;

/**
 * Retrieve README.md using GitHub API
 *
 * @param {string} repoOwner - The name of the repository owner
 * @param {string} repoName - The name of the respository
 * @returns {Promise<Object>} The raw README.md or ERROR
 * @throws {Error} If the request fails.
 */
export async function fetchGitHubReadme(repoOwner, repoName) {
  if (!repoOwner || !repoName) {
    return "ERROR";
  }

  try {
    // Fetch readme metadata
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/readme`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      TEST_MODE && console.log("GitHub API unavailable");
      return "ERROR";
    }

    const readmeData = await response.json();
    TEST_MODE && console.log("readme data", readmeData);

    // Fetch raw readme
    const downloadResponse = await fetch(readmeData.download_url, {
      method: "GET",
    });

    if (!downloadResponse.ok) {
      TEST_MODE && console.log("Raw readme link unavailable");
      return "ERROR";
    }
    TEST_MODE && console.log("download_url response", downloadResponse);

    const rawReadme = await downloadResponse.text();
    DEEP_TEST_MODE && console.log("raw readme", rawReadme);

    return rawReadme;
  } catch (error) {
    TEST_MODE && console.log("GitHub readme API unavailable", error.message);
    return "ERROR";
  }
}

/**
 * Fetch number of watchers, stars, and forks of a GitHub repository via GitHub API
 *
 * @param {string} repoOwner - The name of the repository owner
 * @param {string} repoName - The name of the respository
 * @returns {Promise<Object>} The number of watchers, stars, and forks or ERROR
 * @throws {Error} If the request fails.
 */
export async function fetchRepoMetadata(repoOwner, repoName) {
  if (!repoOwner || !repoName) {
    return "ERROR";
  }

  try {
    // Fetch number of watchers, stars, and forks
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return "ERROR";
    }

    const repoMetadata = await response.json();

    TEST_MODE && console.log("repo metadata", repoMetadata);

    return {
      watchers: repoMetadata.subscribers_count,
      stars: repoMetadata.stargazers_count,
      forks: repoMetadata.forks_count,
    };
  } catch (error) {
    TEST_MODE && console.log("GitHub repo API unavailable", error.message);
    return "ERROR";
  }
}

/**
 * Verify if a file exists on GitHub
 *
 * @param {string} ownerAndRepo - The name of the repository owner and repo name
 * @param {string} path - The name of the path
 * @returns {Promise<Object>} If the file exists on GitHub
 * @throws {Error} If the request fails.
 */
export async function verifyFileOnGitHub(ownerAndRepo, path) {
  if (!ownerAndRepo || !path) {
    return "ERROR";
  }

  try {
    // Fetch number of watchers, stars, and forks
    const response = await fetch(
      `https://api.github.com/repos/${ownerAndRepo}/contents/${path}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return "ERROR";
    }

    return response.status === 200;
  } catch (error) {
    TEST_MODE && console.log("Error verifying file with GitHub", error.message);
    return "ERROR";
  }
}
