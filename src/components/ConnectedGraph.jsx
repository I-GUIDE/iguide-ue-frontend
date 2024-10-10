import React, { useState, useEffect, useRef } from "react";

import { GraphCanvas, useSelection } from "reagraph";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import SimpleInfoCard from "./SimpleInfoCard";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ConnectedGraph(props) {
  const nodes = props.nodes;
  const edges = props.edges;
  const elementId = props.elementId;

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
    </div>
  );
}
