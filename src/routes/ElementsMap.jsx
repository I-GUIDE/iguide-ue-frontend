import { lazy, Suspense } from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";
const ElementsMapContainer = lazy(() =>
  import("../features/ElementsMap/ElementsMapContainer")
);

export default function ElementsMap() {
  usePageTitle("Element Map");

  const usCenter = [39.8283, -98.5795];
  const defaultZoom = 6;
  // Southwest and northeast bounds. Prevent the same map area from showing more than once
  const maxBounds = [
    [-85, -179],
    [85, 179],
  ];
  const maxBoundsViscosity = 1.0;
  const minZoom = 5;

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: NO_HEADER_BODY_HEIGHT,
          display: "grid",
          gridTemplateColumns: { xs: "auto", md: "100%" },
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
          sx={{
            minHeight: NO_HEADER_BODY_HEIGHT,
            backgroundColor: "inherit",
          }}
        >
          <Suspense fallback={<p>Loading the map...</p>}>
            <ElementsMapContainer
              startingCenter={usCenter}
              startingZoom={defaultZoom}
              maxBounds={maxBounds}
              maxBoundsViscosity={maxBoundsViscosity}
              minZoom={minZoom}
              addNoiseToCentroid
            />
          </Suspense>
        </Grid>
      </Box>
    </CssVarsProvider>
  );
}
