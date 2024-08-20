import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";

import { fetchSingleElementDetails } from "../../utils/DataRetrieval";
import { DEFAULT_BODY_HEIGHT } from "../../configs/VarConfigs";

import MainContent from "../../components/ResourcePagesComps/MainContent";
import CapsuleList from "../../components/ResourcePagesComps/CapsuleList";
import RelatedElementsList from "../../components/ResourcePagesComps/RelatedElementsList";
import GoBackButton from "../../components/ResourcePagesComps/GoBackButton";
import OerExternalLinkList from "../../components/ResourcePagesComps/OerExternalLinkList";
import Header from "../../components/Layout/Header";
import usePageTitle from "../../hooks/usePageTitle";
import PageNav from "../../components/PageNav";
import ContributorOps from "../../components/ResourcePagesComps/ContributorOps";

export default function OERPage() {
  const id = useParams().id;
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [contributorId, setContributorId] = useState();
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState([]);
  const [relatedDatasets, setRelatedDatasets] = useState([]);
  const [relatedPublications, setRelatedPublicatons] = useState([]);
  const [relatedNotebooks, setRelatedNotebooks] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [oerExternalLinks, setOerExternalLinks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const thisElement = await fetchSingleElementDetails(id);

      setRelatedDatasets(thisElement["related-datasets"]);
      setRelatedPublicatons(thisElement["related-publications"]);
      setRelatedNotebooks(thisElement["related-notebooks"]);
      setTitle(thisElement.title);
      setAuthors(thisElement.authors);
      setContributors(thisElement["contributor-name"]);
      setContributorId(thisElement["contributor-id"]);
      setAbstract(thisElement.contents);
      setTags(thisElement.tags);
      setThumbnailImage(thisElement["thumbnail-image"]);
      setOerExternalLinks(thisElement["oer-external-links"]);
    }
    fetchData();
  }, [id]);

  usePageTitle(title);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header
        title="Educational Resources"
        subtitle="Individual Educational Resource"
        displayNewContributionButton={true}
      />
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
                  contributorId={contributorId}
                  afterDeleteRedirection="/oers"
                />
              </Stack>
              <MainContent
                title={title}
                authors={authors}
                contributors={contributors}
                contents={abstract}
                thumbnailImage={thumbnailImage}
                elementType="oer"
              />
            </Grid>

            <Grid xs={12} md={6}>
              <CapsuleList title="Tags" items={tags} />
              <OerExternalLinkList oerExternalLinks={oerExternalLinks} />
            </Grid>
            <Grid xs={12} md={6}>
              <RelatedElementsList
                title="Related Datasets"
                relatedElements={relatedDatasets}
              />
              <RelatedElementsList
                title="Related Publications"
                relatedElements={relatedPublications}
              />
              <RelatedElementsList
                title="Related Notebooks"
                relatedElements={relatedNotebooks}
              />
            </Grid>

            <Grid xs={12}>
              <GoBackButton
                parentPage="/oers"
                parentPageName="Educational Resources"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
