import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";

import { getHomepageElements } from "../utils/DataRetrieval";
import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import RelatedElementsNetwork from "../components/ResourcePagesComps/RelatedElementsNetwork";
import usePageTitle from "../hooks/usePageTitle";
import ErrorPage from "../ErrorPage";

export default function NetworkVisualizer() {
  usePageTitle("Element Network");

  const [thisElement, setThisElement] = useState();
  const [generate, setGenerate] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function retrievethisElements() {
      try {
        const data = await getHomepageElements("dataset", 1);
        console.log("data", data);
        setThisElement(data[0]);
      } catch (error) {
        setError(error);
      }
    }
    retrievethisElements();
  }, [generate]);

  if (!thisElement) {
    return null;
  }

  if (error) {
    return (
      <ErrorPage customStatus="404" customStatusText="Element Not Found" />
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
              <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                <Typography level="title-lg" mb={1}>
                  {`Element name: ${thisElement.title}`}
                </Typography>
                <Typography level="body-sm" mb={1}>
                  (This page is still under development)
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Link
                    component={RouterLink}
                    to={`/datsets/${thisElement.id}`}
                  >
                    View this element
                  </Link>
                  <Button
                    variant="outlined"
                    size="sm"
                    color="success"
                    onClick={() => setGenerate(generate + 1)}
                  >
                    See another network
                  </Button>
                </Stack>
              </Stack>
              <RelatedElementsNetwork elementId={thisElement.id} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
