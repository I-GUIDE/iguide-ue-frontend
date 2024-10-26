import React from "react";

import { useOutletContext } from "react-router-dom";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";

import LoginCard from "../components/LoginCard";
import DocEditCard from "../components/DocEditCard";
import usePageTitle from "../hooks/usePageTitle";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";

export default function DocSubmission() {
  usePageTitle("Create Documentation");

  const { isAuthenticated } = useOutletContext();

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
            <DocEditCard submissionType="initial" />
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
