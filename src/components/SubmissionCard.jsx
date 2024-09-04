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

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

import SubmissionStatusCard from "./SubmissionStatusCard";

import { fetchWithAuth } from "../utils/FetcherWithJWT";
import { checkTokens } from "../utils/UserManager";

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
  useEffect(() => {
    checkTokens();
  }, []);

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

  const [
    isAuthenticated,
    setIsAuthenticated,
    userInfo,
    setUserInfo,
    localUserInfo,
    setLocalUserInfo,
  ] = useOutletContext();

  const [elementURI, setElementURI] = useState();

  const [title, setTitle] = useState();
  const [tags, setTags] = useState();
  const [authors, setAuthors] = useState();
  const [contents, setContents] = useState();

  const [datasetExternalLink, setDatasetExternalLink] = useState();
  const [directDownloadLink, setDirectDownloadLink] = useState();
  const [dataSize, setDataSize] = useState();

  const [notebookFile, setNotebookFile] = useState();
  const [notebookRepo, setNotebookRepo] = useState();
  const [notebookGitHubUrl, setNotebookGitHubUrl] = useState();

  const [publicationDOI, setPublicationDOI] = useState();

  const [contributor, setContributor] = useState();

  // If the submission type is 'update', load the existing element information.
  useEffect(() => {
    const fetchData = async () => {
      const thisElement = await fetchSingleElementDetails(elementId);

      setElementURI("/" + thisElement["resource-type"] + "s/" + elementId);
      setTitle(thisElement.title);
      setResourceTypeSelected(thisElement["resource-type"]);
      setTags(thisElement.tags.join(", "));
      setAuthors(thisElement.authors.join(", "));
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

      setContributor(thisElement["contributor-id"]);

      let relatedResourcesArray = [];
      thisElement["related-datasets"].map((re) =>
        relatedResourcesArray.push({
          type: re["resource-type"],
          title: re.title,
        })
      );
      thisElement["related-notebooks"].map((re) =>
        relatedResourcesArray.push({
          type: re["resource-type"],
          title: re.title,
        })
      );
      thisElement["related-publications"].map((re) =>
        relatedResourcesArray.push({
          type: re["resource-type"],
          title: re.title,
        })
      );
      thisElement["related-oers"].map((re) =>
        relatedResourcesArray.push({
          type: re["resource-type"],
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

  const handleResourceTypeChange = (event, newResourceType) => {
    setResourceTypeSelected(newResourceType);
  };

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
    console.log("Removing one, now: ", relatedResources, idx);
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
    console.log("Added one, now: ", oerExternalLinks);
  };

  const handleRemovingOneOerExternalLink = (idx) => {
    let newArray = [...oerExternalLinks];
    newArray.splice(idx, 1);
    setOerExternalLinks(newArray);
    console.log("Removing one, now: ", oerExternalLinks);
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
      console.log("search return", data.title);
      setCurrentOerExternalLinkTitle(data.title);
    }
  };

  const handleAutofillPublicationInfo = async () => {
    if (!publicationDOI || publicationDOI === "") {
      alert("Please enter the DOI first. Thank you!");
      return;
    }

    const metadataDOI = await getMetadataByDOI(publicationDOI);
    console.log("pub metadata", metadataDOI);

    if (!metadataDOI) {
      return;
    }

    // If we couldn't fetch the metadata via Crossref, do this...
    if (metadataDOI === "Publication not found") {
      alert(
        "We could not fetch the publication based on the DOI you provided. That could be due to the DOI not registered on Crossref or you have a typo in the DOI. If the DOI is correct, please manually input the publication metadata. Thank you!"
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

    data.metadata = { created_by: userInfo.sub };
    data["related-resources"] = relatedResources;

    if (resourceTypeSelected === "oer") {
      data["oer-external-links"] = oerExternalLinks;
    }

    console.log("data to be submitted", data);

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
      console.log("Element update msg returned", result.message);

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
      console.log("initial submission, msg", result);
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

  // If the user is not the contributor, deny access to the update form.
  if (submissionType === "update" && localUserInfo && localUserInfo.openid) {
    if (!contributor || localUserInfo.openid !== contributor) {
      return <SubmissionStatusCard submissionStatus="unauthorized" />;
    }
  }

  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: "max-content",
        width: "100%",
      }}
    >
      <Typography level="title-lg">
        {submissionType === "update"
          ? "Update your contribution"
          : "Submit a new " + RESOURCE_TYPE_NAMES[elementType].toLowerCase()}
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
          {resourceTypeSelected === "publication" && (
            <FormControl sx={{ gridColumn: "1/-1" }}>
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
                  DOI (required)
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
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Element title (required)</FormLabel>
            <Input
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Authors (comma-separated) (required)</FormLabel>
            <Input
              name="authors"
              placeholder="Author 1, Author 2, ..."
              required
              value={authors}
              onChange={(event) => setAuthors(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Tags (comma-separated) (required)</FormLabel>
            <Input
              name="tags"
              placeholder="Tag 1, Tag 2, ..."
              required
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Abstract (required)</FormLabel>
            <Textarea
              name="contents"
              minRows={4}
              maxRows={10}
              required
              value={contents}
              onChange={(event) => setContents(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Upload thumbnail image {"(< 5MB)"} (required)</FormLabel>
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              variant="outlined"
              color="primary"
              name="thumbnail-image"
            >
              Upload an image
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
          {resourceTypeSelected === "dataset" && (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Dataset host link (required)</FormLabel>
              <Input
                required
                name="external-link"
                value={datasetExternalLink}
                onChange={(event) => setDatasetExternalLink(event.target.value)}
              />
            </FormControl>
          )}
          {resourceTypeSelected === "dataset" && (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Dataset direct download link</FormLabel>
              <Input
                name="direct-download-link"
                value={directDownloadLink}
                onChange={(event) => setDirectDownloadLink(event.target.value)}
              />
            </FormControl>
          )}
          {resourceTypeSelected === "dataset" && (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Dataset size</FormLabel>
              <Input
                name="size"
                value={dataSize}
                onChange={(event) => setDataSize(event.target.value)}
              />
            </FormControl>
          )}
          {resourceTypeSelected === "notebook" && (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Jupyter Notebook GitHub URL (required)</FormLabel>
              <Input
                required
                name="notebook-url"
                value={notebookGitHubUrl}
                onChange={(event) => setNotebookGitHubUrl(event.target.value)}
              />
            </FormControl>
          )}

          {/* Related elements */}
          <Grid sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Related elements</FormLabel>
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

          {/* External links */}
          {resourceTypeSelected === "oer" && (
            <Grid sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Educational resource external links</FormLabel>
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
