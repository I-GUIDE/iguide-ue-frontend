import { Suspense } from "react";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import { lazyWithRetryAndReload } from "../../helpers/lazyWithRetryAndReload";
const ElementsMapContainer = lazyWithRetryAndReload(() =>
  import("../ElementsMap/ElementsMapContainer")
);
import {
  processPoint,
  processPolygon,
} from "../ElementsMap/elementsMapHelpers";

export default function InteractiveMap(props) {
  const centroid = props.centroid;
  const geometry = props.geometry;
  const boundingBox = props.boundingBox;

  if (!centroid) {
    return null;
  }
  const centroidLeaflet = processPoint(centroid);
  // Centroid has to be present
  if (!centroidLeaflet) {
    return null;
  }

  const geometryLeaflet = processPolygon(geometry);
  const boundingBoxLeaflet = processPolygon(boundingBox);

  const defaultZoom = 9;
  // Southwest and northeast bounds. Prevent the same map area from showing more than once
  const maxBounds = [
    [-85, -179],
    [85, 179],
  ];
  const maxBoundsViscosity = 1.0;
  const minZoom = 5;

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography level="h5" fontWeight="lg" mb={1}>
        Interactive Map
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          border: "solid 1px #e1e1e1",
          width: "100%",
          position: "relative",
        }}
      >
        <Suspense fallback={<p>Loading the map...</p>}>
          <ElementsMapContainer
            startingCenter={centroidLeaflet}
            startingZoom={defaultZoom}
            maxBounds={maxBounds}
            maxBoundsViscosity={maxBoundsViscosity}
            minZoom={minZoom}
            disabledScrollWheelZoom
            elementPageMode
            elementCentroid={centroidLeaflet}
            elementGeometry={geometryLeaflet}
            elementBoundingBox={boundingBoxLeaflet}
            style={{ height: 600, width: "100%" }}
          />
        </Suspense>
      </Box>
    </Stack>
  );
}
