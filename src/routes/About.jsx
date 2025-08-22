import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import { NO_HEADER_BODY_HEIGHT, PT_OFFSET } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";
import { DocRetriever } from "../utils/DataRetrieval";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function About() {
  usePageTitle("About");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [docList, setDocList] = useState();

  const itemsPerPage = 20;

  useEffect(() => {
    async function retrieveDocs() {
      try {
        const data = await DocRetriever(0, itemsPerPage);
        TEST_MODE && console.log("docs returned", data);

        setDocList(data.documentation);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    retrieveDocs();
  }, []);

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
              pt: PT_OFFSET,
              pb: 8,
            }}
          >
            <Grid xs={12}>
              <Stack
                spacing={3}
                alignItems={{ xs: "flex-start", md: "center" }}
                sx={{ p: 2 }}
              >
                <Typography level="h2">About I-GUIDE Platform</Typography>
              </Stack>
              <Divider sx={{ mx: 2, my: 4 }} />
              <Typography level="body-md" sx={{ p: 2 }}>
                <Typography fontWeight="lg">What:</Typography> The I-GUIDE
                Platform provides an open science and collaborative environment
                for geospatial data-intensive convergence research and education
                focused on sustainability and resilience challenges and enabled
                by advanced cyberGIS and cyberinfrastructure.
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                <Typography fontWeight="lg">Who:</Typography> Geospatial and
                sustainability research and education communities.
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                <Typography fontWeight="lg">Why:</Typography> Support convergent
                knowledge sharing and discovery through connecting diverse
                digital knowledge elements at scale.
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                <Typography fontWeight="lg">How:</Typography> Democratize access
                to advanced cyberGIS & cyberinfrastructure and cutting-edge
                geospatial AI & data science capabilities.
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                <Typography fontWeight="lg">Uniqueness:</Typography> Advanced
                cyberGIS and cyberinfrastructure, cutting-edge geospatial AI and
                data science capabilities, FAIR data principles, convergent
                approaches to sustainability challenges.
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                To learn more about using the I-GUIDE Platform, check out{" "}
                <Link component={RouterLink} to="/docs/getting-started">
                  Getting Started
                </Link>
                .
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                To learn more about the NSF Institute for Geospatial
                Understanding through an Integrative Discovery Environment
                (I-GUIDE), explore our work, and find out out about upcoming
                events, check our website at:{" "}
                <Link
                  href="https://i-guide.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  i-guide.io
                </Link>
                .
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
