import React, { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Stack from "@mui/joy/Stack";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import usePageTitle from "../hooks/usePageTitle";
import SearchBar from "../components/SearchBar";
import { SitemapErrorPage } from "../components/Sitemap";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import { sendBugToSlack } from "../utils/AutomaticBugReporting";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ErrorPage(props) {
  const errorStatusText = props.customStatusText;
  const isAuthenticated = props.isAuthenticated;
  const localUserInfo = props.localUserInfo;

  usePageTitle("Error");
  const navigate = useNavigate();

  const error = useRouteError();
  error && console.error("Error from useRouteError:", error);

  let errorType = "";
  let errorMessage = "";

  const errorTitle = "Something went wrong...";
  let errorSubtitle =
    'Please try again later, or you can report this issue to us using the "Contact Us" link.';

  // Check error types
  if (isRouteErrorResponse(error)) {
    errorType = "0";
    errorMessage = error.error?.message || error.statusText;
    errorSubtitle =
      'Please double-check the URL and make sure it is correct, or you can report this issue to us using the "Contact Us" link.';
  } else if (error instanceof Error) {
    errorType = "1";
    errorMessage = `${error.name}: ${error.message}`;
  } else if (typeof error === "string") {
    errorType = "2";
    errorMessage = error;
  } else {
    errorType = "3";
    errorMessage = errorStatusText ?? "No error message...";
  }

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
      * Affiliation: ${localUserInfo?.affiliation}.
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
            <Card
              variant="outlined"
              orientation="horizontal"
              sx={{
                "&:hover": {
                  boxShadow: "md",
                  borderColor: "neutral.outlinedHoverBorder",
                },
                maxWidth: "700px",
              }}
            >
              <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
                <Stack
                  spacing={2}
                  sx={{
                    p: 1,
                    display: "flex",
                  }}
                >
                  <Typography level="h2">{errorTitle}</Typography>
                  <Typography level="body-md">{errorSubtitle}</Typography>
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
                  <SitemapErrorPage
                    isAuthenticated={isAuthenticated}
                    localUserInfo={localUserInfo}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
