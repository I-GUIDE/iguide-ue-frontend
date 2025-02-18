import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useOutletContext } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";

import AltRoute from "@mui/icons-material/AltRoute";
import Visibility from "@mui/icons-material/Visibility";
import Star from "@mui/icons-material/Star";

import {
  fetchSingleElementDetails,
  fetchSinglePrivateElementDetails,
} from "../../utils/DataRetrieval";
import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";

import MainContent from "../../features/Element/MainContent";
import CapsuleList from "../../features/Element/CapsuleList";
import RelatedElements from "../../features/Element/RelatedElements";
import RelatedElementsNetwork from "../../features/Element/RelatedElementsNetwork";
import usePageTitle from "../../hooks/usePageTitle";
import PageNav from "../../components/PageNav";
import ContributorOps from "../../features/Element/ContributorOps";
import PrivateElementBanner from "../../features/Element/PrivateElementBanner";
import LicenseAndFunding from "../../features/Element/LicenseAndFunding";
import CitationGenerator from "../../features/Element/CitationGenerator";

import ErrorPage from "../ErrorPage";
import { Octokit } from "octokit";

export default function CodePage() {
  const id = useParams().id;
  const [title, setTitle] = useState();
  const [authors, setAuthors] = useState();
  const [contributor, setContributor] = useState();
  const [abstract, setAbstract] = useState();
  const [tags, setTags] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState();
  const [thumbnailImageCredit, setThumbnailImageCredit] = useState();
  const [relatedElements, setRelatedElements] = useState([]);
  const [creationTime, setCreationTime] = useState();
  const [updateTime, setUpdateTime] = useState();
  const [licenseStatement, setLicenseStatement] = useState();
  const [licenseUrl, setLicenseUrl] = useState();
  const [fundingAgency, setFundingAgency] = useState();

  const [repoLink, setRepoLink] = useState();
  const [repoReadme, setRepoReadme] = useState();
  const [watchersCount, setWatchersCount] = useState();
  const [forksCount, setForksCount] = useState();
  const [starsCount, setStarsCount] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const { isAuthenticated, localUserInfo } = useOutletContext();
  const [pageParam, setPageParam] = useSearchParams();
  const isPrivateElement = pageParam.get("private-mode");

  useEffect(() => {
    async function fetchData() {
      const thisElement =
        isPrivateElement === "true"
          ? await fetchSinglePrivateElementDetails(id)
          : await fetchSingleElementDetails(id);

      if (thisElement === "ERROR") {
        setError(true);
        return;
      }

      setTitle(thisElement.title);
      setAuthors(thisElement.authors);
      setContributor(thisElement["contributor"]);
      setAbstract(thisElement.contents);
      setTags(thisElement.tags);
      setRepoLink(thisElement["github-repo-link"]);
      setThumbnailImage(thisElement["thumbnail-image"]);
      setThumbnailImageCredit(thisElement["thumbnail-credit"]);
      setRelatedElements(thisElement["related-elements"]);
      setCreationTime(thisElement["created-at"]);
      setUpdateTime(thisElement["updated-at"]);
      setLicenseStatement(thisElement["license-statement"]);
      setLicenseUrl(thisElement["license-url"]);
      setFundingAgency(thisElement["funding-agency"]);
      setIsLoading(false);

      // Github API get watchers, forks, stars
      const octokit = new Octokit();
      const repoOwner = repoLink.match("github.com/(.*?)/")[1];
      const repoName = repoLink.match("github.com/.*?/(.+?)($|/)")[1];

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
      console.log(readmeData);
      console.log(readmeData["data"]["html_url"]);
      setRepoReadme(readmeData["data"]["html_url"]);

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
    fetchData();
  }, [isPrivateElement, id, repoLink]);

  usePageTitle(title);

  if (error) {
    return (
      <ErrorPage
        customStatus="404"
        customStatusText="Element Not Found"
        isAuthenticated={isAuthenticated}
        localUserInfo={localUserInfo}
      />
    );
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          component="main"
          sx={{
            minHeight: NO_HEADER_BODY_HEIGHT,
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "100%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              backgroundColor: "inherit",
              px: { xs: 2, md: 4 },
              pt: 4,
              pb: 8,
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <PageNav
                  parentPages={[["All Code", "/code"]]}
                  currentPage="Code"
                  sx={{ px: { xs: 2, md: 4 } }}
                />
                <ContributorOps
                  title={title}
                  elementId={id}
                  contributorId={contributor.id}
                  afterDeleteRedirection="/code"
                  isPrivateElement={isPrivateElement}
                />
              </Stack>
              <PrivateElementBanner isPrivateElement={isPrivateElement} />
              <MainContent
                elementId={id}
                title={title}
                authors={authors}
                contributor={contributor}
                contentsTitle="About"
                contents={abstract}
                thumbnailImage={thumbnailImage}
                thumbnailImageCredit={thumbnailImageCredit}
                elementType="notebook"
                creationTime={creationTime}
                updateTime={updateTime}
                isLoading={isLoading}
              />
            </Grid>

            <Grid xs={12}>
              <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                <Typography id="repo-access" level="h5" fontWeight="lg" mb={1}>
                  Access Repository
                </Typography>
                <Divider inset="none" />
                <Link
                  href={"https://github.com/I-GUIDE/iguide-ue-frontend"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {"https://github.com/I-GUIDE/iguide-ue-frontend"}
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
              </Stack>

              <iframe
                src={repoReadme}
                frame-ancestors="self"
                width="75%"
                height="500px"
              ></iframe>
            </Grid>

            {/* When the page is narrower than md */}
            <Grid xs={12}>
              <CapsuleList title="Tags" items={tags} />
            </Grid>
            <Grid xs={12}>
              <RelatedElements relatedElements={relatedElements} />
            </Grid>
            <Grid xs={12}>
              <RelatedElementsNetwork elementId={id} />
            </Grid>

            <Grid xs={12}>
              <CitationGenerator
                contributorId={contributor.id}
                createdAt={creationTime}
                title={title}
                elementType="code"
                elementId={id}
              />
            </Grid>

            <Grid xs={12}>
              <LicenseAndFunding
                licenseStatement={licenseStatement}
                licenseUrl={licenseUrl}
                fundingAgency={fundingAgency}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
