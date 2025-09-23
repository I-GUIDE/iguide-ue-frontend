import { useState, useEffect } from "react";
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
import {
  NO_HEADER_BODY_HEIGHT,
  PT_OFFSET,
  ELEMENT_TYPE_CAP_PLURAL,
  ELEMENT_TYPE_CAP,
  ELEMENT_TYPE_URI,
  ELEMENT_TYPE_URI_PLURAL,
} from "../../configs/VarConfigs";
import { inputExists } from "../../helpers/helper";

import MainContent from "../../features/Element/MainContent";
import CapsuleList from "../../features/Element/CapsuleList";
import RelatedElements from "../../features/Element/RelatedElements";
import RelatedElementsNetwork from "../../features/Element/RelatedElementsNetwork";
import usePageTitle from "../../hooks/usePageTitle";
import PageNav from "../../components/PageNav";
import ContributorOps from "../../features/Element/ContributorOps";
import InteractiveMap from "../../features/Element/InteractiveMap";
import PrivateElementBanner from "../../features/Element/PrivateElementBanner";
import LicenseAndFunding from "../../features/Element/LicenseAndFunding";

// Map elements
import MapViewer from "../../features/Element/MapViewer";
import StaticMap from "../../features/Element/StaticMap";
// Dataset elements
import CodeSnippet from "../../features/Element/CodeSnippet";
import ActionList from "../../features/Element/ActionsList";
// Notebook elements
import NotebookViewer from "../../features/Element/NotebookViewer";
// Publication elements
import DoiCitation from "../../features/Element/DoiCitation";
// OER elements
import OerExternalLinkList from "../../features/Element/OerExternalLinkList";
// Code elements
import GitHubRepo from "../../features/Element/GitHubRepo";

import ErrorPage from "../../routes/ErrorPage";
import { useMeta } from "../../meta/MetaContext";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ElementPageLayout(props) {
  const elementType = props.elementType;
  const elementTypeCap = ELEMENT_TYPE_CAP[elementType];
  const elementTypeCapPlural = ELEMENT_TYPE_CAP_PLURAL[elementType];
  const elementTypeURI = ELEMENT_TYPE_URI[elementType];
  const elementTypeURIPlural = ELEMENT_TYPE_URI_PLURAL[elementType];

  const id = useParams().id;
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [contributor, setContributor] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [thumbnailImageCredit, setThumbnailImageCredit] = useState("");
  const [abstract, setAbstract] = useState("");
  const [tags, setTags] = useState([]);

  // Map elements
  const [mapIFrameLink, setMapIFrameLink] = useState();
  // Dataset elements
  const [externalLink, setExternalLink] = useState("");
  const [directDownloadLink, setDirectDownloadLink] = useState("");
  const [size, setSize] = useState("");
  // Notebook elements
  const [htmlNotebook, setHtmlNotebook] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [notebookFile, setNotebookFile] = useState("");
  // Publication elements
  const [publicationLink, setPublicationLink] = useState("");
  // OER elements
  const [oerExternalLinks, setOerExternalLinks] = useState([]);
  // Code elements
  const [repoLink, setRepoLink] = useState();
  const [repoReadme, setRepoReadme] = useState();

  const [relatedElements, setRelatedElements] = useState([]);

  const [centroid, setCentroid] = useState();
  const [boundingBox, setBoundingBox] = useState();
  const [geometry, setGeometry] = useState();

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

  const { resetPageMeta, setPageMeta } = useMeta();

  useEffect(() => {
    async function fetchData() {
      const elementObject =
        isPrivateElement === "true"
          ? await fetchSinglePrivateElementDetails(id)
          : await fetchSingleElementDetails(id);

      if (!elementObject.ok) {
        setError(elementObject);
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

      // Map elements
      setMapIFrameLink(thisElement["external-iframe-link"]);
      // Dataset elements
      setExternalLink(thisElement["external-link"]);
      setDirectDownloadLink(thisElement["direct-download-link"]);
      setSize(thisElement.size);
      // Notebook elements
      setRepoUrl(thisElement["notebook-repo"]);
      setNotebookFile(thisElement["notebook-file"]);
      setHtmlNotebook(thisElement["html-notebook"]);
      // Publication elements
      setPublicationLink(thisElement["external-link-publication"]);
      // OER elements
      setOerExternalLinks(thisElement["oer-external-links"]);
      // Code elements
      setRepoLink(thisElement["github-repo-link"]);
      setRepoReadme(thisElement["github-repo-readme"]);

      setThumbnailImage(thisElement["thumbnail-image"]);
      setThumbnailImageCredit(thisElement["thumbnail-credit"]);
      setRelatedElements(thisElement["related-elements"]);

      setCentroid(thisElement["spatial-centroid"]);
      setBoundingBox(thisElement["spatial-bounding-box"]);
      setGeometry(thisElement["spatial-geometry"]);

      setCreationTime(thisElement["created-at"]);
      setUpdateTime(thisElement["updated-at"]);
      setLicenseStatement(thisElement["license-statement"]);
      setLicenseUrl(thisElement["license-url"]);
      setFundingAgency(thisElement["funding-agency"]);

      setIsLoading(false);

      setPageMeta((prev) => ({
        ...prev,
        title: thisElement.title,
        description: thisElement.contents,
        imageUrl: thisElement["thumbnail-image"]?.medium,
        url: window.location.href,
      }));
    }
    fetchData();

    // Reset pageMeta to default
    return function () {
      return resetPageMeta();
    };
  }, [isPrivateElement, id, setPageMeta, resetPageMeta]);

  usePageTitle(title);

  if (error) {
    return (
      <ErrorPage
        statusCode={error.statusCode}
        customStatusText={error.body}
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
              px: { xs: 1, md: 3, lg: 6 },
              pt: PT_OFFSET,
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
                  parentPages={[
                    [`All ${elementTypeCapPlural}`, `/${elementTypeURIPlural}`],
                  ]}
                  currentPage={elementTypeCap}
                  sx={{ px: 0 }}
                />
                <ContributorOps
                  title={title}
                  elementId={id}
                  contributorId={contributor?.id}
                  afterDeleteRedirection={`/${elementTypeURIPlural}`}
                  isPrivateElement={isPrivateElement}
                />
              </Stack>
              <PrivateElementBanner isPrivateElement={isPrivateElement} />
              <MainContent
                elementId={id}
                title={title}
                authors={authors}
                doi={publicationLink}
                contributor={contributor}
                contents={abstract}
                thumbnailImage={thumbnailImage}
                thumbnailImageCredit={thumbnailImageCredit}
                elementType={elementTypeURI}
                creationTime={creationTime}
                updateTime={updateTime}
                isLoading={isLoading}
                // This is used only by OER elements
                useMarkdown={elementTypeURI === "oer"}
                useOERLayout={elementTypeURI === "oer"}
              />
            </Grid>

            <Grid xs={12}>
              <CapsuleList items={tags} />
            </Grid>

            {/* Section for map elements */}
            {elementTypeURI === "map" && (
              <Grid xs={12}>
                {mapIFrameLink !== thumbnailImage.original && (
                  <MapViewer iframeSrc={mapIFrameLink} />
                )}
                <StaticMap mapImg={thumbnailImage} />
              </Grid>
            )}

            {/* Section for dataset elements */}
            {elementTypeURI === "dataset" && (
              <Grid xs={12}>
                {inputExists(directDownloadLink) && (
                  <CodeSnippet directDownloadLink={directDownloadLink} />
                )}
                <ActionList
                  title="Data Exploration"
                  externalLink={externalLink}
                  externalLinkText="Access Data Source"
                  directDownloadLink={directDownloadLink}
                  directDownloadLinkText="Download Data"
                  size={size}
                />
              </Grid>
            )}

            {/* Section for notebook elements */}
            {elementTypeURI === "notebook" && (
              <Grid xs={12}>
                <NotebookViewer
                  repoUrl={repoUrl}
                  notebookFile={notebookFile}
                  htmlNotebook={htmlNotebook}
                />
              </Grid>
            )}

            {/* Section for OER elements */}
            {elementTypeURI === "oer" && (
              <Grid xs={12}>
                <OerExternalLinkList oerExternalLinks={oerExternalLinks} />
              </Grid>
            )}

            {/* Section for code elements */}
            {elementTypeURI === "code" && (
              <Grid xs={12}>
                <GitHubRepo repoLink={repoLink} repoReadmeFromDB={repoReadme} />
              </Grid>
            )}

            <Grid xs={12}>
              <InteractiveMap
                centroid={centroid}
                geometry={geometry}
                boundingBox={boundingBox}
              />
            </Grid>
            <Grid xs={12}>
              <RelatedElements relatedElements={relatedElements} />
            </Grid>
            <Grid xs={12}>
              <RelatedElementsNetwork elementId={id} />
            </Grid>

            {/* Section for publication elements */}
            {elementTypeURI === "publication" && (
              <Grid xs={12}>
                <DoiCitation doi={publicationLink} />
              </Grid>
            )}

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
