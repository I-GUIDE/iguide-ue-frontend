import React from "react";

import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

import "../utils/UserManager";

export default function SubmissionStatusCard(props) {
  const submissionStatus = props.submissionStatus;
  const submissionType = props.submissionType;
  const elementURI = props.elementURI;

  let submissionStatusText = "";

  // Display the submission status
  switch (submissionStatus) {
    case "initial-succeeded":
      submissionStatusText =
        "Thank you for your contribution! You are all set!";
      break;
    case "initial-failed":
      submissionStatusText = "Submission failed. Please try again!";
      break;
    case "update-succeeded":
      submissionStatusText = "Thank you for your update! You are all set!";
      break;
    case "update-failed":
      submissionStatusText = "Your update failed. Please try again!";
      break;
    case "unauthorized":
      submissionStatusText =
        "You have to login as the contributor to update this element!";
      break;
    default:
      submissionStatusText = "Submission status unknown...";
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        position: "relative",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Card
        variant="outlined"
        orientation="horizontal"
        sx={{
          width: "100%",
          "&:hover": {
            boxShadow: "md",
            borderColor: "neutral.outlinedHoverBorder",
          },
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
            <Typography level="h4">{submissionStatusText}</Typography>
          </Box>
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            useFlexGap
            sx={{ p: 0.5 }}
          >
            <Button component="a" href="/" variant="outlined" color="neutral">
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
            {submissionStatus !== "unauthorized" && elementURI && (
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
