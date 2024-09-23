import React from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";

import usePageTitle from "../hooks/usePageTitle";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";

export default function About() {
  usePageTitle("About");

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
            Future "About" page
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
