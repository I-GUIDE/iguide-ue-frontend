import React, { useState, useEffect, lazy, Suspense } from "react";

import { useOutletContext, Link as RouterLink } from "react-router";

import Grid from "@mui/joy/Grid";
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

import { fetchWithAuth } from "../../utils/FetcherWithJWT";
import { checkTokens } from "../../utils/UserManager";
import { PERMISSIONS } from "../../configs/Permissions";

import {
  RESOURCE_TYPE_NAMES,
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
  getMetadataByDOI,
  duplicateDOIExists,
  fetchSinglePrivateElementDetails,
} from "../../utils/DataRetrieval";
import { printListWithDelimiter } from "../../helpers/helper";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

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
  const { localUserInfo } = useOutletContext();

  const submissionType = props.submissionType;
  const elementId = props.elementId;
  const elementType = props.elementType;
  const isPrivateElement = props.isPrivateElement;

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

  const [submissionStatus, setSubmissionStatus] = useState("no submission");
  const [subMessage, setSubMessage] = useState();

  const [elementURI, setElementURI] = useState("");

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [authors, setAuthors] = useState("");
  const [contents, setContents] = useState("");

  const [datasetExternalLink, setDatasetExternalLink] = useState("");
  const [directDownloadLink, setDirectDownloadLink] = useState("");
  const [dataSize, setDataSize] = useState("");

  const [notebookFile, setNotebookFile] = useState("");
  const [notebookRepo, setNotebookRepo] = useState("");
  const [notebookGitHubUrl, setNotebookGitHubUrl] = useState("");
  const [notebookGitHubUrlError, setNotebookGitHubUrlError] = useState(false);

  const [publicationDOI, setPublicationDOI] = useState("");
  const [elementIdWithDuplicateDOI, setElementIdWithDuplicateDOI] = useState();

  const [mapIframeLink, setMapIframeLink] = useState("");

  const [gitHubRepoLink, setGitHubRepoLink] = useState("");

  const [contributor, setContributor] = useState([]);

  const [spatialCoverage, setSpatialCoverage] = useState([]);
  const [geometry, setGeometry] = useState("");
  const [boundingBox, setBoundingBox] = useState("");
  const [centroid, setCentroid] = useState("");
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

  useEffect(() => {
    const checkJWTToken = async () => {
      const message = await checkTokens();
      TEST_MODE && console.log("Check token returns", message);
    };
    checkJWTToken();
  }, []);

  // If the submission type is 'update', load the existing element information.
  useEffect(() => {
    const fetchData = async () => {
      const thisElement = isPrivateElement
        ? await fetchSinglePrivateElementDetails(elementId)
        : await fetchSingleElementDetails(elementId);

      TEST_MODE && console.log("returned element", thisElement);

      const elementUrlReturned = `/${
        thisElement["resource-type"]
      }s/${elementId}${
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

      setContributor(thisElement["contributor"]);

      setSpatialCoverage(thisElement["spatial-coverage"] || []);
      setGeometry(thisElement["spatial-geometry"]);
      setBoundingBox(thisElement["spatial-bounding-box"]);
      setCentroid(thisElement["spatial-centroid"]);
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

  const handleVisibilityChange = async (e, newValue) => {
    TEST_MODE && console.log("Setting visibility to", newValue);
    setVisibility(newValue);
  };

  const handleThumbnailImageUpload = (event) => {
    const thumbnailFile = event.target.files[0];
    if (!thumbnailFile.type.startsWith("image/")) {
      alert("Please upload an image!");
      setThumbnailImageFile(null);
      setThumbnailImageFileURLs(null);
      return null;
    }
    if (thumbnailFile.size > IMAGE_SIZE_LIMIT) {
      alert("Please upload an image smaller than 5MB!");
      setThumbnailImageFile(null);
      setThumbnailImageFileURLs(null);
      return null;
    }
    setThumbnailImageFile(thumbnailFile);
    setThumbnailImageFileURLs(URL.createObjectURL(thumbnailFile));
  };

  // Related elements...
  const handleRemovingOneRelatedResource = (idx) => {
    const newArray = [...relatedResources];
    newArray.splice(idx, 1);
    setRelatedResources(newArray);
    TEST_MODE && console.log("Removing one, now: ", relatedResources, idx);
  };

  const handleRelatedResourceTypeChange = (value) => {
    setCurrentRelatedResourceType(value);
  };

  const handleRelatedResourceTitleChange = (value) => {
    setCurrentRelatedResourceTitle(value);
    setRelatedResources([
      ...relatedResources,
      { "resource-type": currentRelatedResourceType, title: value },
    ]);
    setCurrentRelatedResourceType("");
    setCurrentRelatedResourceTitle("");
    setCurrentSearchTerm("");
  };

  const handleRelatedResourceTitleInputChange = (value) => {
    setCurrentSearchTerm(value);
  };

  // OER external links...
  const handleAddingOneOerExternalLink = () => {
    if (!currentOerExternalLinkType || currentOerExternalLinkType === "") {
      alert("Please select an external link type!");
      return;
    }
    if (!currentOerExternalLinkURL || currentOerExternalLinkURL === "") {
      alert("Please enter a URL!");
      return;
    }
    if (!currentOerExternalLinkTitle || currentOerExternalLinkTitle === "") {
      alert("Please enter a title!");
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
  };

  const handleRemovingOneOerExternalLink = (idx) => {
    const newArray = [...oerExternalLinks];
    newArray.splice(idx, 1);
    setOerExternalLinks(newArray);
    TEST_MODE && console.log("Removing one, now: ", oerExternalLinks);
  };

  const handleOerExternalLinkTypeChange = (value) => {
    setCurrentOerExternalLinkType(value);
  };

  const handleOerExternalLinkSearchTitle = async () => {
    const url = currentOerExternalLinkURL;

    if (url) {
      const response = await fetch(
        `${USER_BACKEND_URL}/api/url-title/?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        alert(
          "Retrieve website title failed... please input the title manually!"
        );
        return;
      }
      const data = await response.json();
      TEST_MODE && console.log("search return", data.title);
      setCurrentOerExternalLinkTitle(data.title);
    }
  };

  const handleDOIInputChange = async (e) => {
    setPublicationDOI(e.target.value);

    const doiVerification = await duplicateDOIExists(e.target.value);
    if (doiVerification && doiVerification.duplicate) {
      setElementIdWithDuplicateDOI(doiVerification.elementId);
    } else {
      setElementIdWithDuplicateDOI(null);
    }
  };

  const handleAutofillPublicationInfo = async () => {
    if (!publicationDOI || publicationDOI === "") {
      alert("Please enter the DOI first. Thank you!");
      return;
    }

    const metadataDOI = await getMetadataByDOI(publicationDOI);
    TEST_MODE && console.log("pub metadata", metadataDOI);

    if (!metadataDOI || metadataDOI === "") {
      return;
    }

    // If we couldn't fetch the metadata via Crossref, do this...
    if (metadataDOI === "Publication not found") {
      alert(
        "We could not fetch the metadata based on the URL you provided. That could be because the URL (if it's a DOI link) is not registered on Crossref, or the URL you provided is not a DOI link. Please manually input the publication information in the form. Thank you."
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
  };

  const handleNotebookGitHubUrlChange = (event) => {
    const val = event.target.value;
    setNotebookGitHubUrl(val);

    // Validate if the URL is in the form of https://github.com/{repo}/blob/{branch}/{filename}.ipynb
    const validNotebookGitHubUrl = new RegExp(
      "https://(www.)?github.com/.+/blob/(master|main)/.+.ipynb"
    );
    if (val === "" || validNotebookGitHubUrl.test(val)) {
      setNotebookGitHubUrlError(false);
    } else {
      setNotebookGitHubUrlError(true);
    }
  };

  const handleRepoLinkChange = (event) => {
    const val = event.target.value;
    setGitHubRepoLink(val);

    // Validate if the URL is in the form of https://github.com/{owner}/{repo}
    const validNotebookGitHubUrl = new RegExp(
      "https://(www.)?github.com/.+?/.+?"
    );
    if (val === "" || validNotebookGitHubUrl.test(val)) {
      setNotebookGitHubUrlError(false);
    } else {
      setNotebookGitHubUrlError(true);
    }
  };

  const handleLicenseChange = (value) => {
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {};

    // When the user forgets to save the new related element, app will ask the user to submit it
    if (currentRelatedResourceTitle && currentRelatedResourceTitle !== "") {
      alert(
        'You have an unsaved related element. Please click the "+" button to save the related element before submitting your contribution!'
      );
      return;
    }

    // When the user forgets to save the new educational element link, app will ask the user to submit it
    if (
      (currentOerExternalLinkURL && currentOerExternalLinkURL !== "") ||
      (currentOerExternalLinkTitle && currentOerExternalLinkTitle !== "")
    ) {
      alert(
        'You have an unsaved educational resource external link. Please click the "+" button to save the external link before submitting your contribution!'
      );
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

    data["spatial-coverage"] = spatialCoverage;
    data["spatial-geometry"] = geometry;
    data["spatial-bounding-box"] = boundingBox;
    data["spatial-centroid"] = centroid;
    data["spatial-georeferenced"] = isGeoreferenced;
    data["spatial-temporal-coverage"] = temporalCoverage;

    data["license-id"] = licenseId;
    data["license-name"] = licenseName;
    data["license-statement"] = licenseStatement;
    data["license-url"] = licenseUrl;
    data["funding-agency"] = fundingAgency;

    TEST_MODE && console.log("data to be submitted (pre-thumbnail)", data);

    setButtonDisabled(true);

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
        setButtonDisabled(false);
        alert("Error uploading thumbnail...");
      }
    } else {
      data["thumbnail-image"] = thumbnailImageFileURLs;
    }

    if (!data["thumbnail-image"] || data["thumbnail-image"] === "") {
      alert("You have to upload a thumbnail image for your contribution!");
      setButtonDisabled(false);
      return;
    }

    TEST_MODE && console.log("data to be submitted", data);

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
          const futureElementUrl = `/${resourceTypeSelected}s/${elementId}${
            visibility === ELEM_VISIBILITY.private ? "?private-mode=true" : ""
          }`;
          setElementURI(futureElementUrl);
        } else {
          setOpenModal(true);
          setSubmissionStatus("update-failed");
        }
      } catch (error) {
        console.error("Error:", error);
        setButtonDisabled(false);
        alert("Error updating this element...");
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
            const futureElementUrl = `/${resourceTypeSelected}s/${
              result.elementId
            }${
              visibility === ELEM_VISIBILITY.private ? "?private-mode=true" : ""
            }`;
            setElementURI(futureElementUrl);
          }
          // Case where there is a duplication on publication DOI
        } else if (
          result.message === "Duplicate found while registering resource"
        ) {
          setOpenModal(true);
          setSubmissionStatus("initial-failed-duplicate");
          setSubMessage(
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
        } else {
          setOpenModal(true);
          setSubmissionStatus("initial-failed");
        }
      } catch (error) {
        console.error("Error:", error);
        setButtonDisabled(false);
        alert("Error submitting this new element..");
      }
    }
    setButtonDisabled(false);
  };

  // After submission, show users the submission status.
  if (submissionStatus !== "no submission" && !openModal) {
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

  // Check if the current user is admin, if yes, allow edit
  const canEditAllElements = localUserInfo.role <= PERMISSIONS["edit_all"];
  const isContributor = localUserInfo.id === contributor.id;

  // If the user is not the contributor, deny access to the update form.
  if (submissionType === "update") {
    if (!isContributor && !canEditAllElements) {
      return <SubmissionStatusCard submissionStatus="unauthorized" />;
    }
  }

  let cardTitle = "";
  if (submissionType === "initial") {
    cardTitle =
      "Submit a new " + RESOURCE_TYPE_NAMES[elementType]?.toLowerCase();
  } else if (submissionType === "update") {
    if (isContributor) {
      cardTitle = "Edit your contribution";
    } else if (canEditAllElements) {
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
        {canEditAllElements &&
          !isContributor &&
          submissionType === "update" && (
            <Typography color="danger" level="title-md">
              WARNING: You are not the contributor
            </Typography>
          )}
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
                  tooltipTitle="Set the visibility of this element"
                  fieldRequired
                >
                  Visibility
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Select value={visibility} onChange={handleVisibilityChange}>
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
                error={!!elementIdWithDuplicateDOI}
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
                  <Grid xs>
                    {submissionType === "initial" ? (
                      <Input
                        required
                        name="external-link-publication"
                        value={publicationDOI}
                        onChange={(event) => handleDOIInputChange(event)}
                      />
                    ) : (
                      <Typography>{publicationDOI}</Typography>
                    )}
                  </Grid>
                  <Grid xs="auto">
                    <Button
                      variant="outlined"
                      onClick={handleAutofillPublicationInfo}
                    >
                      Autofill metadata
                    </Button>
                  </Grid>
                </Grid>
                {elementIdWithDuplicateDOI && (
                  <FormHelperText>
                    <Typography level="title-sm" color="danger">
                      WARNING: The DOI/URL you entered matches one already on
                      the I-GUIDE Platform and cannot be submitted again.&nbsp;
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
              <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
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
                  value={datasetExternalLink}
                  onChange={(event) =>
                    setDatasetExternalLink(event.target.value)
                  }
                />
              </FormControl>
            )}
            {resourceTypeSelected === "dataset" && (
              <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
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
                  onChange={(event) =>
                    setDirectDownloadLink(event.target.value)
                  }
                />
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
              <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
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
                  error={notebookGitHubUrlError}
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
                          value={currentOerExternalLinkType}
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
            {resourceTypeSelected === "repo" && (
              <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
                <FormLabel>
                  <SubmissionCardFieldTitle fieldRequired>
                    GitHub repository link
                  </SubmissionCardFieldTitle>
                </FormLabel>
                <Input
                  name="github-repo-link"
                  value={gitHubRepoLink}
                  required
                  onChange={(event) => setGitHubRepoLink(event.target.value)}
                />
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
                        value={currentRelatedResourceType}
                        onChange={(e, newValue) =>
                          handleRelatedResourceTypeChange(newValue)
                        }
                      >
                        <Option value="dataset">Dataset</Option>
                        <Option value="notebook">Notebook</Option>
                        <Option value="publication">Publication</Option>
                        <Option value="oer">Educational Resource</Option>
                        <Option value="map">Map</Option>
                        <Option value="repo">Repository</Option>
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
                <SubmissionCardFieldTitle tooltipTitle="A list of text description of the spatial extent out to the national level.">
                  Spatial coverage (Click &#10004; button to save)
                </SubmissionCardFieldTitle>
              </FormLabel>
              <CapsuleInput
                array={spatialCoverage}
                setArray={setSpatialCoverage}
                placeholder="Chicago, IL"
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="The Well-Known Text (WKT) description of the geometry for the spatial coverage.">
                  Geometry
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                placeholder="POLYGON((-80 25, -65 18, -64 33, -80 25))"
                value={geometry}
                onChange={(event) => setGeometry(event.target.value)}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle
                  tooltipTitle="The bounding box in the format:"
                  tooltipContent="ENVELOPE(West, East, North, South)"
                >
                  Bounding Box
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                placeholder="ENVELOPE(-111.1, -104.0, 45.0, 40.9)"
                value={boundingBox}
                onChange={(event) => setBoundingBox(event.target.value)}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="The latitude and longitude of the centroid of the data.">
                  Centroid
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Input
                placeholder="46.4218,-94.087"
                value={centroid}
                onChange={(event) => setCentroid(event.target.value)}
              />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <SubmissionCardFieldTitle tooltipTitle="True or false, indicating if the knowledge element has a georeferenced version.">
                  Georeferenced
                </SubmissionCardFieldTitle>
              </FormLabel>
              <Select
                placeholder="Select true or false"
                value={isGeoreferenced}
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
                value={licenseId}
                onChange={(e, newValue) => handleLicenseChange(newValue)}
              >
                <Option value="">
                  <em>Select a license</em>
                </Option>
                {ELEMENT_LICENSES?.map((x, i) => (
                  <Option key={x} value={x}>
                    {ELEMENT_LICENSES_INFO[x]}
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
          setSubmissionStatus("no submission");
          setOpenModal(false);
        }}
      >
        <ModalDialog size="lg">
          <ModalClose />
          <SubmissionStatusCard
            submissionStatus={submissionStatus}
            subMessage={subMessage}
            elementURI={elementURI}
          />
        </ModalDialog>
      </Modal>
    </>
  );
}
