import { useState, useEffect, lazy, Suspense } from "react";

import { useOutletContext, Link as RouterLink } from "react-router";

import Grid from "@mui/material/Grid2";
import Card from "@mui/joy/Card";
import AspectRatio from "@mui/joy/AspectRatio";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import { styled } from "@mui/joy/styles";
import Link from "@mui/joy/Link";
import Table from "@mui/joy/Table";
import Autocomplete from "@mui/joy/Autocomplete";
import IconButton from "@mui/joy/IconButton";
import FormHelperText from "@mui/joy/FormHelperText";
import Textarea from "@mui/joy/Textarea";
import Stack from "@mui/joy/Stack";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import SubmissionStatusCard from "../ElementSubmission/SubmissionStatusCard";
const HTMLEditor = lazy(() => import("../../components/HTMLEditor"));
import SubmissionCardFieldTitle from "../ElementSubmission/SubmissionCardFieldTitle";
import CapsuleInput from "../../components/CapsuleInput";
import LoadingCard from "../../components/Layout/LoadingCard";
import SpatialMetadataInfoCard from "./SpatialMetadataInfoCard";

import { fetchWithAuth } from "../../utils/FetcherWithJWT";
import { checkTokens } from "../../utils/UserManager";
import { PERMISSIONS } from "../../configs/Permissions";

import {
  fetchGitHubReadme,
  fetchRepoMetadata,
  verifyFileOnGitHub,
} from "../../utils/GitHubFetchMethods";
import { useAlertModal } from "../../utils/AlertModalProvider";

import ErrorPage from "../../routes/ErrorPage";

import {
  RESOURCE_TYPE_NAMES,
  RESOURCE_TYPE_NAMES_PLURAL_FOR_URI,
  OER_EXTERNAL_LINK_TYPES,
  IMAGE_SIZE_LIMIT,
  ELEM_VISIBILITY,
  ACCEPTED_IMAGE_TYPES,
} from "../../configs/VarConfigs";

import {
  ELEMENT_LICENSES,
  ELEMENT_LICENSES_INFO,
} from "../../configs/ElementLicenses";

import {
  fetchSingleElementDetails,
  fetchAllTitlesByElementType,
  checkDuplicate,
  fetchSinglePrivateElementDetails,
} from "../../utils/DataRetrieval";
import {
  printListWithDelimiter,
  isValidNumberWithinRange,
} from "../../helpers/helper";

import {
  getSpatialMetadata,
  getPublicationMetadata,
} from "../../utils/ExternalDataRetrieval";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

// Demo user setting
const USE_DEMO_USER = import.meta.env.VITE_USE_DEMO_USER === "true";
const DEMO_USER_ROLE = parseInt(import.meta.env.VITE_DEMO_USER_ROLE);

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function SubmissionCard(props) {
  const { localUserInfo, isAuthenticated } = useOutletContext();

  const submissionType = props.submissionType;
  const elementId = props.elementId;
  const elementType = props.elementType;
  const isPrivateElement = props.isPrivateElement;

  const [userRoleFromJWT, setUserRoleFromJWT] = useState(
    PERMISSIONS["secure_default_role"]
  );

  const [resourceTypeSelected, setResourceTypeSelected] = useState("");

  const [visibility, setVisibility] = useState("");

  const [thumbnailImageFile, setThumbnailImageFile] = useState("");
  const [thumbnailImageFileURLs, setThumbnailImageFileURLs] = useState();
  const [thumbnailImageCredit, setThumbnailImageCredit] = useState("");

  const [relatedResources, setRelatedResources] = useState([]);
  const [returnedRelatedResourceTitle, setReturnedRelatedResourceTitle] =
    useState([]);
  const relatedResourceDropdownLoading =
    returnedRelatedResourceTitle.length === 0;
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentRelatedResourceTitle, setCurrentRelatedResourceTitle] =
    useState("");
  const [currentRelatedResourceType, setCurrentRelatedResourceType] =
    useState("");

  const [oerExternalLinks, setOerExternalLinks] = useState([]);
  const [currentOerExternalLinkType, setCurrentOerExternalLinkType] =
    useState("");
  const [currentOerExternalLinkURL, setCurrentOerExternalLinkURL] =
    useState("");
  const [currentOerExternalLinkTitle, setCurrentOerExternalLinkTitle] =
    useState("");

  const [submissionStatus, setSubmissionStatus] = useState("no-submission");
  const [submissionStatusText, setSubmissionStatusText] = useState("");
  const [extraComponent, setExtraComponent] = useState();

  const [elementURI, setElementURI] = useState("");

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [authors, setAuthors] = useState("");
  const [contents, setContents] = useState("");

  const [datasetExternalLink, setDatasetExternalLink] = useState("");
  const [datasetExternalLinkError, setDatasetExternalLinkError] =
    useState(false);
  const [
    elementIdWithDuplicateDatasetExternalLink,
    setElementIdWithDuplicateDatasetExternalLink,
  ] = useState("");
  const [directDownloadLink, setDirectDownloadLink] = useState("");
  const [directDownloadLinkError, setDirectDownloadLinkError] = useState(false);
  const [dataSize, setDataSize] = useState("");

  const [notebookFile, setNotebookFile] = useState("");
  const [notebookRepo, setNotebookRepo] = useState("");
  const [notebookGitHubUrl, setNotebookGitHubUrl] = useState("");
  const [notebookGitHubUrlError, setNotebookGitHubUrlError] = useState(false);

  const [publicationDOI, setPublicationDOI] = useState("");
  const [
    publicationMetadataAutofillLoading,
    setPublicationMetadataAutofillLoading,
  ] = useState(false);
  const [elementIdWithDuplicateDOI, setElementIdWithDuplicateDOI] =
    useState("");
  const [doiLinkError, setDoiLinkError] = useState(false);
  const [doiLinkType, setDoiLinkType] = useState("");

  const [mapIframeLink, setMapIframeLink] = useState("");

  const [gitHubRepoLink, setGitHubRepoLink] = useState("");
  const [gitHubRepoLinkError, setGitHubRepoLinkError] = useState(false);
  const [
    elementIdWithDuplicateGitHubRepoLink,
    setElementIdWithDuplicateGitHubRepoLink,
  ] = useState("");

  const [contributor, setContributor] = useState([]);

  const [spatialMetadataList, setSpatialMetadataList] = useState([]);
  const [selectedSpatialMetadataIndex, setSelectedSpatialMetadataIndex] =
    useState(-1);
  const [spatialMetadataAutofillLoading, setSpatialMetadataAutofillLoading] =
    useState(false);
  const [spatialDescription, setSpatialDescription] = useState("");
  const [spatialCoverage, setSpatialCoverage] = useState([]);
  const [geometry, setGeometry] = useState("");
  const [boundingBox, setBoundingBox] = useState("");
  const [boundingBoxError, setBoundingBoxError] = useState({
    status: false,
    message: "",
  });
  const [centroid, setCentroid] = useState("");
  const [centroidError, setCentroidError] = useState({
    status: false,
    message: "",
  });
  const [isGeoreferenced, setIsGeoreferenced] = useState("");
  const [temporalCoverage, setTemporalCoverage] = useState([]);
  const [indexYears, setIndexYears] = useState([]);

  const [licenseId, setLicenseId] = useState("");
  const [licenseName, setLicenseName] = useState("");
  const [licenseStatement, setLicenseStatement] = useState("");
  const [licenseUrl, setLicenseUrl] = useState("");
  const [fundingAgency, setFundingAgency] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const alertModal = useAlertModal();

  useEffect(() => {
    const checkJWTToken = async () => {
      // If demo user is in use, skip verifying with JWT...
      if (USE_DEMO_USER) {
        setUserRoleFromJWT(parseInt(DEMO_USER_ROLE));
      } else {
        const userInfoFromToken = await checkTokens();
        TEST_MODE && console.log("Check token returns", userInfoFromToken);
        setUserRoleFromJWT(userInfoFromToken.role);
      }
      setLoading(false);
    };
    checkJWTToken();
  }, []);

  // If the submission type is 'update', load the existing element information.
  useEffect(() => {
    function parseGeometry(coords) {
      if (!Array.isArray(coords) || coords.length === 0) {
        return "";
      }

      const polygonParts = coords.map((ring) => {
        if (!Array.isArray(ring)) throw new Error("Each ring must be an array");
        return ring.map((point) => point.join(" ")).join(", ");
      });

      return `POLYGON((${polygonParts.join("),(")}))`;
    }

    function parseBoundingBox(coords) {
      if (!Array.isArray(coords) || coords.length === 0) {
        return "";
      }

      const west = coords[0][2][1];
      const east = coords[0][0][1];
      const south = coords[0][0][0];
      const north = coords[0][1][0];

      return `${west},${east},${south},${north}`;
    }

    function parseCentroid(coords) {
      if (!Array.isArray(coords) || coords.length === 0) {
        return "";
      }

      const lon = coords[1];
      const lat = coords[0];

      return `${lon} ${lat}`;
    }

    const fetchData = async () => {
      const elementObject =
        isPrivateElement === true || isPrivateElement === "true"
          ? await fetchSinglePrivateElementDetails(elementId)
          : await fetchSingleElementDetails(elementId);

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

      const elementUrlReturned = `/${
        RESOURCE_TYPE_NAMES_PLURAL_FOR_URI[thisElement["resource-type"]]
      }/${elementId}${
        thisElement.visibility === ELEM_VISIBILITY.private
          ? "?private-mode=true"
          : ""
      }`;
      setElementURI(elementUrlReturned);
      setVisibility(thisElement.visibility);
      setTitle(thisElement.title);
      setResourceTypeSelected(thisElement["resource-type"]);
      setTags(
        Array.isArray(thisElement.tags)
          ? thisElement.tags.join(", ")
          : thisElement.tags
      );
      setAuthors(
        Array.isArray(thisElement.authors)
          ? thisElement.authors.join(", ")
          : thisElement.authors
      );
      setContents(thisElement.contents);
      setThumbnailImageFileURLs(thisElement["thumbnail-image"]);

      setDatasetExternalLink(thisElement["external-link"]);
      setDirectDownloadLink(thisElement["direct-download-link"]);
      setDataSize(thisElement.dataSize);

      setNotebookGitHubUrl(
        thisElement["notebook-repo"] +
          "/blob/main/" +
          thisElement["notebook-file"]
      );

      setNotebookFile(thisElement["notebook-file"]);
      setNotebookRepo(thisElement["notebook-repo"]);

      setPublicationDOI(thisElement["external-link-publication"]);

      setMapIframeLink(thisElement["external-iframe-link"]);

      setGitHubRepoLink(thisElement["github-repo-link"]);

      setContributor(thisElement["contributor"]);

      setSpatialCoverage(thisElement["spatial-coverage"] || []);
      setGeometry(parseGeometry(thisElement["spatial-geometry"]?.coordinates));
      setBoundingBox(
        parseBoundingBox(thisElement["spatial-bounding-box"]?.coordinates)
      );
      setCentroid(parseCentroid(thisElement["spatial-centroid"]?.coordinates));
      setIsGeoreferenced(thisElement["spatial-georeferenced"]);
      setTemporalCoverage(thisElement["spatial-temporal-coverage"] || []);
      setIndexYears(
        Array.isArray(thisElement["spatial-index-year"])
          ? thisElement["spatial-index-year"].join(", ")
          : thisElement["spatial-index-year"]
      );

      setLicenseId(thisElement["license-id"]);
      setLicenseName(thisElement["license-name"]);
      setLicenseStatement(thisElement["license-statement"]);
      setLicenseUrl(thisElement["license-url"]);
      setFundingAgency(thisElement["funding-agency"]);

      setRelatedResources(thisElement["related-elements"]);
      setOerExternalLinks(thisElement["oer-external-links"]);
    };
    if (submissionType === "update") {
      fetchData();
    }
  }, [isPrivateElement, elementId, submissionType]);

  useEffect(() => {
    if (submissionType === "initial") {
      setResourceTypeSelected(elementType);
      setVisibility(ELEM_VISIBILITY.public);
    }
  }, [elementType, submissionType]);

  // When the current related element type changes, fetch a list of titles under that type.
  useEffect(() => {
    const getAllTitlesByElementType = async (resourceType) => {
      if (resourceType && resourceType !== "") {
        const returnedTitles = await fetchAllTitlesByElementType(resourceType);
        // Check duplicate titles, otherwise AutoComplete might fail...
        const returnedTitlesUnique = [...new Set(returnedTitles)];
        setReturnedRelatedResourceTitle(returnedTitlesUnique);
      } else {
        setReturnedRelatedResourceTitle([]);
      }
    };
    getAllTitlesByElementType(currentRelatedResourceType);
  }, [currentRelatedResourceType]);

  // For autofilling the selected metadata
  useEffect(() => {
    if (selectedSpatialMetadataIndex !== -1) {
      const selectedSpatialMetadata =
        spatialMetadataList[selectedSpatialMetadataIndex];
      setSpatialCoverage(selectedSpatialMetadata.display_name);
      setGeometry(selectedSpatialMetadata.geotext);
      const boundingBox = selectedSpatialMetadata.boundingbox;
      if (boundingBox && boundingBox.length === 4) {
        const minLat = boundingBox[0];
        const maxLat = boundingBox[1];
        const minLon = boundingBox[2];
        const maxLon = boundingBox[3];
        setBoundingBox(`${minLon},${maxLon},${minLat},${maxLat}`);
      }
      setCentroid(
        `${selectedSpatialMetadata.lon} ${selectedSpatialMetadata.lat}`
      );
    }
  }, [selectedSpatialMetadataIndex, spatialMetadataList]);

  async function handleVisibilityChange(e, newValue) {
    if (newValue) {
      TEST_MODE && console.log("Setting visibility to", newValue);
      setVisibility(newValue);
    }
  }

  async function handleThumbnailImageUpload(event) {
    const thumbnailFile = event.target.files[0];
    if (!thumbnailFile.type.startsWith("image/")) {
      await alertModal(
        "Failed to upload thumbnail",
        "The file you provided is not an image. Please upload an image."
      );
      // Clear the file
      event.target.value = "";
      setThumbnailImageFile(null);
      setThumbnailImageFileURLs(null);
      return null;
    }
    if (thumbnailFile.size > IMAGE_SIZE_LIMIT) {
      await alertModal(
        "Failed to upload thumbnail",
        "The file you provided is too large. Please upload an image smaller than 5MB."
      );
      // Clear the file
      event.target.value = "";
      setThumbnailImageFile(null);
      setThumbnailImageFileURLs(null);
      return null;
    }
    setThumbnailImageFile(thumbnailFile);
    setThumbnailImageFileURLs(URL.createObjectURL(thumbnailFile));
  }

  // Related elements...
  function handleRemovingOneRelatedResource(idx) {
    const newArray = [...relatedResources];
    newArray.splice(idx, 1);
    setRelatedResources(newArray);
    TEST_MODE && console.log("Removing one, now: ", relatedResources, idx);
  }

  function handleRelatedResourceTypeChange(value) {
    setCurrentRelatedResourceType(value);
  }

  function handleRelatedResourceTitleChange(value) {
    setCurrentRelatedResourceTitle(value);
    setRelatedResources([
      ...relatedResources,
      { "resource-type": currentRelatedResourceType, title: value },
    ]);
    setCurrentRelatedResourceType("");
    setCurrentRelatedResourceTitle("");
    setCurrentSearchTerm("");
  }

  function handleRelatedResourceTitleInputChange(value) {
    setCurrentSearchTerm(value);
  }

  // OER external links...
  async function handleAddingOneOerExternalLink() {
    if (!currentOerExternalLinkType || currentOerExternalLinkType === "") {
      await alertModal(
        "External link error",
        "Please select an external link type."
      );
      return;
    }
    if (!currentOerExternalLinkURL || currentOerExternalLinkURL === "") {
      await alertModal("External link error", "Please enter a URL.");
      return;
    }
    if (!currentOerExternalLinkTitle || currentOerExternalLinkTitle === "") {
      await alertModal(
        "External link error",
        'Please enter a link title, or click "->" to fetch the title of the provided URL.'
      );
      return;
    }
    setOerExternalLinks([
      ...oerExternalLinks,
      {
        type: currentOerExternalLinkType,
        url: currentOerExternalLinkURL,
        title: currentOerExternalLinkTitle,
      },
    ]);
    setCurrentOerExternalLinkType("");
    setCurrentOerExternalLinkURL("");
    setCurrentOerExternalLinkTitle("");
    TEST_MODE && console.log("Added one, now: ", oerExternalLinks);
  }

  function handleRemovingOneOerExternalLink(idx) {
    const newArray = [...oerExternalLinks];
    newArray.splice(idx, 1);
    setOerExternalLinks(newArray);
    TEST_MODE && console.log("Removing one, now: ", oerExternalLinks);
  }

  function handleOerExternalLinkTypeChange(value) {
    setCurrentOerExternalLinkType(value);
  }

  async function handleOerExternalLinkSearchTitle() {
    const url = currentOerExternalLinkURL;

    if (url) {
      const response = await fetch(
        `${USER_BACKEND_URL}/api/url-title/?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        await alertModal(
          "External link error",
          "Retrieving URL title failed. Please manually input the title."
        );
        return;
      }
      const data = await response.json();
      TEST_MODE && console.log("search return", data.title);
      setCurrentOerExternalLinkTitle(data.title);
    }
  }

  async function handleDOIChange(event) {
    const val = event.target.value;
    setPublicationDOI(val);

    if (!val) {
      // Reset duplicate and format checks
      setElementIdWithDuplicateDOI("");
      setDoiLinkError(false);
      setDoiLinkType("");
      return;
    }

    // Format check
    const validDOI = new RegExp("^10\\.\\d{4,9}/[-._;()/:A-Z0-9]+$", "i");
    const validDOIURL = new RegExp(
      "^https://doi.org/10\\.\\d{4,9}/[-._;()/:A-Z0-9]+$",
      "i"
    );
    const validURL = new RegExp(
      "^(https?|ftp):\\/\\/(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(?:\\/[^\\s]*)?$"
    );

    if (validDOI.test(val) || validDOIURL.test(val)) {
      setDoiLinkType("DOI");
      setDoiLinkError(false);
    } else if (validURL.test(val)) {
      setDoiLinkType("URL");
      setDoiLinkError(false);
    } else {
      setDoiLinkType("");
      setDoiLinkError(true);
    }

    // Verify duplication of DOI links
    const doiVerification = await checkDuplicate("doi", val);
    if (
      doiVerification &&
      doiVerification.duplicate &&
      doiVerification.elementId !== elementId
    ) {
      setElementIdWithDuplicateDOI(doiVerification.elementId);
    } else {
      setElementIdWithDuplicateDOI("");
    }
  }

  async function handleAutofillPublicationInfo() {
    if (!publicationDOI || publicationDOI === "") {
      await alertModal(
        "Publication metadata autofill error",
        "Please enter the DOI first."
      );
      return;
    }

    setPublicationMetadataAutofillLoading(true);
    const metadataDOI = await getPublicationMetadata(publicationDOI);
    setPublicationMetadataAutofillLoading(false);
    TEST_MODE && console.log("pub metadata", metadataDOI);

    if (!metadataDOI || metadataDOI === "") {
      return;
    }

    // If we couldn't fetch the metadata via Crossref, do this...
    if (metadataDOI === "Publication not found") {
      await alertModal(
        "Publication not found on Crossref",
        "We couldn't fetch the metadata. It may not be valid or registered with Crossref. Please enter the publication details manually. Thanks!"
      );
      return;
    }

    const authorList = metadataDOI["author"];
    const authorNameList = [];

    for (const idx in authorList) {
      let authorName = "";

      // Case when it's an organization, aka no first and last name
      if (!authorList[idx].given && !authorList[idx].family) {
        if (authorList[idx].name) {
          authorName = authorList[idx].name;
        } // If there is no name included... pass
      } else if (!authorList[idx].given) {
        authorName = authorList[idx].family;
      } else if (!authorList[idx].family) {
        authorName = authorList[idx].given;
      } else {
        authorName = authorList[idx].given + " " + authorList[idx].family;
      }
      authorNameList.push(authorName);
    }

    setAuthors(printListWithDelimiter(authorNameList, ","));
    setTitle(metadataDOI["title"]);
    setContents(metadataDOI["abstract"]);
  }

  async function handleDatasetExternalLinkChange(event) {
    const val = event.target.value;
    setDatasetExternalLink(val);

    // Validate if the URL format is correct
    const validURL = new RegExp(
      "^(https?|ftp):\\/\\/(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(?:\\/[^\\s]*)?$"
    );
    if (val === "" || validURL.test(val)) {
      setDatasetExternalLinkError(false);
    } else {
      setDatasetExternalLinkError(true);
    }

    // If no value, do not validate duplicate
    if (!val) {
      return;
    }
    // Verify duplication of dataset external links
    const datasetLinkVerification = await checkDuplicate("dataset-link", val);
    if (
      datasetLinkVerification &&
      datasetLinkVerification.duplicate &&
      datasetLinkVerification.elementId !== elementId
    ) {
      setElementIdWithDuplicateDatasetExternalLink(
        datasetLinkVerification.elementId
      );
    } else {
      setElementIdWithDuplicateDatasetExternalLink("");
    }
  }

  async function handleDirectDownloadLinkChange(event) {
    const val = event.target.value;
    setDirectDownloadLink(val);

    // Validate if the URL format is correct
    const validURL = new RegExp(
      "^(https?|ftp):\\/\\/(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(?:\\/[^\\s]*)?$"
    );
    if (val === "" || validURL.test(val)) {
      setDirectDownloadLinkError(false);
    } else {
      setDirectDownloadLinkError(true);
    }
  }

  function handleNotebookGitHubUrlChange(event) {
    const val = event.target.value;
    setNotebookGitHubUrl(val);

    // Validate if the URL is in the form of https://github.com/{repo}/blob/{branch}/{filename}.ipynb
    const validNotebookGitHubUrl = new RegExp(
      "https://(www.)?github.com/([a-zA-Z0-9._-]+)/([a-zA-Z0-9._-]+)/blob/(master|main)/([^/]+).ipynb$"
    );
    if (val === "" || validNotebookGitHubUrl.test(val)) {
      setNotebookGitHubUrlError(false);
    } else {
      setNotebookGitHubUrlError(true);
    }
  }

  async function handleRepoLinkChange(event) {
    const val = event.target.value;
    setGitHubRepoLink(val);

    if (!val) {
      return;
    }

    // Verify duplication of GitHub repo links
    const gitHubRepoLinkVerification = await checkDuplicate(
      "github-repo-link",
      val
    );
    if (
      gitHubRepoLinkVerification &&
      gitHubRepoLinkVerification.duplicate &&
      gitHubRepoLinkVerification.elementId !== elementId
    ) {
      setElementIdWithDuplicateGitHubRepoLink(
        gitHubRepoLinkVerification.elementId
      );
    } else {
      setElementIdWithDuplicateGitHubRepoLink("");
    }

    // Validate if the URL is in the form of https://github.com/{owner}/{repo}
    const validGitHubRepoUrl = new RegExp(
      "https://(www.)?github.com/([a-zA-Z0-9._-]+)/([a-zA-Z0-9._-]+)/?$"
    );
    if (val === "" || validGitHubRepoUrl.test(val)) {
      setGitHubRepoLinkError(false);
    } else {
      setGitHubRepoLinkError(true);
    }
  }

  // Autofill spatial metadata
  async function handleAutofillSpatialMetadata() {
    setSelectedSpatialMetadataIndex(-1);
    setSpatialMetadataList([]);
    if (!spatialDescription || spatialDescription === "") {
      await alertModal(
        "Spatial metadata autofill error",
        "Please enter the spatial metadata first."
      );
      return;
    }

    setSpatialMetadataAutofillLoading(true);
    const returnedList = await getSpatialMetadata(spatialDescription);
    setSpatialMetadataAutofillLoading(false);

    if (returnedList === "ERROR") {
      await alertModal(
        "Spatial metadata autofill error",
        "The Nominatim API is not available at this moment. Please try again later or manually enter the spatial metadata."
      );
      return;
    }

    if (!returnedList || returnedList.length === 0) {
      await alertModal(
        "Spatial metadata autofill error",
        "The Nominatim API didn't return any spatial metadata. Please check the input or manually enter the spatial information in the fields below."
      );
      return;
    }
    setSpatialMetadataList(returnedList);
  }

  // Validate the format of the bounding box input
  function handleBoundingBoxChange(event) {
    const val = event.target.value;
    setBoundingBox(val);

    if (!val) {
      setBoundingBoxError({ status: false, message: "" });
      return;
    }

    const array = val.split(",");
    TEST_MODE && console.log("Bounding box", array);

    if (array.length !== 4) {
      setBoundingBoxError({
        status: true,
        message: "It must consist of 4 numbers",
      });
    } else if (!isValidNumberWithinRange(array[0], -180, 180)) {
      setBoundingBoxError({
        status: true,
        message: "The first number must be between -180 and 180",
      });
    } else if (!isValidNumberWithinRange(array[1], -180, 180)) {
      setBoundingBoxError({
        status: true,
        message: "The second number must be between -180 and 180",
      });
    } else if (!isValidNumberWithinRange(array[2], -90, 90)) {
      setBoundingBoxError({
        status: true,
        message: "The third number must be between -90 and 90",
      });
    } else if (!isValidNumberWithinRange(array[3], -90, 90)) {
      setBoundingBoxError({
        status: true,
        message: "The fouth number must be between -90 and 90",
      });
    } else {
      setBoundingBoxError({ status: false, message: "" });
    }
  }

  // Validate the format of the centroid input
  function handleCentroidChange(event) {
    const val = event.target.value;
    setCentroid(val);

    if (!val) {
      setCentroidError({ status: false, message: "" });
      return;
    }

    const array = val.split(" ");
    TEST_MODE && console.log("Centroid", array);

    if (array.length !== 2) {
      setCentroidError({
        status: true,
        message: "It must consist of 2 numbers",
      });
    } else if (!isValidNumberWithinRange(array[0], -180, 180)) {
      setCentroidError({
        status: true,
        message: "The first number must be between -180 and 180",
      });
    } else if (!isValidNumberWithinRange(array[1], -90, 90)) {
      setCentroidError({
        status: true,
        message: "The second number must be between -90 and 90",
      });
    } else {
      setCentroidError({ status: false, message: "" });
    }
  }

  function handleLicenseChange(value) {
    setLicenseId(value);

    if (value === "other") {
      setLicenseName("Other");
      setLicenseStatement("");
      setLicenseUrl("");
    }

    // Case when the license is not from the dropdown selection
    else if (!ELEMENT_LICENSES_INFO[value]) {
      setLicenseName("");
      setLicenseStatement("");
      setLicenseUrl("");
    } else {
      setLicenseName(ELEMENT_LICENSES_INFO[value][0]);
      setLicenseStatement(
        `This element is shared under the ${ELEMENT_LICENSES_INFO[value][0]}.`
      );
      setLicenseUrl(ELEMENT_LICENSES_INFO[value][1]);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {};

    // Disable the submission button, preventing accidental multiple submissions
    setButtonDisabled(true);

    // When the user forgets to save the new related element, app will ask the user to submit it.
    // 02/27/2025: This case has been prevented through a code update.
    if (currentRelatedResourceTitle && currentRelatedResourceTitle !== "") {
      await alertModal(
        "Related element error",
        'You have an unsaved related element. Please click the "+" button to save the related element before submitting your contribution!'
      );
      setButtonDisabled(false);
      return;
    }

    // When the user forgets to save the new educational element link, app will ask the user to submit it
    if (
      (currentOerExternalLinkURL && currentOerExternalLinkURL !== "") ||
      (currentOerExternalLinkTitle && currentOerExternalLinkTitle !== "")
    ) {
      setOpenModal(true);
      setSubmissionStatus("error-unsaved-oer-link");
      setButtonDisabled(false);
      return;
    }

    // Other form input errors
    if (elementIdWithDuplicateGitHubRepoLink) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the duplicate GitHub repository link."
      );
      setButtonDisabled(false);
      return;
    }

    if (elementIdWithDuplicateDOI) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the duplicate DOI/URL link."
      );
      setButtonDisabled(false);
      return;
    }

    if (elementIdWithDuplicateDatasetExternalLink) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the duplicate dataset host link."
      );
      setButtonDisabled(false);
      return;
    }

    if (datasetExternalLinkError) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the invalid dataset host link."
      );
      setButtonDisabled(false);
      return;
    }
    if (directDownloadLinkError) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the invalid dataset direct download link."
      );
      setButtonDisabled(false);
      return;
    }

    if (notebookGitHubUrlError) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the invalid GitHub notebook URL."
      );
      setButtonDisabled(false);
      return;
    }

    if (doiLinkError) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the invalid DOI or URL of the publication."
      );
      setButtonDisabled(false);
      return;
    }

    if (gitHubRepoLinkError) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the invalid GitHub repository link."
      );
      setButtonDisabled(false);
      return;
    }

    if (boundingBoxError.status) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the invalid bounding box format."
      );
      setButtonDisabled(false);
      return;
    }

    if (centroidError.status) {
      setOpenModal(true);
      setSubmissionStatus("error-invalid-inputs");
      setSubmissionStatusText(
        "You cannot submit this element due to the invalid centroid format."
      );
      setButtonDisabled(false);
      return;
    }

    const formData = new FormData(event.target);

    formData.forEach((value, key) => {
      if (key === "authors" || key === "tags" || key === "spatial-index-year") {
        data[key] = value.split(",")?.map((item) => item.trim());
      } else if (key === "notebook-url") {
        // Array[0]: the notebook repo url
        // Array[1]: the notebook filename
        const notebookUrlArrayWithMainBranch = value.split("/blob/main/");
        const notebookUrlArrayWithMasterBranch = value.split("/blob/master/");

        if (!notebookUrlArrayWithMainBranch[1]) {
          data["notebook-repo"] = notebookUrlArrayWithMasterBranch[0];
          data["notebook-file"] = decodeURIComponent(
            notebookUrlArrayWithMasterBranch[1]
          );
        } else {
          data["notebook-repo"] = notebookUrlArrayWithMainBranch[0];
          data["notebook-file"] = decodeURIComponent(
            notebookUrlArrayWithMainBranch[1]
          );
        }
      } else {
        data[key] = value;
      }
    });

    data.visibility = visibility;

    data["resource-type"] = resourceTypeSelected;

    data.metadata = { created_by: localUserInfo.id };
    data["related-resources"] = relatedResources;
    data["contents"] = contents;
    data["external-link-publication"] = publicationDOI;

    if (resourceTypeSelected === "oer") {
      data["oer-external-links"] = oerExternalLinks;
    }

    if (resourceTypeSelected === "code") {
      data["github-repo-link"] = gitHubRepoLink;
    }

    data["spatial-coverage"] = spatialCoverage;
    data["spatial-geometry"] = geometry;
    data["spatial-bounding-box"] =
      boundingBox.trim() !== "" ? `ENVELOPE (${boundingBox})` : "";
    data["spatial-centroid"] =
      centroid.trim() !== "" ? `POINT (${centroid})` : "";
    data["spatial-georeferenced"] = isGeoreferenced;
    data["spatial-temporal-coverage"] = temporalCoverage;

    data["license-id"] = licenseId;
    data["license-name"] = licenseName;
    data["license-statement"] = licenseStatement;
    data["license-url"] = licenseUrl;
    data["funding-agency"] = fundingAgency;

    TEST_MODE && console.log("data to be submitted (pre-thumbnail)", data);

    // If user uploads a new thumbnail, use the new one, otherwise, use the existing one.
    if (thumbnailImageFile) {
      const formData = new FormData();
      formData.append("file", thumbnailImageFile);

      try {
        const response = await fetchWithAuth(
          `${USER_BACKEND_URL}/api/elements/thumbnail`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        TEST_MODE && console.log("image submission return", result);
        data["thumbnail-image"] = result["image-urls"];
      } catch (error) {
        console.error("Error:", error);
        setOpenModal(true);
        setSubmissionStatus("error-uploading-thumbnail");
        setButtonDisabled(false);
        return;
      }
    } else {
      data["thumbnail-image"] = thumbnailImageFileURLs;
    }

    if (!data["thumbnail-image"] || data["thumbnail-image"] === "") {
      setOpenModal(true);
      setSubmissionStatus("error-no-thumbnail");
      setButtonDisabled(false);
      return;
    }

    TEST_MODE && console.log("data to be submitted", data);

    // If the resourceTypeSelected is notebook, verify if the notebook exists on GitHub
    if (
      resourceTypeSelected === "notebook" &&
      data["notebook-repo"] &&
      data["notebook-file"]
    ) {
      // Remove the leading GitHub domain
      const ownerAndRepo = data["notebook-repo"]?.replace(
        /^https?:\/\/(www\.)?github\.com\//,
        ""
      );
      const path = data["notebook-file"];
      TEST_MODE &&
        console.log("Submission: Notebook verification", ownerAndRepo, path);

      const fileExists = await verifyFileOnGitHub(ownerAndRepo, path);
      // This is for verifying the GitHub repo
      if (fileExists === "ERROR" || fileExists === "RATE_LIMITED") {
        setOpenModal(true);
        setSubmissionStatus("error-cannot-verify-github-file-existence");
        setButtonDisabled(false);
        return;
      } else if (fileExists === false) {
        setOpenModal(true);
        setSubmissionStatus("error-cannot-find-github-file");
        setButtonDisabled(false);
        return;
      }
    }

    // If the resourceTypeSelected is code, attempt to store readme to the database
    if (resourceTypeSelected === "code" && gitHubRepoLink) {
      const repoInfoMatch = gitHubRepoLink?.match(
        /^https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+)/
      );

      // When the GitHub repo link format is invalid
      if (!repoInfoMatch) {
        console.error("Error: GitHub repo format is invalid.");
        setOpenModal(true);
        setSubmissionStatus("error-cannot-verify-github-repo-status");
        setButtonDisabled(false);
        return;
      }
      const repoOwner = repoInfoMatch[2];
      const repoName = repoInfoMatch[3];

      TEST_MODE &&
        console.log("Submission: repo owner and name", repoOwner, repoName);
      // Fetch README.md
      const repoStatus = await fetchRepoMetadata(repoOwner, repoName);
      // This is for verifying the GitHub repo
      if (repoStatus === "ERROR") {
        setOpenModal(true);
        setSubmissionStatus("error-cannot-verify-github-repo-status");
        setButtonDisabled(false);
        return;
      }
      const rawReadme = await fetchGitHubReadme(repoOwner, repoName);
      // If GitHub doesn't return raw readme, use the copy from the DB
      if (rawReadme !== "ERROR") {
        TEST_MODE && console.log("Submission: readme recorded", rawReadme);
        data["github-repo-readme"] = rawReadme;
      } else {
        console.error("GitHub readme API unavailable");
      }
    }

    // Submit or update the element
    if (submissionType === "update") {
      try {
        const response = await fetchWithAuth(
          `${USER_BACKEND_URL}/api/elements/${elementId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        TEST_MODE && console.log("Element update msg returned", result.message);

        if (result && result.message === "Element updated successfully") {
          setOpenModal(false);
          setSubmissionStatus("update-succeeded");
          setButtonDisabled(false);
          const futureElementUrl = `/${
            RESOURCE_TYPE_NAMES_PLURAL_FOR_URI[resourceTypeSelected]
          }/${elementId}${
            visibility === ELEM_VISIBILITY.private ? "?private-mode=true" : ""
          }`;
          setElementURI(futureElementUrl);
        } else {
          setOpenModal(true);
          setSubmissionStatus("update-failed");
          setButtonDisabled(false);
          return;
        }
      } catch (error) {
        console.error("Error:", error);
        setOpenModal(true);
        setSubmissionStatus("update-failed");
        setButtonDisabled(false);
        return;
      }
    } else if (submissionType === "initial") {
      try {
        const response = await fetchWithAuth(
          `${USER_BACKEND_URL}/api/elements`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        TEST_MODE && ("initial submission, msg", result);
        if (result && result.message === "Resource registered successfully") {
          setOpenModal(false);
          setSubmissionStatus("initial-succeeded");
          if (result.elementId) {
            const futureElementUrl = `/${
              RESOURCE_TYPE_NAMES_PLURAL_FOR_URI[resourceTypeSelected]
            }/${result.elementId}${
              visibility === ELEM_VISIBILITY.private ? "?private-mode=true" : ""
            }`;
            setElementURI(futureElementUrl);
          }
          // Case where there is a duplication on publication DOI
        } else if (
          result.message === "Duplicate found while registering resource"
        ) {
          setOpenModal(true);
          setSubmissionStatus("error-initial-failed-duplicate-doi");
          setExtraComponent(
            <Typography level="title-md">
              View exisiting element{" "}
              <Link
                component={RouterLink}
                to={`/publications/${result.elementId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
            </Typography>
          );
          setButtonDisabled(false);
          return;
        } else {
          setOpenModal(true);
          setSubmissionStatus("initial-failed");
          setButtonDisabled(false);
          return;
        }
      } catch (error) {
        console.error("Error:", error);
        setOpenModal(true);
        setSubmissionStatus("initial-failed");
        setButtonDisabled(false);
        return;
      }
    }
    // Re-enable the submission button. This part, as a fail-safe, is necessary in case of some unexpected early returns.
    setButtonDisabled(false);
  }

  if (error) {
    return (
      <ErrorPage
        customStatusText={error}
        isAuthenticated={isAuthenticated}
        localUserInfo={localUserInfo}
      />
    );
  }

  if (loading) {
    return <LoadingCard title="Loading the element contribution form..." />;
  }

  // After submission, show users the submission status.
  if (submissionStatus !== "no-submission" && !openModal) {
    return (
      <SubmissionStatusCard
        submissionStatus={submissionStatus}
        elementURI={elementURI}
      />
    );
  }

  if (!localUserInfo) {
    return null;
  }

  if (!contributor) {
    return null;
  }

  // NOTE (March 25, 2025): Check if userRoleFromJWT is undefined, if yes, only test it against
  //   the user role from the database. The reason is when the user first registers, JWT doesn't
  //   contain a user role, which is undefined at this point.
  // Check if the current user is a moderator, if yes, allow to edit anyway
  const isModerator =
    localUserInfo.role <= PERMISSIONS["edit_all"] &&
    (typeof userRoleFromJWT === "undefined" ||
      userRoleFromJWT <= PERMISSIONS["edit_all"]);
  const isContributor = localUserInfo.id === contributor.id;

  // If the user is not the contributor, deny access to the update form.
  if (submissionType === "update") {
    if (!isContributor && !isModerator) {
      TEST_MODE &&
        console.log("Can't update", localUserInfo.role, userRoleFromJWT);
      return (
        <SubmissionStatusCard submissionStatus="error-unauthorized-update-element" />
      );
    }
  }

  // Check if the current user can contribute this type of element
  const canContribute =
    localUserInfo.role <= PERMISSIONS["contribute"] &&
    (typeof userRoleFromJWT === "undefined" ||
      userRoleFromJWT <= PERMISSIONS["contribute"]);
  const canEditOER =
    localUserInfo.role <= PERMISSIONS["edit_oer"] &&
    (typeof userRoleFromJWT === "undefined" ||
      userRoleFromJWT <= PERMISSIONS["edit_oer"]);
  const canEditMap =
    localUserInfo.role <= PERMISSIONS["edit_map"] &&
    (typeof userRoleFromJWT === "undefined" ||
      userRoleFromJWT <= PERMISSIONS["edit_map"]);

  if (submissionType === "initial") {
    if (!canContribute) {
      TEST_MODE &&
        console.log("Can't contribute", localUserInfo.role, userRoleFromJWT);
      return (
        <SubmissionStatusCard submissionStatus="error-unauthorized-initial-submission" />
      );
    } else if (elementType === "oer" && !canEditOER) {
      TEST_MODE &&
        console.log(
          "Can't contribute OER",
          localUserInfo.role,
          userRoleFromJWT
        );
      return (
        <SubmissionStatusCard submissionStatus="error-unauthorized-initial-submission" />
      );
    } else if (elementType === "map" && !canEditMap) {
      TEST_MODE &&
        console.log(
          "Can't contribute map",
          localUserInfo.role,
          userRoleFromJWT
        );
      return (
        <SubmissionStatusCard submissionStatus="error-unauthorized-initial-submission" />
      );
    }
  }

  let cardTitle = "";
  if (submissionType === "initial") {
    cardTitle =
      "Submit a new " + RESOURCE_TYPE_NAMES[elementType]?.toLowerCase();
  } else if (submissionType === "update") {
    if (isContributor) {
      cardTitle = "Edit your contribution";
    } else if (isModerator) {
      cardTitle = "Edit this element as a moderator";
    }
  } else {
    cardTitle = "You are not authorized to update this element";
  }

  function RequiredFieldIndicator() {
    return (
      <Typography color="danger" level="title-lg">
        *
      </Typography>
    );
  }

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          maxHeight: "max-content",
          width: "100%",
        }}
      >
        <Typography level="h2">{cardTitle}</Typography>
        {isModerator && !isContributor && submissionType === "update" && (
          <Typography color="danger" level="title-md">
            WARNING: You are not the contributor
          </Typography>
        )}
        <Typography level="body-md">
          If you have questions or run into any issue, please contact us{" "}
          <Link
            component={RouterLink}
            to="/contact-us"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </Link>
          .
        </Typography>
        <Typography level="body-sm">
          Fields marked <RequiredFieldIndicator /> are required.
        </Typography>
        <Divider inset="none" />
        <form onSubmit={handleSubmit} name="resourceForm">
          <CardContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
              gap: 2,
            }}
          >
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle
                  tooltipTitle="If you set the visibility of this element to private, only you and the Platform admins can view it."
                  fieldRequired
                >
                  Visibility
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Select
                value={visibility ?? ""}
                onChange={handleVisibilityChange}
              >
                <Option value={ELEM_VISIBILITY.public}>Public</Option>
                <Option value={ELEM_VISIBILITY.private}>Private</Option>
              </Select>
            </FormControl>
            <Typography level="h3" sx={{ pt: 1 }}>
              Element information
            </Typography>
            {resourceTypeSelected === "publication" && (
              <FormControl
                sx={{ gridColumn: "1/-1", py: 0.5 }}
                error={elementIdWithDuplicateDOI || doiLinkError}
              >
                <FormLabel>
                  <SubmissionCardFieldTitle
                    tooltipTitle={`You may provide the DOI of the publication and click "Autofill metadata" to automatically retrieve the information of the publication.`}
                    tooltipContent={`Feature powered by Crossref. Please note that not all the fields are available. Some sources are not supported by Crossref. The abstract might need to be manually reformatted.`}
                    fieldRequired
                  >
                    Publication URL (DOI link preferred)
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid size="grow">
                    {submissionType === "initial" ? (
                      <Input
                        required
                        name="external-link-publication"
                        value={publicationDOI}
                        onChange={handleDOIChange}
                      />
                    ) : (
                      <Typography>{publicationDOI}</Typography>
                    )}
                  </Grid>
                  <Grid size="auto">
                    <Button
                      variant="outlined"
                      disabled={
                        !publicationDOI ||
                        doiLinkError ||
                        elementIdWithDuplicateDOI
                      }
                      loading={publicationMetadataAutofillLoading}
                      onClick={handleAutofillPublicationInfo}
                    >
                      Autofill metadata
                    </Button>
                  </Grid>
                </Grid>
                {doiLinkType && (
                  <FormHelperText>
                    <Typography
                      level="title-sm"
                      color="success"
                      startDecorator={<CheckIcon />}
                    >
                      Valid {doiLinkType} format.
                    </Typography>
                  </FormHelperText>
                )}
                {doiLinkError && (
                  <FormHelperText>
                    <InfoOutlined />
                    The DOI or URL format is not valid. For DOIs, the format
                    follows 10.xxxx/xxxxx or https://doi.org/10.xxxx/xxxxx, and
                    for URLs, don't forget to include the protocol (https:// or
                    http://).
                  </FormHelperText>
                )}
                {elementIdWithDuplicateDOI && (
                  <FormHelperText>
                    <Typography level="title-sm" color="danger">
                      Error: The DOI/URL you entered matches one already on the
                      I-GUIDE Platform and cannot be submitted again.&nbsp;
                      <Link
                        component={RouterLink}
                        to={`/publications/${elementIdWithDuplicateDOI}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View the element
                      </Link>
                    </Typography>
                  </FormHelperText>
                )}
                <FormHelperText>
                  <Typography level="body-sm">
                    To learn more about Crossref, the autofill API provider,
                    please click&nbsp;
                    <Link
                      component={RouterLink}
                      to={`https://www.crossref.org/`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </Link>
                    .
                  </Typography>
                </FormHelperText>
              </FormControl>
            )}
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle
                  tooltipTitle="Add a title that will appear on the I-GUIDE platform"
                  tooltipContent="This title will be key information displayed on the platform so aim for consise but descriptive."
                  fieldRequired
                >
                  Title
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                name="title"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle
                  tooltipTitle="Add the authors of the resource"
                  tooltipContent={
                    "If you can't find specific authors, use something like '<resource> contributors', where you replace <resource> with a short description of the item you are submitting. You can contribute a resource to the I-GUIDE platform that you did not author yourself."
                  }
                  fieldRequired
                >
                  Authors (comma-separated)
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                name="authors"
                placeholder="Author 1, Author 2, ..."
                required
                value={authors}
                onChange={(event) => setAuthors(event.target.value)}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle fieldRequired>
                  Tags (comma-separated)
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                name="tags"
                placeholder="Tag 1, Tag 2, ..."
                required
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </FormControl>
            {resourceTypeSelected === "oer" ? (
              <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
                <FormLabel>
                  <SubmissionCardFieldTitle
                    tooltipTitle="Add a brief summary of the resource"
                    tooltipContent="Copy official abstract or summary if available. Otherwise, try to keep the description informative and concise."
                    fieldRequired
                  >
                    Content
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Suspense fallback={<div>Loading markdown editor...</div>}>
                  <HTMLEditor contents={contents} setContents={setContents} />
                </Suspense>
              </FormControl>
            ) : (
              <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
                <FormLabel>
                  <SubmissionCardFieldTitle
                    tooltipTitle="Add a brief summary of the resource"
                    tooltipContent="Copy official abstract or summary if available. Otherwise, try to keep the description informative and concise."
                    fieldRequired
                  >
                    {resourceTypeSelected === "publication"
                      ? "Abstract"
                      : "About"}
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Textarea
                  name="contents"
                  minRows={4}
                  maxRows={10}
                  required
                  value={contents}
                  onChange={(event) => setContents(event.target.value)}
                />
              </FormControl>
            )}
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle
                  tooltipTitle="Add a thumbnail image for the resource"
                  tooltipContent="You can take a screenshot of a key figure or image from the resource, or submit an image that will help distinguish the resource from other similar ones."
                  fieldRequired
                >
                  Thumbnail image {"(< 5MB)"}
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="primary"
                name="thumbnail-image"
              >
                Upload a thumbnail image
                <VisuallyHiddenInput
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  onChange={handleThumbnailImageUpload}
                />
              </Button>
              {thumbnailImageFileURLs && (
                <div>
                  <Typography>Thumbnail preview</Typography>
                  <AspectRatio ratio="1" sx={{ width: 190 }}>
                    <img
                      // This is necessary to show both the newly uploaded image as well as the returned thumbnail
                      src={
                        typeof thumbnailImageFileURLs === "string"
                          ? thumbnailImageFileURLs
                          : thumbnailImageFileURLs.low
                      }
                      loading="lazy"
                      alt="thumbnail-preview"
                    />
                  </AspectRatio>
                </div>
              )}
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="Add a credit or the source of the thumbnail image if required">
                  Thumbnail image credit
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                name="thumbnail-credit"
                value={thumbnailImageCredit}
                onChange={(event) =>
                  setThumbnailImageCredit(event.target.value)
                }
              />
            </FormControl>
            {resourceTypeSelected === "map" && (
              <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
                <FormLabel>
                  <SubmissionCardFieldTitle tooltipTitle="A link to view the map.">
                    Map iframe link
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Input
                  name="map-external-iframe-link"
                  value={mapIframeLink}
                  onChange={(event) => setMapIframeLink(event.target.value)}
                />
              </FormControl>
            )}
            {resourceTypeSelected === "dataset" && (
              <FormControl
                sx={{ gridColumn: "1/-1", py: 0.5 }}
                error={
                  datasetExternalLinkError ||
                  elementIdWithDuplicateDatasetExternalLink
                }
              >
                <FormLabel>
                  <SubmissionCardFieldTitle
                    tooltipTitle="Add a link to the primary page for this dataset"
                    fieldRequired
                  >
                    Dataset host link
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Input
                  required
                  name="external-link"
                  placeholder="https://example.com"
                  value={datasetExternalLink}
                  onChange={handleDatasetExternalLinkChange}
                />
                {datasetExternalLinkError && (
                  <FormHelperText>
                    <InfoOutlined />
                    The input is not a valid URL. Don't forget to include the
                    protocol (https:// or http://).
                  </FormHelperText>
                )}
                {elementIdWithDuplicateDatasetExternalLink && (
                  <FormHelperText>
                    <Typography level="title-sm" color="danger">
                      Error: The dataset host link you entered matches one
                      already on the I-GUIDE Platform and cannot be submitted
                      again.&nbsp;
                      <Link
                        component={RouterLink}
                        to={`/datasets/${elementIdWithDuplicateDatasetExternalLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View the element
                      </Link>
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            )}
            {resourceTypeSelected === "dataset" && (
              <FormControl
                sx={{ gridColumn: "1/-1", py: 0.5 }}
                error={directDownloadLinkError}
              >
                <FormLabel>
                  <SubmissionCardFieldTitle
                    tooltipTitle="If there is a direct download link available for the dataset, indicate it here"
                    tooltipContent="By direct download link, we mean a link where when you click it it starts the download process for the dataset"
                  >
                    Dataset direct download link
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Input
                  name="direct-download-link"
                  value={directDownloadLink}
                  onChange={handleDirectDownloadLinkChange}
                />
                {directDownloadLinkError && (
                  <FormHelperText>
                    <InfoOutlined />
                    The input is not a valid URL. Don't forget to include the
                    protocol (https:// or http://).
                  </FormHelperText>
                )}
              </FormControl>
            )}
            {resourceTypeSelected === "dataset" && (
              <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
                <FormLabel>
                  <SubmissionCardFieldTitle
                    tooltipTitle="Add size information for the dataset here"
                    tooltipContent="If you know the exact size, add that, otherwise estimate if you can. I.e. is it on the order of megabytes, gigabytes, or terrabytes?"
                  >
                    Dataset size
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Input
                  name="size"
                  value={dataSize}
                  onChange={(event) => setDataSize(event.target.value)}
                />
              </FormControl>
            )}
            {resourceTypeSelected === "notebook" && (
              <FormControl
                sx={{ gridColumn: "1/-1", py: 0.5 }}
                error={notebookGitHubUrlError}
              >
                <FormLabel>
                  <SubmissionCardFieldTitle
                    tooltipTitle="This is a link to the notebook on GitHub you would like featured for this Knowledge Element"
                    tooltipContent={`You must link to one specific notebook for 
                our notebook preview to function correctly, but when the notebook is 
                opened on the I-GUIDE Platform the entire repo will be copied to the 
                user's environment. An example link may look like "https://github.com/
                <username>/<repo_name>/blob/<main or master>/<notebook_name>.ipynb"
                `}
                    fieldRequired
                  >
                    Jupyter Notebook GitHub URL
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Input
                  required
                  name="notebook-url"
                  placeholder="https://github.com/<username>/<repo_name>/blob/<main or master>/<notebook_name>.ipynb"
                  value={notebookGitHubUrl}
                  onChange={handleNotebookGitHubUrlChange}
                />
                {notebookGitHubUrlError && (
                  <FormHelperText>
                    <InfoOutlined />
                    The link format is invalid!
                  </FormHelperText>
                )}
              </FormControl>
            )}
            {/* External links */}
            {resourceTypeSelected === "oer" && (
              <Grid sx={{ gridColumn: "1/-1" }}>
                <FormLabel>
                  <SubmissionCardFieldTitle>
                    Educational resource external links (Click &#10004; button
                    to save)
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Table>
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }} align="left">
                        Type
                      </th>
                      <th style={{ width: "30%" }} align="left">
                        URL
                      </th>
                      <th style={{ width: "5%" }} align="left"></th>
                      <th style={{ width: "40%" }} align="left">
                        Title
                      </th>
                      <th style={{ width: "50px" }} align="left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {oerExternalLinks?.map((x, i) => (
                      <tr key={i}>
                        <td align="left">
                          <p>{OER_EXTERNAL_LINK_TYPES[x.type]}</p>
                        </td>
                        <td align="left">
                          <p>{x.url}</p>
                        </td>
                        <td align="left">
                          <p></p>
                        </td>
                        <td align="left">
                          <p>{x.title}</p>
                        </td>
                        <td align="left">
                          {oerExternalLinks.length !== 0 && (
                            <DeleteForeverRoundedIcon
                              color="danger"
                              onClick={() =>
                                handleRemovingOneOerExternalLink(i)
                              }
                              style={{
                                marginRight: "10px",
                                marginTop: "4px",
                                cursor: "pointer",
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td align="left">
                        <Select
                          placeholder="Type"
                          value={currentOerExternalLinkType ?? ""}
                          onChange={(e, newValue) =>
                            handleOerExternalLinkTypeChange(newValue)
                          }
                        >
                          <Option value="slides">Slides</Option>
                          <Option value="bok">Body of Knowledge</Option>
                          <Option value="oer">
                            Open Educational Resources
                          </Option>
                          <Option value="course">Course</Option>
                          <Option value="webpage">Webpage</Option>
                        </Select>
                      </td>
                      <td align="left">
                        <Input
                          value={currentOerExternalLinkURL}
                          onChange={(event) =>
                            setCurrentOerExternalLinkURL(event.target.value)
                          }
                        />
                      </td>
                      <td align="left">
                        <IconButton
                          aria-label="Search website title"
                          size="sm"
                          variant="outlined"
                          onClick={() => handleOerExternalLinkSearchTitle()}
                          style={{ marginTop: "4px", cursor: "pointer" }}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </td>
                      <td align="left">
                        <Input
                          value={currentOerExternalLinkTitle}
                          onChange={(event) =>
                            setCurrentOerExternalLinkTitle(event.target.value)
                          }
                        />
                      </td>
                      <td align="left">
                        <IconButton
                          aria-label="Save this external link"
                          size="sm"
                          variant="soft"
                          onClick={handleAddingOneOerExternalLink}
                          style={{ marginTop: "4px", cursor: "pointer" }}
                          color="primary"
                        >
                          <CheckIcon />
                        </IconButton>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Grid>
            )}
            {resourceTypeSelected === "code" && (
              <FormControl
                sx={{ gridColumn: "1/-1", py: 0.5 }}
                error={
                  gitHubRepoLinkError || elementIdWithDuplicateGitHubRepoLink
                }
              >
                <FormLabel>
                  <SubmissionCardFieldTitle
                    tooltipTitle="This is a link to the repository on GitHub you would like featured for this Knowledge Element"
                    tooltipContent={`An example link may look like "https://github.com/<repo_owner>/<repo_name>"`}
                    fieldRequired
                  >
                    GitHub repository link (Repository must be public)
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Input
                  required
                  name="github-repo-link"
                  placeholder="https://github.com/<repo_owner>/<repo_name>"
                  value={gitHubRepoLink}
                  onChange={handleRepoLinkChange}
                />
                {gitHubRepoLinkError && (
                  <FormHelperText>
                    <InfoOutlined />
                    The link format is invalid!
                  </FormHelperText>
                )}
                {elementIdWithDuplicateGitHubRepoLink && (
                  <FormHelperText>
                    <Typography level="title-sm" color="danger">
                      Error: The GitHub repository link you entered matches one
                      already on the I-GUIDE Platform and cannot be submitted
                      again.&nbsp;
                      <Link
                        component={RouterLink}
                        to={`/code/${elementIdWithDuplicateGitHubRepoLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View the element
                      </Link>
                    </Typography>
                  </FormHelperText>
                )}
              </FormControl>
            )}

            <Typography level="h3" sx={{ pt: 1 }}>
              Related elements
            </Typography>
            {/* Related elements */}
            <Grid sx={{ gridColumn: "1/-1" }}>
              <FormLabel>
                <SubmissionCardFieldTitle
                  tooltipTitle="Indicate other existing resources from the I-GUIDE platform that are similar, related, or relavent to the resource you are submitting"
                  tooltipContent="These resources may be resources used to create the resource you are submitting, use similar methods, or address similar themes. If you wish to connect a resource that hasn't been contributed to the I-GUIDE platform yet, create the resource and connect it to the current resource upon creation."
                >
                  Related elements
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "25%" }} align="left">
                      Type
                    </th>
                    <th style={{ width: "70%" }} align="left">
                      Title
                    </th>
                    <th style={{ width: "5%" }} align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {relatedResources?.map((x, i) => (
                    <tr key={i}>
                      <td align="left">
                        <p>{RESOURCE_TYPE_NAMES[x["resource-type"]]}</p>
                      </td>
                      <td align="left">
                        <p>{x.title}</p>
                      </td>
                      <td align="left">
                        {relatedResources.length !== 0 && (
                          <DeleteForeverRoundedIcon
                            color="danger"
                            onClick={() => handleRemovingOneRelatedResource(i)}
                            style={{
                              marginRight: "10px",
                              marginTop: "4px",
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td align="left">
                      <Select
                        placeholder="Type"
                        value={currentRelatedResourceType ?? ""}
                        onChange={(e, newValue) =>
                          handleRelatedResourceTypeChange(newValue)
                        }
                      >
                        <Option value="dataset">Dataset</Option>
                        <Option value="notebook">Notebook</Option>
                        <Option value="publication">Publication</Option>
                        <Option value="oer">Educational Resource</Option>
                        <Option value="map">Map</Option>
                        <Option value="code">Code</Option>
                      </Select>
                    </td>
                    <td align="left">
                      <FormControl id="asynchronous-demo">
                        <Autocomplete
                          placeholder="Type and select from the dropdown"
                          disabled={
                            !currentRelatedResourceType ||
                            currentRelatedResourceType === ""
                          }
                          loading={relatedResourceDropdownLoading}
                          options={returnedRelatedResourceTitle}
                          value={currentRelatedResourceTitle || null}
                          onChange={(e, newValue) =>
                            handleRelatedResourceTitleChange(newValue)
                          }
                          inputValue={currentSearchTerm}
                          onInputChange={(e, newInputValue) => {
                            handleRelatedResourceTitleInputChange(
                              newInputValue
                            );
                          }}
                        />
                      </FormControl>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Grid>

            <Typography level="h3" sx={{ pt: 1 }}>
              Spatial metadata
            </Typography>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle
                  tooltipTitle="Provide the location name for spatial metadata autofill. It can be a city, landmark, organization, or even a street address."
                  tooltipContent={`Feature powered by Nominatim. Please note that the API may not return the correct result, or may return no result at all.`}
                >
                  Enter the location name (only for spatial metadata autofill)
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid size="grow">
                  <Input
                    placeholder="Examples: Chicago; Lake Michigan; 123 Main St, City, State..."
                    value={spatialDescription}
                    onChange={(event) =>
                      setSpatialDescription(event.target.value)
                    }
                  />
                </Grid>
                <Grid size="auto">
                  <Button
                    variant="outlined"
                    loading={spatialMetadataAutofillLoading}
                    onClick={handleAutofillSpatialMetadata}
                  >
                    Autofill metadata
                  </Button>
                </Grid>
              </Grid>
              <FormHelperText>
                <Typography level="body-sm">
                  To learn more about Nominatim, the autofill API provider,
                  please click&nbsp;
                  <Link
                    component={RouterLink}
                    to={`https://nominatim.org/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </Link>
                  .
                </Typography>
              </FormHelperText>
            </FormControl>
            {spatialMetadataList?.length > 0 && (
              <Grid sx={{ gridColumn: "1/-1", py: 0.5 }}>
                <Typography level="title-sm" sx={{ pb: 1 }}>
                  We have found {spatialMetadataList.length} matching location
                  {spatialMetadataList.length > 1 && "s"}. Please click{" "}
                  {spatialMetadataList.length > 1 && "one"} to autofill spatial
                  metadata:
                </Typography>
                <Grid
                  container
                  spacing={3}
                  columns={12}
                  sx={{ flexGrow: 1 }}
                  justifyContent="flex-start"
                >
                  {spatialMetadataList?.map((spatialMetadata, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                      <SpatialMetadataInfoCard
                        displayName={spatialMetadata.display_name}
                        addressType={spatialMetadata.addresstype}
                        type={spatialMetadata.type}
                        category={spatialMetadata.category}
                        listIndex={index}
                        setListIndex={setSelectedSpatialMetadataIndex}
                        selectedSpatialMetadataIndex={
                          selectedSpatialMetadataIndex
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="A text description of the spatial extent out to the national level, e.g., Chicago, Illinois, United States">
                  Spatial coverage name
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                placeholder="Chicago, Cook County, Illinois, United States"
                value={spatialCoverage}
                onChange={(event) => setSpatialCoverage(event.target.value)}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="The Well-Known Text (WKT) description of the geometry for the spatial coverage.">
                  Geometry
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Textarea
                placeholder="POLYGON((-80 25,-65 18,-64 33,-80 25))"
                minRows={4}
                maxRows={10}
                value={geometry}
                onChange={(event) => setGeometry(event.target.value)}
              />
            </FormControl>
            <FormControl
              sx={{ gridColumn: "1/-1", py: 0.5 }}
              error={boundingBoxError.status}
            >
              <FormLabel>
                <SubmissionCardFieldTitle
                  tooltipTitle="The bounding box in the format:"
                  tooltipContent="ENVELOPE (minimum longitude, maximum longitude, minimum latitude, maximum latitude) aka ENVELOPE (westernmost, easternmost, southernmost, northernmost)"
                >
                  Bounding box
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Grid
                container
                spacing={0.5}
                sx={{ flexGrow: 1, alignItems: "center" }}
              >
                <Grid size="auto">{"ENVELOPE ("}</Grid>
                <Grid size="grow">
                  <Input
                    placeholder="-111.1,-104.0,40.9,45.0"
                    value={boundingBox}
                    onChange={handleBoundingBoxChange}
                  />
                </Grid>
                <Grid size="auto">{")"}</Grid>
              </Grid>
              {boundingBoxError.status && (
                <FormHelperText>
                  <InfoOutlined />
                  The bounding box format is invalid! {boundingBoxError.message}
                  .
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              sx={{ gridColumn: "1/-1", py: 0.5 }}
              error={centroidError.status}
            >
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="The longitude and latitude of the centroid of the data.">
                  Centroid
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Grid
                container
                spacing={0.5}
                sx={{ flexGrow: 1, alignItems: "center" }}
              >
                <Grid size="auto">{"POINT ("}</Grid>
                <Grid size="grow">
                  <Input
                    placeholder="-94.087 46.4218"
                    value={centroid}
                    onChange={handleCentroidChange}
                  />
                </Grid>
                <Grid size="auto">{")"}</Grid>
              </Grid>
              {centroidError.status && (
                <FormHelperText>
                  <InfoOutlined />
                  The centroid format is invalid! {centroidError.message}.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="True or false, indicating if the knowledge element has a georeferenced version.">
                  Georeferenced
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Select
                placeholder="Select true or false"
                value={isGeoreferenced ?? ""}
                onChange={(e, newValue) => setIsGeoreferenced(newValue)}
              >
                <Option value="">
                  <em>Select true or false</em>
                </Option>
                <Option value="true">True</Option>
                <Option value="false">False</Option>
              </Select>
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="A list of text descriptions of the time period for the knowledge element.">
                  Temporal coverage (Click &#10004; button to save)
                </SubmissionCardFieldTitle>
              </FormLabel>
              <CapsuleInput
                array={temporalCoverage}
                setArray={setTemporalCoverage}
                placeholder="Late 20th century"
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="The years this knowledge elements relates to.">
                  Index years (comma-separated)
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                name="spatial-index-year"
                placeholder="1990, 2000, ..."
                value={indexYears}
                onChange={(event) => setIndexYears(event.target.value)}
              />
            </FormControl>

            <Typography level="h3" sx={{ pt: 1 }}>
              License and others
            </Typography>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="Select a license for this element.">
                  License
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Select
                placeholder="Select a license"
                value={licenseId ?? ""}
                onChange={(e, newValue) => handleLicenseChange(newValue)}
              >
                <Option value="">
                  <em>Select a license</em>
                </Option>
                {ELEMENT_LICENSES?.map((x, i) => (
                  // Display name of the license
                  <Option key={x} value={x}>
                    {ELEMENT_LICENSES_INFO[x][0]}
                  </Option>
                ))}
                <Option value="other">Other</Option>
              </Select>
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle>
                  License statement
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                name="license-statement"
                value={licenseStatement}
                disabled={!licenseId}
                onChange={(event) => setLicenseStatement(event.target.value)}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle>License URL</SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                name="license-url"
                value={licenseUrl}
                disabled={!licenseId}
                onChange={(event) => setLicenseUrl(event.target.value)}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="Acknowledge the source of funding related to this element.">
                  Funding agency
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                name="funding-agency"
                placeholder="NSF, USDA, DOD, ..."
                value={fundingAgency}
                onChange={(event) => setFundingAgency(event.target.value)}
              />
              {fundingAgency && (
                <Typography level="body-sm">
                  Displayed on the element page as:{" "}
                  <Typography variant="soft">
                    This project is funded by {fundingAgency}
                  </Typography>
                  .
                </Typography>
              )}
            </FormControl>

            <CardActions sx={{ gridColumn: "1/-1" }}>
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  disabled={buttonDisabled}
                >
                  {buttonDisabled
                    ? "Sending..."
                    : submissionType === "update"
                    ? "Update"
                    : "Submit"}
                </Button>
                <Typography level="body-sm">
                  By clicking{" "}
                  {submissionType === "update" ? "Update" : "Submit"}, you agree
                  to our{" "}
                  <Link
                    component={RouterLink}
                    to="/contributor-license-agreement"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contributor License Agreement
                  </Link>
                  .
                </Typography>
              </Stack>
            </CardActions>
          </CardContent>
        </form>
      </Card>
      {/* Handle submission failure */}
      <Modal
        open={openModal}
        onClose={() => {
          setSubmissionStatus("no-submission");
          setSubmissionStatusText("");
          setOpenModal(false);
          setButtonDisabled(false);
        }}
      >
        <ModalDialog size="lg">
          <ModalClose />
          <SubmissionStatusCard
            submissionStatus={submissionStatus}
            submissionStatusText={submissionStatusText}
            extraComponent={extraComponent}
            elementURI={elementURI}
          />
        </ModalDialog>
      </Modal>
    </>
  );
}
