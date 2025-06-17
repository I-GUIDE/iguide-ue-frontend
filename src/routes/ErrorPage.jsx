import { useEffect } from "react";

import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
  Link as RouterLink,
} from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import usePageTitle from "../hooks/usePageTitle";
import SearchBar from "../components/SearchBar";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import { sendBugToSlack } from "../utils/AutomaticBugReporting";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ErrorPage(props) {
  const customStatusText = props.customStatusText;
  const isAuthenticated = props.isAuthenticated;
  const localUserInfo = props.localUserInfo;
  // Status code displayed on the error page, if status code is not provided, use 500 unless otherwise set in the script below
  let statusCode = props.statusCode ?? 500;

  usePageTitle("Error");
  const navigate = useNavigate();

  const error = useRouteError();
  error && console.error("Error from useRouteError:", error);

  let errorType = "";
  let errorMessage = "";

  let errorExplanation =
    'Please try again later, or you can report this issue to us using the "Contact Us" link.';

  // Check error types
  if (isRouteErrorResponse(error)) {
    errorType = "0";
    statusCode = 404;
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorType = "1";
    errorMessage = `${error.name}: ${error.message}`;
  } else if (typeof error === "string") {
    errorType = "2";
    errorMessage = error;
  } else {
    errorType = "3";
    errorMessage = customStatusText ?? "No error message...";
  }

  if (statusCode === 403) {
    errorExplanation =
      "You don't have permission to view this page. If you believe this is a mistake, please contact us for assistance.";
  } else if (statusCode === 404) {
    errorExplanation =
      "Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you may have typed the URL incorrectly.";
  }

  TEST_MODE &&
    console.log("Error type", errorType, "Error message", errorMessage);

  var currentTime = new Date();
  currentTime.toUTCString();
  const currentUrl = window.location.href;

  let msgToBeSent = `
  *An error occurred!*
    *Error info*:
      * Type: ${errorType},
      * Message: ${errorMessage},
      * Time: ${currentTime},
      * URL: ${currentUrl}
    *User Info*:`;

  if (isAuthenticated) {
    msgToBeSent += `
      * Logged in: ${isAuthenticated},
      * First name: ${localUserInfo?.["first_name"]},
      * Last name: ${localUserInfo?.["last_name"]},
      * Email: ${localUserInfo?.email},
      * Affiliation: ${localUserInfo?.affiliation},
      * UserId: ${localUserInfo?.id}.
    `;
  } else {
    msgToBeSent += `
      * Logged in: ${isAuthenticated}.
    `;
  }

  useEffect(() => {
    const noReportingErrorTypes = ["0"];

    async function sendMessages() {
      TEST_MODE && console.log("Error message to be sent:", msgToBeSent);
      sendBugToSlack(msgToBeSent);
    }

    // Set a timer for unwanted double requests...
    const timer = setTimeout(() => {
      if (msgToBeSent && !noReportingErrorTypes.includes(errorType)) {
        sendMessages();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [msgToBeSent, errorType]);

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
            display="flex"
            justifyContent="center"
            alignItems="center"
            direction="column"
            sx={{
              minHeight: NO_HEADER_BODY_HEIGHT,
              backgroundColor: "inherit",
              px: { xs: 2, md: 4 },
              pt: 4,
              pb: 8,
            }}
          >
            <Stack
              spacing={3}
              sx={{
                p: 1,
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography level="h1">{statusCode}</Typography>
              <Typography level="h4">{errorMessage}</Typography>
              <Typography level="body-md">{errorExplanation}</Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                useFlexGap
                sx={{ p: 0.5 }}
              >
                <Button
                  component="a"
                  href="/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="solid"
                  color="warning"
                  size="sm"
                  endDecorator={<OpenInNewIcon />}
                >
                  Contact Us
                </Button>
                <Button
                  component="a"
                  href="/"
                  variant="outlined"
                  color="neutral"
                  size="sm"
                >
                  Homepage
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(-1)}
                  size="sm"
                >
                  Go Back
                </Button>
              </Stack>
              <SearchBar placeholder="Search elements..." />
              <Typography level="title-md" style={{ textAlign: "center" }}>
                <Link component={RouterLink} to="/sitemap">
                  Or see our site map {">"}
                </Link>
              </Typography>
            </Stack>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
