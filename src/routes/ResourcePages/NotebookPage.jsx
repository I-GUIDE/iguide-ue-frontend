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
import GoBackButton from "../../components/ResourcePagesComps/GoBackButton";
import NotebookViewer from "../../components/ResourcePagesComps/NotebookViewer";
import Header from "../../components/Layout/Header";
import usePageTitle from "../../hooks/usePageTitle";
import PageNav from "../../components/PageNav";

export default function NotebookPage() {
  const id = useParams().id;
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

  useEffect(() => {
    async function fetchData() {
      const thisElement = await fetchSingleElementDetails(id);

      setRelatedDatasets(thisElement["related-datasets"]);
      setRelatedPublicatons(thisElement["related-publications"]);
      setRelatedOERs(thisElement["related-oers"]);
      setTitle(thisElement.title);
      setAuthors(thisElement.authors);
      setContributors(thisElement["contributor-name"]);
      setAbstract(thisElement.contents);
      setTags(thisElement.tags);
      setRepoUrl(thisElement["notebook-repo"]);
      setNotebookFile(thisElement["notebook-file"]);
      setThumbnailImage(thisElement["thumbnail-image"]);
      setHtmlNotebook(thisElement["html-notebook"]);
    }
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
              pt: 4,
              pb: 8,
            }}
          >
            <Grid xs={12}>
              <PageNav
                parentPages={[["All Notebooks", "/notebooks"]]}
                currentPage="Notebook"
                sx={{ px: { xs: 2, md: 4 } }}
              />
              <MainContent
                title={title}
                authors={authors}
                contributors={contributors}
                contents={abstract}
                thumbnailImage={thumbnailImage}
                elementType="notebook"
              />
            </Grid>

            {/* When the page is narrower than md */}
            <Grid sx={{ display: { xs: "block", md: "none" } }} xs={12}>
              <CapsuleList title="Tags" items={tags} />
              <NotebookViewer
                repoUrl={repoUrl}
                notebookFile={notebookFile}
                htmlNotebook={htmlNotebook}
              />
              <RelatedElementsList
                title="Related Datasets"
                relatedElements={relatedDatasets}
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

            {/* When the page is wider than md */}
            <Grid sx={{ display: { xs: "none", md: "block" } }} md={5}>
              <CapsuleList title="Tags" items={tags} />
              <RelatedElementsList
                title="Related Datasets"
                relatedElements={relatedDatasets}
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
            <Grid sx={{ display: { xs: "none", md: "block" } }} md={7}>
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
