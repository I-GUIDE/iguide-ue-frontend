import React, { useState, useEffect, useRef } from "react";

import { GraphCanvas, useSelection } from "reagraph";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";

import SimpleInfoCard from "./SimpleInfoCard";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ConnectedGraph(props) {
  const nodes = props.nodes;
  const edges = props.edges;
  const elementId = props.elementId;
  const elementBoxStyle = props.elementBoxStyle;
  const draggable = props.draggable;

  const graphRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);

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

  return (
    <div>
      {selectedElement && selectedElement.id !== elementId && (
        <Box style={elementBoxStyle}>
          <Tooltip title="Open in new window">
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
          </Tooltip>
        </Box>
      )}
      <GraphCanvas
        ref={graphRef}
        nodes={nodes}
        edges={edges}
        edgeArrowPosition="none"
        labelType="nodes"
        selections={selections}
        actives={actives}
        draggable={draggable}
        layoutType="forceDirected2d"
        onCanvasClick={(canvas) => handleCanvasClick(canvas)}
        onNodeClick={(node) => handleNodeClick(node)}
      />
    </div>
  );
}
