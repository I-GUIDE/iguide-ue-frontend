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
import ShuffleIcon from "@mui/icons-material/Shuffle";
import IconButton from "@mui/joy/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { getHomepageElements } from "../utils/DataRetrieval";
import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import RelatedElementsNetwork from "../components/ResourcePagesComps/RelatedElementsNetwork";
import usePageTitle from "../hooks/usePageTitle";
import ErrorPage from "../ErrorPage";
import { Tooltip } from "@mui/joy";

export default function NetworkVisualizer() {
  usePageTitle("Explore Knowledge Network");

  const [thisElement, setThisElement] = useState();
  const [generate, setGenerate] = useState(0);
  const [error, setError] = useState(false);

  const elementTypes = ["dataset", "notebook"];
  const elementType =
    elementTypes[Math.floor(Math.random() * elementTypes.length)];

  useEffect(() => {
    async function retrievethisElements() {
      try {
        const data = await getHomepageElements(elementType, 1);
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
                <Typography
                  level="h2"
                  mb={1}
                  endDecorator={
                    <Tooltip title="Show another network graph" placement="top">
                      <IconButton
                        variant="outlined"
                        size="md"
                        onClick={() => setGenerate(generate + 1)}
                      >
                        <ShuffleIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  Explore knowledge network
                </Typography>
                <Typography
                  level="title-lg"
                  mb={1}
                  endDecorator={
                    <Tooltip title="View this element" placement="top">
                      <IconButton
                        component={RouterLink}
                        to={`/${elementType}s/${thisElement.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  {thisElement.title}
                </Typography>
              </Stack>
              <RelatedElementsNetwork elementId={thisElement.id} tabTitle=" " />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
