import React, { useState, useEffect, useRef } from "react";

import { GraphCanvas, recommendLayout } from "reagraph";
import { useTheme } from "@mui/joy/styles";

import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";

import SimpleInfoCard from "../SimpleInfoCard";

import { fetchNeighbors } from "../../utils/DataRetrieval";
import { RESOURCE_TYPE_COLORS } from "../../configs/VarConfigs";

export default function RelatedElementsNetwork(props) {
  const elementId = props.elementId;
  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const graphRef = useRef(null);

  const theme = useTheme();
  const htmlColors = {
    dataset: `${theme.palette.primary[500]}`,
    notebook: `${theme.palette.success[500]}`,
    publication: `${theme.palette.warning[500]}`,
    oer: `${theme.palette.danger[500]}`,
    map: `${theme.palette.neutral[500]}`,
    any: `${theme.palette.neutral[500]}`,
  };

  useEffect(() => {
    async function retrieveNeighbors(elementId) {
      try {
        const data = await fetchNeighbors(elementId);

        let returnedNodes = data.nodes?.map((node) => ({
          id: node.id,
          label: node.title,
          thumbnail: node["thumbnail-image"],
          type: node["resource-type"],
          fill: htmlColors[node["resource-type"]],
        }));

        returnedNodes.push({
          id: elementId,
          label: "This element",
          fill: "#000",
        });

        const returnedEdges = data.neighbors?.map((edge) => ({
          id: edge.src + "-" + edge.dst,
          source: edge.src,
          target: edge.dst,
        }));

        setNodes(returnedNodes);
        setEdges(returnedEdges);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    if (elementId) {
      retrieveNeighbors(elementId);
    }
  }, [elementId]);

  // If there are no nodes, return null
  if (!nodes || !edges) {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          border: "solid 1px",
          height: 700,
          width: "100%",
          position: "relative",
        }}
      >
        <GraphCanvas
          ref={graphRef}
          nodes={nodes}
          edges={edges}
          animated={false}
          edgeArrowPosition="none"
          labelType="nodes"
          contextMenu={function ({ data, onClose }) {
            if (data.id !== elementId) {
              return (
                <Box
                  sx={{
                    background: "white",
                    width: "100%",
                    border: "solid 1px black",
                    minWidth: 250,
                    textAlign: "center",
                  }}
                >
                  <SimpleInfoCard
                    cardtype={data.type}
                    pageId={data.id}
                    title={data.label}
                    thumbnailImage={data.thumbnail}
                    minHeight="100%"
                    width="100%"
                    disableReactRouter
                    showElementType
                  />
                  <Button
                    color={RESOURCE_TYPE_COLORS[data.type]}
                    size="sm"
                    sx={{ my: 1, mx: 0.5 }}
                  >
                    <Link
                      underline="none"
                      href={"/" + data.type + "s/" + data.id}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "inherit" }}
                    >
                      Open
                    </Link>
                  </Button>
                  <Button
                    color={RESOURCE_TYPE_COLORS[data.type]}
                    size="sm"
                    variant="outlined"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </Box>
              );
            }
          }}
        />
      </Box>
    </Stack>
  );
}
