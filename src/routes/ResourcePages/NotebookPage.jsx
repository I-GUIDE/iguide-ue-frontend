import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";

import { fetchResourcesByField } from "../../utils/DataRetrieval";
import { DEFAULT_BODY_HEIGHT } from "../../configs/ResourceTypes";

import MainContent from "../../components/ResourcePagesComps/MainContent";
import CapsuleList from "../../components/ResourcePagesComps/CapsuleList";
import RelatedResourcesList from "../../components/ResourcePagesComps/RelatedResourcesList";
import GoBackButton from "../../components/ResourcePagesComps/GoBackButton";
import NotebookViewer from "../../components/ResourcePagesComps/NotebookViewer";
import Header from "../../components/Layout/Header";
import usePageTitle from "../../hooks/usePageTitle";

export default function NotebookPage() {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState([]);
  const [relatedDatasets, setRelatedDatasets] = useState([]);
  const [relatedPublications, setRelatedPublicatons] = useState([]);
  const [relatedOERs, setRelatedOERs] = useState([]);
  const [htmlNotebook, setHtmlNotebook] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [notebookFile, setNotebookFile] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const id = useParams().id;

  useEffect(() => {
    const fetchData = async () => {
      const thisResourceList = await fetchResourcesByField("_id", [id]);
      // Since the function returns an Array, we extract the content using idx 0
      const thisResource = thisResourceList[0];

      setRelatedDatasets(thisResource["related-datasets"]);
      setRelatedPublicatons(thisResource["related-publications"]);
      setRelatedOERs(thisResource["related-oers"]);
      setTitle(thisResource.title);
      setAuthors(thisResource.authors);
      setContributors(thisResource["contributor-name"]);
      setAbstract(thisResource.contents);
      setTags(thisResource.tags);
      setRepoUrl(thisResource["notebook-repo"]);
      setNotebookFile(thisResource["notebook-file"]);
      setThumbnailImage(thisResource["thumbnail-image"]);
      setHtmlNotebook(thisResource["html-notebook"]);
    };
    fetchData();
  }, [id]);

  usePageTitle(title);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header title="Notebooks" subtitle="Individual Notebook" />
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
              <MainContent
                title={title}
                authors={authors}
                contributors={contributors}
                contents={abstract}
                thumbnailImage={thumbnailImage}
                elementType="notebook"
              />
            </Grid>

            <Grid xs={12} md={4}>
              <CapsuleList title="Tags" items={tags} />
              <RelatedResourcesList
                title="Related Datasets"
                relatedResourcesIds={relatedDatasets}
                relatedResourceType="dataset"
              />
              <RelatedResourcesList
                title="Related Publications"
                relatedResourcesIds={relatedPublications}
                relatedResourceType="publication"
              />
              <RelatedResourcesList
                title="Related Educational Resources"
                relatedResourcesIds={relatedOERs}
                relatedResourceType="oer"
              />
            </Grid>
            <Grid xs={12} md={8}>
              <NotebookViewer
                repoUrl={repoUrl}
                notebookFile={notebookFile}
                htmlNotebook={htmlNotebook}
              />
            </Grid>
            <Grid xs={12}>
              <GoBackButton
                parentPage="/notebooks"
                parentPageName="Notebooks"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
