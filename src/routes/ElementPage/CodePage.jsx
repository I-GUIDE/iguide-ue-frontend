import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useOutletContext } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";

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
import GitHubRepo from "../../features/Element/GitHubRepo";

import ErrorPage from "../ErrorPage";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function CodePage() {
  const id = useParams().id;
  const [title, setTitle] = useState();
  const [authors, setAuthors] = useState();
  const [contributor, setContributor] = useState();
  const [abstract, setAbstract] = useState();
  const [tags, setTags] = useState([]);
  const [repoLink, setRepoLink] = useState();
  const [repoReadme, setRepoReadme] = useState();
  const [thumbnailImage, setThumbnailImage] = useState();
  const [thumbnailImageCredit, setThumbnailImageCredit] = useState();
  const [relatedElements, setRelatedElements] = useState([]);
  const [creationTime, setCreationTime] = useState();
  const [updateTime, setUpdateTime] = useState();
  const [licenseStatement, setLicenseStatement] = useState();
  const [licenseUrl, setLicenseUrl] = useState();
  const [fundingAgency, setFundingAgency] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const { isAuthenticated, localUserInfo } = useOutletContext();
  const [pageParam, setPageParam] = useSearchParams();
  const isPrivateElement = pageParam.get("private-mode");

  useEffect(() => {
    async function fetchData() {
      const elementObject =
        isPrivateElement === "true"
          ? await fetchSinglePrivateElementDetails(id)
          : await fetchSingleElementDetails(id);

      if (!elementObject.ok) {
        setError(elementObject.body);
        TEST_MODE &&
          console.log(
            "Error from fetchSingle(Private)ElementDetails:",
            elementObject.body
          );
        return;
      }

      const thisElement = elementObject.body;
      TEST_MODE && console.log("Returned element", thisElement);

      setTitle(thisElement.title);
      setAuthors(thisElement.authors);
      setContributor(thisElement["contributor"]);
      setAbstract(thisElement.contents);
      setTags(thisElement.tags);
      setRepoLink(thisElement["github-repo-link"]);
      setRepoReadme(thisElement["github-repo-readme"]);
      setThumbnailImage(thisElement["thumbnail-image"]);
      setThumbnailImageCredit(thisElement["thumbnail-credit"]);
      setRelatedElements(thisElement["related-elements"]);
      setCreationTime(thisElement["created-at"]);
      setUpdateTime(thisElement["updated-at"]);
      setLicenseStatement(thisElement["license-statement"]);
      setLicenseUrl(thisElement["license-url"]);
      setFundingAgency(thisElement["funding-agency"]);
      setIsLoading(false);
    }
    fetchData();
  }, [isPrivateElement, id]);

  usePageTitle(title);

  if (error) {
    return (
      <ErrorPage
        customStatusText={error}
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
                  contributorId={contributor?.id}
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
                elementType="code"
                creationTime={creationTime}
                updateTime={updateTime}
                isLoading={isLoading}
              />
            </Grid>

            <Grid xs={12}>
              <GitHubRepo repoLink={repoLink} repoReadmeFromDB={repoReadme} />
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
                contributorId={contributor?.id}
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
