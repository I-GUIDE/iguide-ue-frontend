import React, { useState, useEffect, lazy, Suspense } from "react";

import { useOutletContext } from "react-router";

import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";

import SubmissionStatusCard from "../ElementSubmission/SubmissionStatusCard";
const HTMLEditor = lazy(() => import("../../components/HTMLEditor"));

import { fetchWithAuth } from "../../utils/FetcherWithJWT";
import { checkTokens } from "../../utils/UserManager";
import { PERMISSIONS } from "../../configs/Permissions";

import { fetchADocumentation } from "../../utils/DataRetrieval";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function DocEditCard(props) {
  const docId = props.docId;
  const submissionType = props.submissionType;

  useEffect(() => {
    checkTokens();
  }, []);

  const { localUserInfo, isAuthenticated } = useOutletContext();

  const [docName, setDocName] = useState("");
  const [docContent, setDocContent] = useState("");

  const [submissionStatus, setSubmissionStatus] = useState("no-submission");
  const [docURI, setDocURI] = useState();

  const [error, setError] = useState("");

  // If the submission type is 'update', load the existing element information.
  useEffect(() => {
    const fetchDocData = async () => {
      const docObject = await fetchADocumentation(docId);

      if (!docObject.ok) {
        setError(docObject.body);
        TEST_MODE &&
          console.log("Error from fetchADocumentation():", docObject.body);
        return;
      }

      const thisDoc = docObject.body;
      TEST_MODE && console.log("Returned doc", thisDoc);
      setDocName(thisDoc.name);
      setDocContent(thisDoc.content);
      setDocURI("/docs/" + docId);
    };
    if (submissionType === "update") {
      fetchDocData();
    }
  }, [docId, submissionType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {};

    data["name"] = docName;
    data["content"] = docContent;

    TEST_MODE && console.log("data to be submitted", data);

    if (submissionType === "initial") {
      const response = await fetchWithAuth(
        `${USER_BACKEND_URL}/api/documentation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      TEST_MODE && console.log("Response - new doc", result);

      if (result && result.message === "Documentation added successfully") {
        setSubmissionStatus("initial-succeeded");
        if (result.id) {
          setDocURI("/docs/" + result.id);
        }
      } else {
        setSubmissionStatus("initial-failed");
      }
    } else if (submissionType === "update") {
      const response = await fetchWithAuth(
        `${USER_BACKEND_URL}/api/documentation/${docId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      TEST_MODE && console.log("Response - update doc", result);

      if (result && result.message === "Documentation updated successfully") {
        setSubmissionStatus("update-succeeded");
      } else {
        setSubmissionStatus("update-failed");
      }
    }
  };

  if (error) {
    return (
      <ErrorPage
        customStatusText={error}
        isAuthenticated={isAuthenticated}
        localUserInfo={localUserInfo}
      />
    );
  }

  // After submission, show users the submission status.
  if (submissionStatus !== "no-submission") {
    return (
      <SubmissionStatusCard
        submissionStatus={submissionStatus}
        submissionType={submissionType}
        elementURI={docURI}
      />
    );
  }

  if (!localUserInfo) {
    return null;
  }

  // Check if the current user is admin, if yes, allow edit
  const canEditAllElements = localUserInfo.role <= PERMISSIONS["edit_all"];
  if (!canEditAllElements) {
    return <SubmissionStatusCard submissionStatus="error-unauthorized" />;
  }

  let cardTitle = "";
  if (submissionType === "initial") {
    cardTitle = "Create a new documentation";
  } else {
    cardTitle = `Update the documentation - ${docName}`;
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
      <Typography level="title-lg">{cardTitle}</Typography>
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
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
              <Typography
                level="title-md"
                endDecorator={<RequiredFieldIndicator />}
              >
                Title
              </Typography>
              <Typography color="danger">
                (Please make sure this title is not taken! We are still fixing
                an issue caused by duplicate titles)
              </Typography>
            </FormLabel>
            <Input
              name="name"
              required
              value={docName}
              onChange={(event) => setDocName(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
              Content <RequiredFieldIndicator />
            </FormLabel>
            <Suspense fallback={<div>Loading markdown editor...</div>}>
              <HTMLEditor contents={docContent} setContents={setDocContent} />
            </Suspense>
          </FormControl>
          <CardActions sx={{ gridColumn: "1/-1" }}>
            <Button type="submit" variant="solid" color="primary">
              {submissionType === "initial" ? "Submit" : "Update"}
            </Button>
          </CardActions>
        </CardContent>
      </form>
    </Card>
  );
}
