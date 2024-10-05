import React, { useState, useEffect, useRef } from "react";

import { GraphCanvas, useSelection } from "reagraph";

import { useTheme } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import SimpleInfoCard from "../SimpleInfoCard";

import { fetchNeighbors } from "../../utils/DataRetrieval";
import { RESOURCE_TYPE_COLORS } from "../../configs/VarConfigs";
import { stringTruncator } from "../../helpers/helper";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function RelatedElementsNetwork(props) {
  const elementId = props.elementId;

  const graphRef = useRef(null);
  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();
  const [noRelatedElements, setNoRelatedElements] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

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
      retrieveNeighbors(elementId);
    }
  }, [elementId]);

  const { selections, actives, onNodeClick, onCanvasClick } = useSelection({
    ref: graphRef,
    nodes: nodes,
    edges: edges,
    pathSelectionType: "all",
  });

  function handleNodeClick(node) {
    setSelectedElement(node);
    onNodeClick(node);
    TEST_MODE && console.log("clicked", node);
  }

  function handleCanvasClick(canvas) {
    setSelectedElement(null);
    onCanvasClick(canvas);
    TEST_MODE && console.log("clicked canvas");
  }

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
        {selectedElement && selectedElement.id !== elementId && (
          <Box
            style={{
              zIndex: 9,
              position: "absolute",
              top: 5,
              right: 5,
              background: "rgba(0, 0, 0, .5)",
              color: "white",
            }}
          >
            <Box
              sx={{
                background: "#fff",
                width: "100%",
                minWidth: 250,
                textAlign: "center",
              }}
            >
              <Typography level="title-md">Selected element</Typography>
              <SimpleInfoCard
                cardtype={selectedElement.type + "s"}
                pageId={selectedElement.id}
                title={selectedElement.title}
                thumbnailImage={selectedElement.thumbnail}
                minHeight="100%"
                width="100%"
                openInNewTab
                showElementType
              />
            </Box>
          </Box>
        )}
        <GraphCanvas
          ref={graphRef}
          nodes={nodes}
          edges={edges}
          animated={false}
          edgeArrowPosition="none"
          labelType="nodes"
          selections={selections}
          actives={actives}
          onCanvasClick={(canvas) => handleCanvasClick(canvas)}
          onNodeClick={(node) => handleNodeClick(node)}
        />
      </Box>
    </Stack>
  );
}
