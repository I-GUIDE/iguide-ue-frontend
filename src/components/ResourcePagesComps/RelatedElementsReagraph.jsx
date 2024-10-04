import React, { useState, useEffect, useRef } from "react";

import { GraphCanvas } from "reagraph";

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";

export default function RelatedElementsReagraph(props) {
  const elementId = props.elementId;
  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const graphRef = useRef(null);

  useEffect(() => {
    async function retrieveNeighbors(elementId) {
      try {
        // const data = await fetchNeighbors(elementId);
        const data = {
          elements: [
            {
              id: "1",
              label: "1",
              "resource-type": "notebook",
              color: "#e04141",
            },
            {
              id: "2",
              label: "2",
              "resource-type": "notebook",
              color: "#e04141",
            },
            {
              id: "3",
              label: "3",
              "resource-type": "notebook",
              color: "#e04141",
            },
          ],
          connections: [
            {
              id: "1-2",
              source: "1",
              target: "2",
            },
            {
              id: "2-3",
              source: "2",
              target: "3",
            },
          ],
        };

        setNodes(data.elements);
        setEdges(data.connections);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    retrieveNeighbors(elementId);
  }, [elementId]);

  if (!nodes || !edges) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          border: "solid 1px red",
          height: 700,
          width: "100%",
          margin: 15,
          position: "relative",
        }}
      >
        <GraphCanvas
          ref={graphRef}
          nodes={nodes}
          edges={edges}
          contextMenu={function ({
            data,
            onCollapse,
            isCollapsed,
            canCollapse,
            onClose,
          }) {
            return (
              <div
                style={{
                  background: "white",
                  width: 300,
                  border: "solid 1px blue",
                  borderRadius: 2,
                  padding: 5,
                  textAlign: "center",
                }}
              >
                <Card variant="soft">
                  <CardContent>
                    <Typography level="title-md">Placeholder</Typography>
                    <Typography>Description of the card.</Typography>
                    <Button onClick={onClose}>Close Card</Button>
                  </CardContent>
                </Card>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
