import React, { useState, useEffect, lazy, Suspense } from "react";

import { useTheme } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

const ConnectedGraph = lazy(() => import("../ConnectedGraph/ConnectedGraph"));

import { fetchNeighbors } from "../../utils/DataRetrieval";
import { stringTruncator } from "../../helpers/helper";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function RelatedElementsNetwork(props) {
  const elementId = props.elementId;
  const tabTitle = props.tabTitle || "Related elements network";
  const depth = props.depth || 2;

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

    async function retrieveNeighbors(elementId, depth) {
      try {
        const data = await fetchNeighbors(elementId, depth);

        const returnedNodes = data.nodes?.map((node) => ({
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

        returnedNodes.push({
          id: elementId,
          label: "This element",
          fill: "#ff0000",
        });

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

    if (elementId) {
      retrieveNeighbors(elementId, depth);
    }
  }, [elementId, depth, theme]);

  // If there are no nodes, return null
  if (!nodes || !edges) {
    return null;
  }

  //  When there are no related elements, return null
  if (noRelatedElements) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading related element graph...</div>}>
      <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Typography level="h5" fontWeight="lg" mb={1}>
          {tabTitle}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            border: "solid 1px #e1e1e1",
            height: 700,
            width: "100%",
            position: "relative",
          }}
        >
          <ConnectedGraph
            nodes={nodes}
            edges={edges}
            elementId={elementId}
            elementBoxStyle={{
              zIndex: 9,
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(0, 0, 0, .5)",
              color: "white",
            }}
          />
        </Box>
      </Stack>
    </Suspense>
  );
}
