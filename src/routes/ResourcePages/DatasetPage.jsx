import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";

import { fetchSingleElementDetails } from "../../utils/DataRetrieval";
import { DEFAULT_BODY_HEIGHT } from "../../configs/VarConfigs";

import MainContent from "../../components/ResourcePagesComps/MainContent";
import CapsuleList from "../../components/ResourcePagesComps/CapsuleList";
import RelatedElementsList from "../../components/ResourcePagesComps/RelatedElementsList";
import CodeSnippet from "../../components/ResourcePagesComps/CodeSnippet";
import ActionList from "../../components/ResourcePagesComps/ActionsList";
import GoBackButton from "../../components/ResourcePagesComps/GoBackButton";
import Header from "../../components/Layout/Header";
import usePageTitle from "../../hooks/usePageTitle";
import PageNav from "../../components/PageNav";

export default function DatasetPage() {
  const id = useParams().id;
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState([]);
  const [relatedNotebooks, setRelatedNotebooks] = useState([]);
  const [relatedPublications, setRelatedPublicatons] = useState([]);
  const [relatedOERs, setRelatedOERs] = useState([]);
  const [externalLink, setExternalLink] = useState("");
  const [directDownloadLink, setDirectDownloadLink] = useState("");
  const [size, setSize] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const thisElement = await fetchSingleElementDetails(id);

      setRelatedNotebooks(thisElement["related-notebooks"]);
      setRelatedPublicatons(thisElement["related-publications"]);
      setRelatedOERs(thisElement["related-oers"]);
      setTitle(thisElement.title);
      setAuthors(thisElement.authors);
      setContributors(thisElement["contributor-name"]);
      setAbstract(thisElement.contents);
      setTags(thisElement.tags);
      setExternalLink(thisElement["external-link"]);
      setDirectDownloadLink(thisElement["direct-download-link"]);
      setSize(thisElement.size);
      setThumbnailImage(thisElement["thumbnail-image"]);
    }
    fetchData();
  }, [id]);

  usePageTitle(title);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header title="Dataset" subtitle="Individual Dataset" />
      <Container maxWidth="xl">
        <Box
          component="main"
          sx={{
            minHeight: DEFAULT_BODY_HEIGHT,
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
              py: 2,
            }}
          >
            <Grid xs={12}>
              <PageNav
                parentPages={[["All Datasets", "/datasets"]]}
                currentPage="Dataset"
                sx={{ px: { xs: 2, md: 4 } }}
              />
              <MainContent
                title={title}
                authors={authors}
                contributors={contributors}
                contents={abstract}
                thumbnailImage={thumbnailImage}
                elementType="dataset"
              />
            </Grid>

            <Grid xs={12} md={6}>
              <CapsuleList title="Tags" items={tags} />
              <ActionList
                title="Data Exploration"
                externalLink={externalLink}
                externalLinkText="Access Data Source"
                directDownloadLink={directDownloadLink}
                directDownloadLinkText="Download Data"
                size={size}
              />
              <CodeSnippet directDownloadLink={directDownloadLink} />
            </Grid>
            <Grid xs={12} md={6}>
              <RelatedElementsList
                title="Related Notebooks"
                relatedElements={relatedNotebooks}
              />
              <RelatedElementsList
                title="Related Publications"
                relatedElements={relatedPublications}
              />
              <RelatedElementsList
                title="Related Educational Resources"
                relatedElements={relatedOERs}
              />
            </Grid>

            <Grid xs={12}>
              <GoBackButton parentPage="/datasets" parentPageName="Datasets" />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
