import React, { useState, useEffect } from "react";

import { useOutletContext } from "react-router-dom";

import Box from "@mui/joy/Box";
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
import Textarea from "@mui/joy/Textarea";
import { styled } from "@mui/joy";
import Table from "@mui/joy/Table";
import Autocomplete from "@mui/joy/Autocomplete";
import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";
import FormHelperText from "@mui/joy/FormHelperText";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import SubmissionStatusCard from "./SubmissionStatusCard";
import MarkdownEditor from "./MarkdownEditor";

import { fetchWithAuth } from "../utils/FetcherWithJWT";
import { checkTokens } from "../utils/UserManager";
import { PERMISSIONS } from "../configs/Permissions";

import {
  RESOURCE_TYPE_NAMES,
  OER_EXTERNAL_LINK_TYPES,
  IMAGE_SIZE_LIMIT,
} from "../configs/VarConfigs";

import {
  fetchSingleElementDetails,
  fetchAllTitlesByElementType,
  getMetadataByDOI,
} from "../utils/DataRetrieval";
import { printListWithDelimiter } from "../helpers/helper";

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

function ArrayInput(props) {
  const array = props.array;
  const setArray = props.setArray;
  const placeholder = props.placeholder;

  const [inputValue, setInputValue] = useState();

  // Add one item
  const handleAddingOneItem = () => {
    if (!inputValue || inputValue === "") {
      alert("Please enter a value!");
      return;
    }
    setArray([...array, inputValue]);
    setInputValue("");
    TEST_MODE && console.log("Added one item, now: ", array);
  };

  const handleRemovingOneItem = (idx) => {
    let newArray = [...array];
    newArray.splice(idx, 1);
    setArray(newArray);
    TEST_MODE && console.log("Removing one item, now: ", array);
  };

  return (
    <Grid sx={{ gridColumn: "1/-1" }}>
      <Table>
        <thead>
          <tr>
            <th style={{ width: "60%" }} align="left">
              Input (Click the check button to save)
            </th>
            <th style={{ width: "10%" }} align="left"></th>
          </tr>
        </thead>
        <tbody>
          {array.map((x, i) => (
            <tr key={i}>
              <td align="left">
                <p>{x}</p>
              </td>
              <td align="left">
                {array.length !== 0 && (
                  <IconButton
                    color="danger"
                    variant="plain"
                    size="sm"
                    onClick={() => handleRemovingOneItem(i)}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td align="left">
              <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
            </td>
            <td align="left">
              <IconButton
                size="sm"
                variant="soft"
                onClick={handleAddingOneItem}
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
  );
}

export default function SubmissionCard(props) {
  useEffect(() => {
    checkTokens();
  }, []);

  const { localUserInfo } = useOutletContext();

  const submissionType = props.submissionType;
  const elementId = props.elementId;
  const elementType = props.elementType;

  const [resourceTypeSelected, setResourceTypeSelected] = useState("");

  const [thumbnailImageFile, setThumbnailImageFile] = useState();
  const [thumbnailImageFileURL, setThumbnailImageFileURL] = useState();

  const [relatedResources, setRelatedResources] = useState([]);
  const [returnedRelatedResourceTitle, setReturnedRelatedResourceTitle] =
    useState([]);
  const relatedResourceDropdownLoading =
    returnedRelatedResourceTitle.length === 0;
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentRelatedResourceTitle, setCurrentRelatedResourceTitle] =
    useState();
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

  const [elementURI, setElementURI] = useState();

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

  const [mapIframeLink, setMapIframeLink] = useState("");

  const [contributor, setContributor] = useState();

  const [spatialCoverage, setSpatialCoverage] = useState([]);
  const [geometry, setGeometry] = useState("");
  const [boundingBox, setBoundingBox] = useState("");
  const [centroid, setCentroid] = useState("");
  const [isGeoreferenced, setIsGeoreferenced] = useState("");
  const [temporalCoverage, setTemporalCoverage] = useState([]);
  const [indexYears, setIndexYears] = useState([]);

  // If the submission type is 'update', load the existing element information.
  useEffect(() => {
    const fetchData = async () => {
      const thisElement = await fetchSingleElementDetails(elementId);

      TEST_MODE && console.log("returned element", thisElement);

      setElementURI("/" + thisElement["resource-type"] + "s/" + elementId);
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
      setThumbnailImageFileURL(thisElement["thumbnail-image"]);

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

      setSpatialCoverage(thisElement["spatial-coverage"]);
      setGeometry(thisElement["spatial-geometry"]);
      setBoundingBox(thisElement["spatial-bounding-box"]);
      setCentroid(thisElement["spatial-centroid"]);
      setIsGeoreferenced(thisElement["spatial-georeferenced"]);
      setTemporalCoverage(thisElement["spatial-temporal-coverage"]);
      setIndexYears(thisElement["spatial-index-year"]);

      let relatedResourcesArray = [];
      thisElement["related-datasets"].map((re) =>
        relatedResourcesArray.push({
          type: "dataset",
          title: re.title,
        })
      );
      thisElement["related-notebooks"].map((re) =>
        relatedResourcesArray.push({
          type: "notebook",
          title: re.title,
        })
      );
      thisElement["related-publications"].map((re) =>
        relatedResourcesArray.push({
          type: "publication",
          title: re.title,
        })
      );
      thisElement["related-oers"].map((re) =>
        relatedResourcesArray.push({
          type: "oer",
          title: re.title,
        })
      );
      thisElement["related-maps"].map((re) =>
        relatedResourcesArray.push({
          type: "map",
          title: re.title,
        })
      );
      setRelatedResources(relatedResourcesArray);

      setOerExternalLinks(thisElement["oer-external-links"]);
    };
    if (submissionType === "update") {
      fetchData();
    }
  }, [elementId]);

  useEffect(() => {
    if (submissionType === "initial") {
      setResourceTypeSelected(elementType);
    }
  }, [elementType]);

  // When the current related element type changes, fetch a list of titles under that type.
  useEffect(() => {
    const getAllTitlesByElementType = async (resourceType) => {
      if (resourceType && resourceType !== "") {
        const returnedTitles = await fetchAllTitlesByElementType(resourceType);
        setReturnedRelatedResourceTitle(returnedTitles);
      } else {
        setReturnedRelatedResourceTitle([]);
      }
    };
    getAllTitlesByElementType(currentRelatedResourceType);
  }, [currentRelatedResourceType]);

  const handleThumbnailImageUpload = (event) => {
    const thumbnailFile = event.target.files[0];
    if (!thumbnailFile.type.startsWith("image/")) {
      alert("Please upload an image!");
      setThumbnailImageFile(null);
      setThumbnailImageFileURL(null);
      return null;
    }
    if (thumbnailFile.size > IMAGE_SIZE_LIMIT) {
      alert("Please upload an image smaller than 5MB!");
      setThumbnailImageFile(null);
      setThumbnailImageFileURL(null);
      return null;
    }
    setThumbnailImageFile(thumbnailFile);
    setThumbnailImageFileURL(URL.createObjectURL(thumbnailFile));
  };

  // Related elements...
  const handleRemovingOneRelatedResource = (idx) => {
    let newArray = [...relatedResources];
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
      { type: currentRelatedResourceType, title: value },
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
    let newArray = [...oerExternalLinks];
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
    let authorNameList = [];

    for (let idx in authorList) {
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
      "https://(www.)?github.com/.+/blob/.+/.+.ipynb"
    );
    if (val === "" || validNotebookGitHubUrl.test(val)) {
      setNotebookGitHubUrlError(false);
    } else {
      setNotebookGitHubUrlError(true);
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
      if (key === "authors" || key === "tags") {
        data[key] = value.split(",").map((item) => item.trim());
      } else if (key === "notebook-url") {
        // Array[0]: the notebook repo url
        // Array[1]: the notebook filename
        const notebookUrlArray = value.split("/blob/main/");
        data["notebook-repo"] = notebookUrlArray[0];
        data["notebook-file"] = notebookUrlArray[1];
      } else {
        data[key] = value;
      }
    });

    data["resource-type"] = resourceTypeSelected;

    data.metadata = { created_by: localUserInfo.id };
    data["related-resources"] = relatedResources;
    data["contents"] = contents;

    if (resourceTypeSelected === "oer") {
      data["oer-external-links"] = oerExternalLinks;
    }

    data["spatial-coverage"] = spatialCoverage;
    data["spatial-geometry"] = geometry;
    data["spatial-bounding-box"] = boundingBox;
    data["spatial-centroid"] = centroid;
    data["spatial-georeferenced"] = isGeoreferenced;
    data["spatial-temporal-coverage"] = temporalCoverage;
    data["spatial-index-year"] = indexYears;

    TEST_MODE && console.log("data to be submitted (pre-thumbnail)", data);

    // If user uploads a new thumbnail, use the new one, otherwise, use the existing one.
    if (thumbnailImageFile) {
      const formData = new FormData();
      formData.append("file", thumbnailImageFile);

      const response = await fetchWithAuth(
        `${USER_BACKEND_URL}/api/elements/thumbnail`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      data["thumbnail-image"] = result.url;
    } else {
      data["thumbnail-image"] = thumbnailImageFileURL;
    }

    if (!data["thumbnail-image"] || data["thumbnail-image"] === "") {
      alert("You have to upload a thumbnail image for your contribution!");
      return;
    }

    TEST_MODE && console.log("data to be submitted", data);

    if (submissionType === "update") {
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
        setSubmissionStatus("update-succeeded");
      } else {
        setSubmissionStatus("update-failed");
      }
    } else if (submissionType === "initial") {
      const response = await fetchWithAuth(`${USER_BACKEND_URL}/api/elements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      TEST_MODE && ("initial submission, msg", result);
      if (result && result.message === "Resource registered successfully") {
        setSubmissionStatus("initial-succeeded");
        if (result.elementId) {
          setElementURI("/" + resourceTypeSelected + "s/" + result.elementId);
        }
      } else {
        setSubmissionStatus("initial-failed");
      }
    }
  };

  // After submission, show users the submission status.
  if (submissionStatus !== "no submission") {
    return (
      <SubmissionStatusCard
        submissionStatus={submissionStatus}
        submissionType={submissionType}
        elementURI={elementURI}
      />
    );
  }

  if (!localUserInfo) {
    return null;
  }

  // Check if the current user is admin, if yes, allow edit
  const canEditAllElements = localUserInfo.role <= PERMISSIONS["edit_all"];
  const isContributor = contributor && localUserInfo.id === contributor.id;

  // If the user is not the contributor, deny access to the update form.
  if (submissionType === "update") {
    if (!isContributor && !canEditAllElements) {
      return <SubmissionStatusCard submissionStatus="unauthorized" />;
    }
  }

  let cardTitle = "";
  if (submissionType === "initial") {
    cardTitle =
      "Submit a new " + RESOURCE_TYPE_NAMES[elementType].toLowerCase();
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
    <Card
      variant="outlined"
      sx={{
        maxHeight: "max-content",
        width: "100%",
      }}
    >
      <Typography level="h2">{cardTitle}</Typography>
      {canEditAllElements && !isContributor && submissionType === "update" && (
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
          <Typography level="h3" sx={{ pt: 1 }}>
            Element information
          </Typography>
          {resourceTypeSelected === "publication" && (
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <Typography
                  level="title-sm"
                  endDecorator={
                    <Tooltip
                      placement="top-start"
                      variant="outlined"
                      arrow
                      title={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            maxWidth: 320,
                            justifyContent: "center",
                            p: 1,
                          }}
                        >
                          <Typography level="title-sm" sx={{ pb: 1 }}>
                            You may provide the DOI of the publication and click
                            "Autofill metadata" to automatically retrieve the
                            information of the publication.
                          </Typography>
                          <Typography level="body-sm">
                            Feature powered by Crossref. Please note that not
                            all the fields are available. Some sources are not
                            supported by Crossref. The abstract might need to be
                            manually reformatted.
                          </Typography>
                        </Box>
                      }
                      size="lg"
                    >
                      <InfoOutlined size="lg" />
                    </Tooltip>
                  }
                >
                  <Typography
                    level="title-md"
                    endDecorator={<RequiredFieldIndicator />}
                  >
                    Publication URL (DOI link preferred)
                  </Typography>
                </Typography>
              </FormLabel>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid md>
                  <Input
                    required
                    name="external-link-publication"
                    value={publicationDOI}
                    onChange={(event) => setPublicationDOI(event.target.value)}
                  />
                </Grid>
                <Grid md="auto">
                  <Button
                    variant="outlined"
                    onClick={handleAutofillPublicationInfo}
                  >
                    Autofill metadata
                  </Button>
                </Grid>
              </Grid>
            </FormControl>
          )}
          <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
            <FormLabel>
              <Typography
                level="title-md"
                endDecorator={<RequiredFieldIndicator />}
              >
                Title
              </Typography>
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
              <Typography
                level="title-md"
                endDecorator={<RequiredFieldIndicator />}
              >
                Authors (comma-separated)
              </Typography>
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
              <Typography
                level="title-md"
                endDecorator={<RequiredFieldIndicator />}
              >
                Tags (comma-separated)
              </Typography>
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
                <Typography
                  level="title-md"
                  endDecorator={<RequiredFieldIndicator />}
                >
                  Content
                </Typography>
              </FormLabel>
              <MarkdownEditor contents={contents} setContents={setContents} />
            </FormControl>
          ) : (
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <Typography
                  level="title-md"
                  endDecorator={<RequiredFieldIndicator />}
                >
                  {resourceTypeSelected === "publication"
                    ? "Abstract"
                    : "About"}
                </Typography>
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
              <Typography
                level="title-md"
                endDecorator={<RequiredFieldIndicator />}
              >
                Thumbnail image {"(< 5MB)"}
              </Typography>
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
                onChange={handleThumbnailImageUpload}
              />
            </Button>
            {thumbnailImageFileURL && (
              <div>
                <Typography>Thumbnail preview</Typography>
                <AspectRatio ratio="1" sx={{ width: 190 }}>
                  <img
                    src={thumbnailImageFileURL}
                    loading="lazy"
                    alt="thumbnail-preview"
                  />
                </AspectRatio>
              </div>
            )}
          </FormControl>
          {resourceTypeSelected === "map" && (
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <Typography
                  level="title-md"
                  endDecorator={<RequiredFieldIndicator />}
                >
                  Map iframe link
                </Typography>
              </FormLabel>
              <Input
                required
                name="map-external-iframe-link"
                value={mapIframeLink}
                onChange={(event) => setMapIframeLink(event.target.value)}
              />
            </FormControl>
          )}
          {resourceTypeSelected === "dataset" && (
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <Typography
                  level="title-md"
                  endDecorator={<RequiredFieldIndicator />}
                >
                  Dataset host link
                </Typography>
              </FormLabel>
              <Input
                required
                name="external-link"
                value={datasetExternalLink}
                onChange={(event) => setDatasetExternalLink(event.target.value)}
              />
            </FormControl>
          )}
          {resourceTypeSelected === "dataset" && (
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <Typography level="title-md">
                  Dataset direct download link
                </Typography>
              </FormLabel>
              <Input
                name="direct-download-link"
                value={directDownloadLink}
                onChange={(event) => setDirectDownloadLink(event.target.value)}
              />
            </FormControl>
          )}
          {resourceTypeSelected === "dataset" && (
            <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
              <FormLabel>
                <Typography level="title-md">Dataset size</Typography>
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
                <Typography
                  level="title-sm"
                  endDecorator={
                    <Tooltip
                      placement="top-start"
                      variant="outlined"
                      arrow
                      title={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            maxWidth: 320,
                            justifyContent: "center",
                            p: 1,
                          }}
                        >
                          <Typography level="title-sm" sx={{ pb: 1 }}>
                            This is a link to the notebook on GitHub you would
                            like featured for this Knowledge Element
                          </Typography>
                          <Typography level="body-sm">
                            {`You must link to one specific notebook for 
                            our notebook preview to function correctly, but when the notebook is 
                            opened on the I-GUIDE Platform the entire repo will be copied to the 
                            user's environment. An example link may look like "https://github.com/
                            <username>/<repo_name>/blob/<branch_name>/<notebook_name>.ipynb"
                            `}
                          </Typography>
                        </Box>
                      }
                      size="lg"
                    >
                      <InfoOutlined size="lg" />
                    </Tooltip>
                  }
                >
                  <Typography
                    level="title-md"
                    endDecorator={<RequiredFieldIndicator />}
                  >
                    Jupyter Notebook GitHub URL
                  </Typography>
                </Typography>
              </FormLabel>
              <Input
                required
                name="notebook-url"
                placeholder="https://github.com/<username>/<repo_name>/blob/<branch_name>/<notebook_name>.ipynb"
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
                <Typography level="title-md">
                  Educational resource external links
                </Typography>
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
                    <th style={{ width: "37%" }} align="left">
                      Title
                    </th>
                    <th style={{ width: "8%" }} align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {oerExternalLinks.map((x, i) => (
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
                            onClick={() => handleRemovingOneOerExternalLink(i)}
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
                        <Option value="oer">Open Educational Resources</Option>
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
                        variant="outlined"
                        onClick={handleOerExternalLinkSearchTitle}
                      >
                        <SearchIcon />
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
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={handleAddingOneOerExternalLink}
                        style={{ marginTop: "4px", cursor: "pointer" }}
                        color="primary"
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Grid>
          )}

          <Typography level="h3" sx={{ pt: 1 }}>
            Related elements
          </Typography>
          {/* Related elements */}
          <Grid sx={{ gridColumn: "1/-1" }}>
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
                {relatedResources.map((x, i) => (
                  <tr key={i}>
                    <td align="left">
                      <p>{RESOURCE_TYPE_NAMES[x.type]}</p>
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
                          handleRelatedResourceTitleInputChange(newInputValue);
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
              <Typography level="title-md">Spatial coverage</Typography>
            </FormLabel>
            <ArrayInput
              array={spatialCoverage}
              setArray={setSpatialCoverage}
              placeholder="Philadelphia, Pennsylvania, United States"
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
            <FormLabel>
              <Typography level="title-md">Geometry</Typography>
            </FormLabel>
            <Input
              placeholder="POLYGON((-80 25, -65 18, -64 33, -80 25))"
              value={geometry}
              onChange={(event) => setGeometry(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
            <FormLabel>
              <Typography level="title-md">Bounding Box</Typography>
            </FormLabel>
            <Input
              placeholder="ENVELOPE(-111.1, -104.0, 45.0, 40.9)"
              value={boundingBox}
              onChange={(event) => setBoundingBox(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
            <FormLabel>
              <Typography level="title-md">Centroid</Typography>
            </FormLabel>
            <Input
              placeholder="46.4218,-94.087"
              value={centroid}
              onChange={(event) => setCentroid(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
            <FormLabel>
              <Typography level="title-md">Georeferenced</Typography>
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
              <Typography level="title-md">Temporal coverage</Typography>
            </FormLabel>
            <ArrayInput
              array={temporalCoverage}
              setArray={setTemporalCoverage}
              placeholder="Late 20th century"
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
            <FormLabel>
              <Typography level="title-md">Index years</Typography>
            </FormLabel>
            <ArrayInput
              array={indexYears}
              setArray={setIndexYears}
              placeholder="1980"
            />
          </FormControl>

          <CardActions sx={{ gridColumn: "1/-1" }}>
            <Button type="submit" variant="solid" color="primary">
              {submissionType === "update"
                ? "Update this contribution"
                : "Submit this contribution"}
            </Button>
          </CardActions>
        </CardContent>
      </form>
    </Card>
  );
}
