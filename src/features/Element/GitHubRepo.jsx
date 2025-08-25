import { useState, useEffect, lazy, Suspense } from "react";
const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";

import AltRouteIcon from "@mui/icons-material/AltRoute";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from "@mui/icons-material/Star";
import WarningIcon from "@mui/icons-material/Warning";

import {
  fetchGitHubReadme,
  fetchRepoMetadata,
} from "../../utils/GitHubFetchMethods";
import { NumberText } from "../../utils/NumberText";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function GitHubRepo(props) {
  const repoLink = props.repoLink;
  const repoReadmeFromDB = props.repoReadmeFromDB;

  const [repoReadme, setRepoReadme] = useState();
  const [repoReadmeSource, setRepoReadmeSource] = useState();
  const [watchersCount, setWatchersCount] = useState();
  const [forksCount, setForksCount] = useState();
  const [starsCount, setStarsCount] = useState();
  // True when the GitHub API returns repo metadata
  const [repoMetadataReady, setRepoMetadataReady] = useState(false);

  useEffect(() => {
    async function fetchRepoData() {
      // Github API get watchers, forks, stars
      const repoOwner = repoLink?.match("github.com/(.*?)/")[1];
      const repoName = repoLink?.match("github.com/.*?/(.+?)($|/)")[1];

      TEST_MODE && console.log("repo owner and name", repoOwner, repoName);

      // Fetch README.md
      const rawReadme = await fetchGitHubReadme(repoOwner, repoName);
      // If GitHub doesn't return raw readme, use the copy from the DB
      if (rawReadme !== "ERROR") {
        setRepoReadme(rawReadme);
        setRepoReadmeSource("github");
      } else {
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

      // Fetch repo metadata
      const repoMetadata = await fetchRepoMetadata(repoOwner, repoName);
      TEST_MODE && console.log("repo metadata", repoMetadata);
      if (repoMetadata !== "ERROR") {
        setWatchersCount(repoMetadata.watchers);
        setForksCount(repoMetadata.forks);
        setStarsCount(repoMetadata.stars);
        setRepoMetadataReady(true);
      }
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
      <Link href={repoLink} target="_blank" rel="noopener noreferrer">
        {repoLink}
      </Link>
      {repoMetadataReady && (
        <Stack spacing={2} direction="row">
          <Chip
            variant="outlined"
            size="md"
            startDecorator={<VisibilityIcon />}
          >
            Watch {NumberText(watchersCount)}
          </Chip>
          <Chip variant="outlined" size="md" startDecorator={<AltRouteIcon />}>
            Fork {NumberText(forksCount)}
          </Chip>
          <Chip variant="outlined" size="md" startDecorator={<StarIcon />}>
            Star {NumberText(starsCount)}
          </Chip>
        </Stack>
      )}
      <Typography
        id="repo-readme"
        level="title-md"
        fontWeight="lg"
        sx={{ pt: 2 }}
      >
        README.md
      </Typography>
      <Typography
        id="warning-relative-links"
        level="body-sm"
        color="warning"
        startDecorator={<WarningIcon />}
      >
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
      <Box
        component="div"
        sx={{
          p: 4,
          border: "0.5px solid #eaecee",
          backgroundColor: "#feffff",
          overflow: "auto",
          maxHeight: 1000,
        }}
      >
        <div className="container" data-color-mode="light">
          <Suspense fallback={<p>Loading content...</p>}>
            <MarkdownPreview
              source={repoReadme}
              style={{ backgroundColor: "#feffff" }}
            />
          </Suspense>
        </div>
      </Box>
    </Stack>
  );
}
