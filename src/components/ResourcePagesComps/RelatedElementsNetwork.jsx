import React, { useState, useEffect, useRef } from "react";

import { GraphCanvas, useSelection } from "reagraph";

import { useTheme } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";

import SimpleInfoCard from "../SimpleInfoCard";

import { fetchNeighbors } from "../../utils/DataRetrieval";
import { RESOURCE_TYPE_COLORS } from "../../configs/VarConfigs";

export default function RelatedElementsNetwork(props) {
  const elementId = props.elementId;

  const graphRef = useRef(null);
  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();
  const [noRelatedElements, setNoRelatedElements] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const htmlColors = {
    dataset: `${theme.palette.primary[300]}`,
    notebook: `${theme.palette.success[300]}`,
    publication: `${theme.palette.warning[300]}`,
    oer: `${theme.palette.danger[300]}`,
    map: `${theme.palette.neutral[300]}`,
    any: `${theme.palette.neutral[300]}`,
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

  const { selections, actives, onNodeClick, onCanvasClick } = useSelection({
    ref: graphRef,
    nodes: nodes,
    edges: edges,
    pathSelectionType: "all",
  });

  // If there are no nodes, return null
  if (!nodes || !edges) {
    return null;
  }

  //  When there are no related elements, return null
  if (noRelatedElements) {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography level="h5" fontWeight="lg" mb={1}>
        Related elements network (Beta)
      </Typography>
      <Divider inset="none" />
      <Typography color="neutral" level="body-sm" variant="plain">
        Right click or long press the node to view the element
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          border: "solid 1px gold",
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
          selections={selections}
          actives={actives}
          onCanvasClick={onCanvasClick}
          onNodeClick={onNodeClick}
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
