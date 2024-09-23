import React, { useState, useEffect } from "react";

import { useOutletContext } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";

import SubmissionStatusCard from "./SubmissionStatusCard";

import { fetchWithAuth } from "../utils/FetcherWithJWT";
import { checkTokens } from "../utils/UserManager";
import { PERMISSIONS } from "../configs/Permissions";

import { fetchADocumentation } from "../utils/DataRetrieval";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function DocEditCard(props) {
  const docName = props.docName;

  useEffect(() => {
    checkTokens();
  }, []);

  const { localUserInfo } = useOutletContext();

  const [docContents, setDocContents] = useState();
  const [submissionStatus, setSubmissionStatus] = useState("no submission");
  const [elementURI, setElementURI] = useState();

  // If the submission type is 'update', load the existing element information.
  useEffect(() => {
    const fetchDocData = async () => {
      const thisElement = await fetchADocumentation(docName);

      setDocContents(thisElement);
    };
    fetchDocData();
  }, [docName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {};

    data["contents"] = docContents;

    TEST_MODE && console.log("data to be submitted", data);

    const response = await fetchWithAuth(
      `${USER_BACKEND_URL}/api/documentations/${docName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    TEST_MODE && console.log("Documentation returned", result.message);

    if (result && result.message === "Element updated successfully") {
      setSubmissionStatus("update-succeeded");
    } else {
      setSubmissionStatus("update-failed");
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
  const isAdmin = localUserInfo.role < PERMISSIONS["edit_all"];
  if (!isAdmin) {
    return <SubmissionStatusCard submissionStatus="unauthorized" />;
  }

  let cardTitle = "";
  if (isAdmin) {
    cardTitle = "Edit this element as an admin";
  } else {
    cardTitle = "You are not authroized to edit this page";
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
      <Typography level="title-lg">
        Update the documentation - "{docName}"
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
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
              Content <RequiredFieldIndicator />
            </FormLabel>
            <div data-color-mode="light">
              <MDEditor
                height={400}
                value={docContents}
                onChange={(value) => {
                  setDocContents(value);
                }}
              />
            </div>
          </FormControl>
          <CardActions sx={{ gridColumn: "1/-1" }}>
            <Button type="submit" variant="solid" color="primary">
              Update
            </Button>
          </CardActions>
        </CardContent>
      </form>
    </Card>
  );
}
