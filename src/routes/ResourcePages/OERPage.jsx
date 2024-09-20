import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";

import { fetchSingleElementDetails } from "../../utils/DataRetrieval";
import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";

import MainContent from "../../components/ResourcePagesComps/MainContent";
import CapsuleList from "../../components/ResourcePagesComps/CapsuleList";
import RelatedElements from "../../components/ResourcePagesComps/RelatedElements";
import OerExternalLinkList from "../../components/ResourcePagesComps/OerExternalLinkList";
import usePageTitle from "../../hooks/usePageTitle";
import PageNav from "../../components/PageNav";
import ContributorOps from "../../components/ResourcePagesComps/ContributorOps";
import ErrorPage from "../../ErrorPage";

export default function OERPage() {
  const id = useParams().id;
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [contributor, setContributor] = useState([]);
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState([]);
  const [relatedDatasets, setRelatedDatasets] = useState([]);
  const [relatedNotebooks, setRelatedNotebooks] = useState([]);
  const [relatedPublications, setRelatedPublicatons] = useState([]);
  const [relatedOERs, setRelatedOERs] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [oerExternalLinks, setOerExternalLinks] = useState([]);
  const [creationTime, setCreationTime] = useState();
  const [updateTime, setUpdateTime] = useState();

  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const thisElement = await fetchSingleElementDetails(id);

      if (thisElement === "ERROR") {
        setError(true);
        return;
      }

      setRelatedDatasets(thisElement["related-datasets"]);
      setRelatedNotebooks(thisElement["related-notebooks"]);
      setRelatedPublicatons(thisElement["related-publications"]);
      setRelatedOERs(thisElement["related-oers"]);
      setTitle(thisElement.title);
      setAuthors(thisElement.authors);
      setContributor(thisElement["contributor"]);
      setAbstract(thisElement.contents);
      setTags(thisElement.tags);
      setThumbnailImage(thisElement["thumbnail-image"]);
      setOerExternalLinks(thisElement["oer-external-links"]);
      setCreationTime(thisElement["created-at"]);
      setUpdateTime(thisElement["updated-at"]);
    }
    fetchData();
  }, [id]);

  usePageTitle(title);

  if (error) {
    return (
      <ErrorPage customStatus="404" customStatusText="Element Not Found" />
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
                />
              </Stack>
              <MainContent
                title={title}
                authors={authors}
                contributor={contributor}
                contents={abstract}
                thumbnailImage={thumbnailImage}
                elementType="oer"
                creationTime={creationTime}
                updateTime={updateTime}
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
            <RelatedElements
              relatedDatasets={relatedDatasets}
              relatedNotebooks={relatedNotebooks}
              relatedPublications={relatedPublications}
              relatedOERs={relatedOERs}
              xs={12}
              md={6}
            />
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
