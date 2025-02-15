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
import OerExternalLinkList from "../../features/Element/OerExternalLinkList";
import RelatedElementsNetwork from "../../features/Element/RelatedElementsNetwork";
import usePageTitle from "../../hooks/usePageTitle";
import PageNav from "../../components/PageNav";
import ContributorOps from "../../features/Element/ContributorOps";
import PrivateElementBanner from "../../features/Element/PrivateElementBanner";
import LicenseAndFunding from "../../features/Element/LicenseAndFunding";
import CitationGenerator from "../../features/Element/CitationGenerator";

import ErrorPage from "../ErrorPage";

export default function OERPage() {
  const id = useParams().id;
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [contributor, setContributor] = useState([]);
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [thumbnailImageCredit, setThumbnailImageCredit] = useState("");
  const [relatedElements, setRelatedElements] = useState([]);
  const [oerExternalLinks, setOerExternalLinks] = useState([]);
  const [creationTime, setCreationTime] = useState();
  const [updateTime, setUpdateTime] = useState();
  const [licenseStatement, setLicenseStatement] = useState("");
  const [licenseUrl, setLicenseUrl] = useState("");
  const [fundingAgency, setFundingAgency] = useState("");

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
      setThumbnailImage(thisElement["thumbnail-image"]);
      setThumbnailImageCredit(thisElement["thumbnail-credit"]);
      setRelatedElements(thisElement["related-elements"]);
      setOerExternalLinks(thisElement["oer-external-links"]);
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
                  parentPages={[["All Educational Resources", "/oers"]]}
                  currentPage="Educational Resource"
                  sx={{ px: { xs: 2, md: 4 } }}
                />
                <ContributorOps
                  title={title}
                  elementId={id}
                  contributorId={contributor.id}
                  afterDeleteRedirection="/oers"
                  isPrivateElement={isPrivateElement}
                />
              </Stack>
              <PrivateElementBanner isPrivateElement={isPrivateElement} />
              <MainContent
                elementId={id}
                title={title}
                authors={authors}
                contributor={contributor}
                contents={abstract}
                thumbnailImage={thumbnailImage}
                thumbnailImageCredit={thumbnailImageCredit}
                elementType="oer"
                creationTime={creationTime}
                updateTime={updateTime}
                isLoading={isLoading}
                useMarkdown
                useOERLayout
              />
            </Grid>

            <Grid xs={12}>
              <CapsuleList title="Tags" items={tags} />
            </Grid>
            <Grid xs={12}>
              <OerExternalLinkList oerExternalLinks={oerExternalLinks} />
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
                elementType="oers"
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
