import React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function SubmissionStatusCard(props) {
  const submissionStatus = props.submissionStatus;
  const subMessage = props.subMessage;
  const elementURI = props.elementURI;

  let submissionStatusText = "";
  let submissionSucceeded;

  // Display the submission status
  switch (submissionStatus) {
    case "initial-succeeded":
      submissionStatusText =
        "Thank you for your contribution. You are all set.";
      submissionSucceeded = true;
      break;
    case "initial-failed":
      submissionStatusText = "Submission failed. Please try again.";
      submissionSucceeded = false;
      break;
    case "initial-failed-duplicate":
      submissionStatusText = "Submission failed due to duplicate DOI/URL.";
      submissionSucceeded = false;
      break;
    case "update-succeeded":
      submissionStatusText = "Thank you for the update. You are all set.";
      submissionSucceeded = true;
      break;
    case "update-failed":
      submissionStatusText = "Update failed. Please try again.";
      submissionSucceeded = false;
      break;
    case "unauthorized":
      submissionStatusText = "You don't have permission to edit this element.";
      submissionSucceeded = false;
      break;
    default:
      submissionSucceeded = false;
      submissionStatusText = "Submission status unknown...";
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        position: "relative",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Card
        variant="plain"
        orientation="horizontal"
        sx={{
          width: "100%",
        }}
      >
        <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
          <Box
            sx={{
              p: 0.5,
              display: "flex",
              gap: 1.5,
              "& > button": { flex: 1 },
            }}
          >
            <Stack spacing={2}>
              <Typography level="h4">{submissionStatusText}</Typography>
              {subMessage}
            </Stack>
          </Box>
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 1.5 }}
          >
            {/* When submission failed, show Contact Us button */}
            {!submissionSucceeded && (
              <Tooltip title="Questions, help, or bug report" placement="top">
                <Button
                  component="a"
                  href="/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="danger"
                  endDecorator={<OpenInNewIcon />}
                >
                  Contact Us
                </Button>
              </Tooltip>
            )}

            {/* If submission succeeded, provide below links */}
            {submissionSucceeded && (
              <>
                <Button
                  component="a"
                  href="/"
                  variant="outlined"
                  color="neutral"
                >
                  Homepage
                </Button>
                <Button
                  component="a"
                  href="/user-profile"
                  variant="outlined"
                  color="primary"
                >
                  User profile
                </Button>
              </>
            )}
            {submissionSucceeded && elementURI && (
              <Button
                component="a"
                href={elementURI}
                variant="solid"
                color="primary"
              >
                View element
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
