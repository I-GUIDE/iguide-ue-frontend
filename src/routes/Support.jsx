import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";

export default function Support() {
  usePageTitle("Support");

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Container maxWidth="md">
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
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              backgroundColor: "inherit",
              px: { xs: 2, md: 4 },
              pt: 4,
              pb: 8,
            }}
          >
            <Grid xs={12}>
              <Stack
                spacing={3}
                alignItems={{ xs: "flex-start", md: "center" }}
                sx={{ p: 2 }}
              >
                <Typography level="h2">Have a question?</Typography>
              </Stack>

              <Divider sx={{ mx: 2, my: 4 }} />

              <Typography level="body-md" sx={{ p: 2 }}>
                Please email{" "}
                <Link
                  href="mailto:help@i-guide.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  help@i-guide.io
                </Link>{" "}
                for help or reporting bugs.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
