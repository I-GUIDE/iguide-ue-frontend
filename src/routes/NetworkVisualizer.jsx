import React, { useState, useEffect, lazy, Suspense } from "react";

import { useTheme, CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";

const ConnectedGraph = lazy(() => import("../components/ConnectedGraph"));
import { NO_HEADER_BODY_HEIGHT, NAVBAR_HEIGHT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";
import { fetchConnectedGraph } from "../utils/DataRetrieval";
import { stringTruncator } from "../helpers/helper";

export default function NetworkVisualizer() {
  usePageTitle("Explore Knowledge Network");

  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();
  const [noRelatedElements, setNoRelatedElements] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    const htmlColors = {
      dataset: `${theme.palette.primary[300]}`,
      notebook: `${theme.palette.success[300]}`,
      publication: `${theme.palette.warning[300]}`,
      oer: `${theme.palette.danger[300]}`,
      map: `${theme.palette.neutral[300]}`,
      any: `${theme.palette.neutral[300]}`,
    };

    async function retrieveNeighbors() {
      try {
        const data = await fetchConnectedGraph();

        const returnedNodes = data.nodes.map((node) => ({
          id: node.id,
          label: stringTruncator(node.title, 0, 25, "..."),
          title: node.title,
          thumbnail: node["thumbnail-image"],
          type: node["resource-type"],
          fill: htmlColors[node["resource-type"]],
        }));

        if (!returnedNodes || returnedNodes.length === 0) {
          setNoRelatedElements(true);
        } else {
          setNoRelatedElements(false);
        }

        const returnedEdges = data.neighbors?.map((edge) => ({
          id: edge.src + "-" + edge.dst,
          source: edge.src,
          target: edge.dst,
          size: 2,
        }));

        setNodes(returnedNodes);
        setEdges(returnedEdges);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    retrieveNeighbors();
  }, [theme]);

  // If there are no nodes, return null
  if (!nodes || !edges) {
    return null;
  }

  //  When there are no related elements, return null
  if (noRelatedElements) {
    return null;
  }

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
            <Box
              style={{
                zIndex: 9,
                position: "absolute",
                top: NAVBAR_HEIGHT + 20,
                left: 20,
                background: "rgba(0, 0, 0, .5)",
                color: "white",
              }}
            >
              <Box
                sx={{
                  background: "#fff",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Typography level="body-xs">
                  * Only the elements with connections are displayed.
                </Typography>
              </Box>
            </Box>
            <Suspense fallback={<p>Loading element network...</p>}>
              <ConnectedGraph
                nodes={nodes}
                edges={edges}
                draggable
                elementBoxStyle={{
                  zIndex: 9,
                  position: "absolute",
                  top: NAVBAR_HEIGHT + 20,
                  right: 20,
                  background: "rgba(0, 0, 0, .5)",
                  color: "white",
                }}
              />
            </Suspense>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
