import React from "react";

import { useOutletContext } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import { PERMISSIONS } from "../configs/Permissions";

import SearchPane from "../features/LlmSearch/SearchPane";
import usePageTitle from "../hooks/usePageTitle";
import LoginCard from "../components/LoginCard";

export default function LlmSearch() {
  usePageTitle("Smart search");

  const { isAuthenticated, localUserInfo } = useOutletContext();

  // If the user is not authenticated/logged in, they will be redirected to the login page
  if (!isAuthenticated) {
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
              <LoginCard />
            </Grid>
          </Box>
        </Container>
      </CssVarsProvider>
    );
  }

  const canAccessLLMSearch = localUserInfo?.role <= PERMISSIONS["edit_all"];
  if (!canAccessLLMSearch) {
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
              <Typography>
                You don't have permission to access this page.
              </Typography>
            </Grid>
          </Box>
        </Container>
      </CssVarsProvider>
    );
  }
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
          <SearchPane />
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
