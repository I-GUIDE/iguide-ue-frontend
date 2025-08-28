import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";

import WarningIcon from "@mui/icons-material/Warning";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function SubmissionStatusCard(props) {
  const submissionStatus = props.submissionStatus;
  const statusText = props.submissionStatusText;
  // Provide a link to the existing element if submission fails due to duplicate DOI
  const extraComponent = props.extraComponent;
  const elementURI = props.elementURI;

  let submissionStatusText = "";
  let subText = "";
  let isWarning = false;
  let submissionSucceeded;

  TEST_MODE && console.log("Submission status", submissionStatus);

  // Do not render the status card if the status is "no-submission"
  if (submissionStatus === "no-submission") {
    return;
  }

  // Display the submission status
  switch (submissionStatus) {
    case "initial-succeeded":
      submissionStatusText =
        "Thank you for your contribution. You are all set.";
      submissionSucceeded = true;
      break;
    case "update-succeeded":
      submissionStatusText = "Thank you for the update. You are all set.";
      submissionSucceeded = true;
      break;

    case "update-succeeded-notebook-failed":
      submissionStatusText =
        "Thank you for the update. However, there's an issue that needs your attention.";
      subText =
        "We couldn't find your notebook using the GitHub link you provided. Please ensure there are no typos, and that the notebook is public and located on the default branch. We've updated the element for you, except for the notebook link.";
      isWarning = true;
      submissionSucceeded = true;
      break;

    case "initial-failed":
      submissionStatusText = "Submission failed: Rejected by the backend";
      subText =
        "Your submission is rejected by our backend. Please try again later or contact us.";
      isWarning = true;
      submissionSucceeded = false;
      break;

    case "update-failed":
      submissionStatusText = "Submission failed: Rejected by the backend";
      subText =
        "Your submission is rejected by our backend. Please try again later or contact us.";
      isWarning = true;
      submissionSucceeded = false;
      break;
    case "error-unauthorized":
      submissionStatusText = "You don't have permission to access this page.";
      subText =
        "If you believe you should have had the permission, please try logging in again before reaching out to us.";
      isWarning = true;
      submissionSucceeded = false;
      break;
    case "error-unauthorized-update-element":
      submissionStatusText = "You don't have permission to edit this element.";
      subText =
        "If you believe you should have had the permission, please try logging in again before reaching out to us.";
      isWarning = true;
      submissionSucceeded = false;
      break;
    case "error-unauthorized-initial-submission":
      submissionStatusText =
        "You don't have permission to contribute this type of elements.";
      subText =
        "If you believe you should have had the permission, please try logging in again before reaching out to us.";
      isWarning = true;
      submissionSucceeded = false;
      break;

    case "error-dataset-both-links-empty":
      submissionStatusText =
        "Submission failed: Both dataset host link and direct download link are blank.";
      subText =
        "You have to provide at least a dataset host link or a dataset direct download link.";
      isWarning = true;
      submissionSucceeded = false;
      break;

    case "error-initial-failed-duplicate-doi":
      submissionStatusText = "Submission failed: Duplicate DOI/URL.";
      subText =
        "The DOI or URL you provided has already been in another publication element we currently have.";
      isWarning = true;
      submissionSucceeded = false;
      break;

    case "error-unsaved-oer-link":
      submissionStatusText =
        "Submission failed: Unsaved educational resource external links";
      subText =
        'You have an unsaved "Educational resource external link" in the submission form. Please click the blue "check" button to save the external link before submitting your element.';
      isWarning = true;
      submissionSucceeded = false;
      break;

    case "error-uploading-thumbnail":
      submissionStatusText = "Submission failed: Cannot uploading thumbnails";
      subText =
        "We cannot upload the thumbnail due to a backend issue. Please try again later or contact us.";
      isWarning = true;
      submissionSucceeded = false;
      break;
    case "error-no-thumbnail":
      submissionStatusText =
        "Submission failed: A thumbnail is required for the element submission";
      subText =
        'Please submit a thumbnail for this element using the "Upload a thumbnail image" button.';
      isWarning = true;
      submissionSucceeded = false;
      break;

    case "error-cannot-find-github-file":
      submissionStatusText =
        "Submission failed: Cannot find the notebook on GitHub";
      subText = `We cannot find the GitHub notebook link you provided. Please ensure
      the link is correct and the repository is public.`;
      isWarning = true;
      submissionSucceeded = false;
      break;

    case "error-cannot-verify-github-repo-status":
      submissionStatusText =
        "Submission failed: Cannot verify GitHub repository link";
      subText = `We cannot verify the GitHub repository link you provided. Please ensure
      the link is correct and the repository is public. If the issue persists, the GitHub
      API may be temporarily unavailable. Please try again later.`;
      isWarning = true;
      submissionSucceeded = false;
      break;

    case "error-invalid-inputs":
      submissionStatusText = "Submission failed: Form input errors";
      subText = statusText;
      isWarning = true;
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
        variant="soft"
        orientation="horizontal"
        sx={{
          width: "100%",
          backgroundColor: "inherit",
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
            <Stack spacing={2} sx={{ alignItems: "center" }}>
              {isWarning && (
                <WarningIcon color="danger" sx={{ fontSize: 30 }} />
              )}
              <Typography level="title-lg">{submissionStatusText}</Typography>
              {subText && <Typography level="body-md">{subText}</Typography>}
              {!submissionSucceeded && (
                <Typography level="body-xs">
                  If the issue still persists, please use the link below to
                  reach us. Thanks.
                </Typography>
              )}
              {extraComponent}
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
