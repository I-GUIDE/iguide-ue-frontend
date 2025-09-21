import { useState, useEffect, Suspense } from "react";

import { useTheme, CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";

import { lazyWithRetryAndReload } from "../helpers/lazyWithRetryAndReload";
const ConnectedGraph = lazyWithRetryAndReload(() =>
  import("../features/ConnectedGraph/ConnectedGraph")
);
import { NAVBAR_HEIGHT, PT_OFFSET } from "../configs/VarConfigs";
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
      <Meta />
      <Container maxWidth="lg">
        <Box
          component="main"
          sx={{
            height: "100vh",
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "100%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <Grid
            container
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-start"
            direction="column"
            sx={{
              height: "100vh",
              backgroundColor: "inherit",
              pt: PT_OFFSET,
              pb: 8,
            }}
          >
            <Box
              style={{
                zIndex: 9,
                position: "absolute",
                top: NAVBAR_HEIGHT + 20,
              }}
            >
              <Typography
                level="body-xs"
                sx={{
                  background: "rgba(256, 256, 256, .4)",
                }}
              >
                * Only the elements with connections are displayed.
              </Typography>
            </Box>
            <Suspense fallback={<p>Loading element network...</p>}>
              <ConnectedGraph
                nodes={nodes}
                edges={edges}
                draggable
                elementBoxStyle={{
                  zIndex: 10,
                  position: "absolute",
                  top: NAVBAR_HEIGHT + 40,
                  background: "rgba(0, 0, 0, .5)",
                  color: "white",
                }}
              />
            </Suspense>
            <Box
              sx={{
                position: "absolute",
                bottom: 5,
                left: 0,
                right: 0,
                px: 2,
                textAlign: "right",
              }}
            >
              <Typography
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  display: "inline-block",
                  px: 1,
                  fontSize: "11px",
                  borderRadius: "sm",
                }}
              >
                I-GUIDE Platform{" "}
                <Link
                  component="a"
                  href="/terms-of-use"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </Link>{" "}
                apply.
              </Typography>
            </Box>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
