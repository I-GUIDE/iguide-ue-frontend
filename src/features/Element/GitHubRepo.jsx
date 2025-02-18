import React, { useState, useEffect } from "react";
import { Octokit } from "octokit";

import Grid from "@mui/joy/Grid";
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

  const [repoReadme, setRepoReadme] = useState();
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
      setRepoReadme(readmeData["url"]["download_url"]);

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
  }, [repoLink]);

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
      <iframe
        src={repoReadme}
        frame-ancestors="self"
        width="75%"
        height="500px"
      ></iframe>
    </Stack>
  );
}
