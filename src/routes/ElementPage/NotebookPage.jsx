import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

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
import NotebookViewer from "../../features/Element/NotebookViewer";
import RelatedElementsNetwork from "../../features/Element/RelatedElementsNetwork";
import usePageTitle from "../../hooks/usePageTitle";
import PageNav from "../../components/PageNav";
import ContributorOps from "../../features/Element/ContributorOps";
import PrivateElementBanner from "../../features/Element/PrivateElementBanner";

import ErrorPage from "../ErrorPage";

export default function NotebookPage() {
  const id = useParams().id;
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [contributor, setContributor] = useState([]);
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState([]);
  const [htmlNotebook, setHtmlNotebook] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [notebookFile, setNotebookFile] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [thumbnailImageCredit, setThumbnailImageCredit] = useState("");
  const [relatedElements, setRelatedElements] = useState([]);
  const [creationTime, setCreationTime] = useState();
  const [updateTime, setUpdateTime] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [pageParam, setPageParam] = useSearchParams();
  const isPrivateElement = pageParam.get("private-mode");

  useEffect(() => {
    async function fetchData() {
      const thisElement = isPrivateElement
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
      setRepoUrl(thisElement["notebook-repo"]);
      setNotebookFile(thisElement["notebook-file"]);
      setThumbnailImage(thisElement["thumbnail-image"]);
      setThumbnailImageCredit(thisElement["thumbnail-credit"]);
      setHtmlNotebook(thisElement["html-notebook"]);
      setRelatedElements(thisElement["related-elements"]);
      setCreationTime(thisElement["created-at"]);
      setUpdateTime(thisElement["updated-at"]);
      setIsLoading(false);
    }
    fetchData();
  }, [isPrivateElement, id]);

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
                  parentPages={[["All Notebooks", "/notebooks"]]}
                  currentPage="Notebook"
                  sx={{ px: { xs: 2, md: 4 } }}
                />
                <ContributorOps
                  title={title}
                  elementId={id}
                  contributorId={contributor.id}
                  afterDeleteRedirection="/notebooks"
                  isPrivateElement={isPrivateElement}
                />
              </Stack>
              <PrivateElementBanner isPrivateElement={isPrivateElement} />
              <MainContent
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

            {/* When the page is narrower than md */}
            <Grid xs={12}>
              <CapsuleList title="Tags" items={tags} />
              <NotebookViewer
                repoUrl={repoUrl}
                notebookFile={notebookFile}
                htmlNotebook={htmlNotebook}
              />
            </Grid>
            <Grid xs={12}>
              <RelatedElements relatedElements={relatedElements} />
            </Grid>
            <Grid xs={12}>
              <RelatedElementsNetwork elementId={id} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
