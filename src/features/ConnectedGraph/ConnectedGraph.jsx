import { useState, useRef, useEffect } from "react";

import { GraphCanvas, useSelection } from "reagraph";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";

import SimpleInfoCard from "../../components/SimpleInfoCard";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ConnectedGraph(props) {
  const nodes = props.nodes;
  const edges = props.edges;
  const elementId = props.elementId;
  const elementBoxStyle = props.elementBoxStyle;
  const draggable = props.draggable;

  const graphRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Check if WebGL2 is supported
  const [webGL2Available, setWebGL2Available] = useState(false);
  useEffect(() => {
    // Function to check WebGL2 support
    const checkWebGL2 = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");

      // If context is null, WebGL2 is not supported
      if (context) {
        setWebGL2Available(true);
      } else {
        setWebGL2Available(false);
      }
    };

    checkWebGL2();
  }, []);

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

  if (!webGL2Available) {
    return (
      <Stack spacing={2}>
        <Typography level="title-md">
          The graph cannot be rendered because WebGL2 is either not supported or
          not enabled in your browser.
        </Typography>
        <Typography level="title-sm">
          You can visit this{" "}
          <Link
            href={"https://www.wikihow.com/Enable-Webgl"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            WikiHow page
          </Link>{" "}
          to see how to enable WebGL2 in your browser.
        </Typography>
      </Stack>
    );
  }

  return (
    <div>
      {selectedElement && selectedElement.id !== elementId && (
        <Box style={elementBoxStyle}>
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
              cardtype={selectedElement.type}
              pageId={selectedElement.id}
              title={selectedElement.title}
              thumbnailImage={selectedElement.thumbnail}
              minHeight="100%"
              width="100%"
              showElementType
            />
          </Box>
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
