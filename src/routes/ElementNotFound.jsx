import React from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";

import Header from "../components/Layout/Header";
import usePageTitle from "../hooks/usePageTitle";

import { DEFAULT_BODY_HEIGHT } from "../configs/VarConfigs";

export default function ElementNotFound() {
  usePageTitle("Datasets");

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header title="User profile update" subtitle="" />
      <Container maxWidth="xl">
        <Box
          component="main"
          sx={{
            minHeight: DEFAULT_BODY_HEIGHT,
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
              minHeight: DEFAULT_BODY_HEIGHT,
              backgroundColor: "inherit",
              px: { xs: 2, md: 4 },
              pt: 4,
              pb: 8,
            }}
          >
            <Typography>Element Not found</Typography>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
