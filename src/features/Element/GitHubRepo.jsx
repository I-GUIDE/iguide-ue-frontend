import React, { useState, useEffect, lazy, Suspense } from "react";
import { Octokit } from "octokit";
const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";

import AltRoute from "@mui/icons-material/AltRoute";
import Visibility from "@mui/icons-material/Visibility";
import Star from "@mui/icons-material/Star";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function GitHubRepo(props) {
  const repoLink = props.repoLink;
  const repoReadmeFromDB = props.repoReadmeFromDB;

  const [repoReadme, setRepoReadme] = useState();
  const [repoReadmeSource, setRepoReadmeSource] = useState();
  const [watchersCount, setWatchersCount] = useState();
  const [forksCount, setForksCount] = useState();
  const [starsCount, setStarsCount] = useState();

  useEffect(() => {
    async function fetchRepoData() {
      // Github API get watchers, forks, stars
      const octokit = new Octokit();
      const repoOwner = repoLink?.match("github.com/(.*?)/")[1];
      const repoName = repoLink?.match("github.com/.*?/(.+?)($|/)")[1];

      TEST_MODE && console.log("repo owner and name", repoOwner, repoName);

      try {
        const readmeData = await octokit.request(
          "GET /repos/{owner}/{repo}/readme",
          {
            owner: repoOwner,
            repo: repoName,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
              accept: "application/vnd.github.html+json",
            },
          }
        );
        TEST_MODE && console.log("readme data", readmeData);
        setRepoReadmeSource("github");
        setRepoReadme(readmeData.data);
      } catch (e) {
        TEST_MODE && console.log("GitHub API unavailable", e);
        if (!repoReadmeFromDB) {
          setRepoReadmeSource("unavailable");
          setRepoReadme(
            "<div>This README.md preview is currently unavailable.</div>"
          );
        } else {
          setRepoReadmeSource("db");
          setRepoReadme(repoReadmeFromDB);
        }
      }

      // Do some error checking
      const watcherData = await octokit.request(
        "GET /repos/{owner}/{repo}/subscribers",
        {
          owner: repoOwner,
          repo: repoName,
        }
      );
      setWatchersCount(watcherData["data"].length);

      const forksData = await octokit.request(
        "GET /repos/{owner}/{repo}/forks",
        {
          owner: repoOwner,
          repo: repoName,
        }
      );
      setForksCount(forksData["data"].length);

      const starsData = await octokit.request(
        "GET /repos/{owner}/{repo}/stargazers",
        {
          owner: repoOwner,
          repo: repoName,
        }
      );
      setStarsCount(starsData["data"].length);
    }
    if (repoLink) {
      fetchRepoData();
    }
  }, [repoLink, repoReadmeFromDB]);

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography id="repo-access" level="h5" fontWeight="lg" mb={1}>
        GitHub Repository
      </Typography>
      <Divider inset="none" />
      <Link href={repoLink} target="_blank" rel="noopener noreferrer">
        {repoLink}
      </Link>
      <Stack spacing={2} direction="row">
        <Chip variant="outlined" sx={{ fontWeight: "xl" }}>
          <Star />
          Watch {watchersCount}
        </Chip>
        <Chip variant="outlined" sx={{ fontWeight: "xl" }}>
          <AltRoute />
          Fork {forksCount}
        </Chip>
        <Chip variant="outlined" sx={{ fontWeight: "xl" }}>
          <Visibility />
          Star {starsCount}
        </Chip>
      </Stack>
      <Typography
        id="repo-readme"
        level="title-md"
        fontWeight="lg"
        sx={{ pt: 2 }}
      >
        README.md
      </Typography>
      <Typography id="warning-relative-links" level="body-sm">
        Some links or images may not work due to the use of relative file paths.
      </Typography>
      {repoReadmeSource === "db" && (
        <Typography id="warning-relative-links" level="body-sm" color="warning">
          Due to GitHub API limitations, we are temporarily displaying the
          version stored in our database. This version may be outdated. Please
          click{" "}
          <Link href={repoLink} target="_blank" rel="noopener noreferrer">
            here
          </Link>{" "}
          to view the latest version on GitHub.
        </Typography>
      )}
      <Box sx={{ p: 4, border: "0.5px dashed grey" }}>
        <div className="container" data-color-mode="light">
          <Suspense fallback={<p>Loading content...</p>}>
            <MarkdownPreview source={repoReadme} />
          </Suspense>
        </div>
      </Box>
    </Stack>
  );
}
