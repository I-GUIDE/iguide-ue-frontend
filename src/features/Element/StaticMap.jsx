import { Suspense } from "react";

import { lazyWithRetryAndReload } from "../../helpers/lazyWithRetryAndReload";
// Lazy load react-zoom-pan-pinch
const MiniMap = lazyWithRetryAndReload(() =>
  import("react-zoom-pan-pinch").then((module) => ({ default: module.MiniMap }))
);
const TransformWrapper = lazyWithRetryAndReload(() =>
  import("react-zoom-pan-pinch").then((module) => ({
    default: module.TransformWrapper,
  }))
);
const TransformComponent = lazyWithRetryAndReload(() =>
  import("react-zoom-pan-pinch").then((module) => ({
    default: module.TransformComponent,
  }))
);

import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";

export default function StaticMap(props) {
  const mapImg = props.mapImg;

  if (!mapImg || mapImg === "") {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography level="h5" fontWeight="lg" mb={1}>
        Pannable Map
      </Typography>
      <Typography color="neutral" level="body-xs" variant="plain">
        Click{" "}
        <Link href={mapImg.original} target="_blank" rel="noopener noreferrer">
          here
        </Link>{" "}
        to view the map in new window.
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
        <Suspense fallback={<p>Loading map...</p>}>
          <TransformWrapper>
            <div>
              <div
                style={{
                  position: "absolute",
                  zIndex: 5,
                  bottom: "20px",
                  left: "20px",
                  border: "solid 2px black",
                }}
              >
                <MiniMap width={300}>
                  <img
                    width="100%"
                    src={mapImg.low}
                    loading="lazy"
                    alt="static map"
                  />
                </MiniMap>
              </div>
              <TransformComponent>
                <img
                  width="100%"
                  src={mapImg.original}
                  loading="lazy"
                  alt="static map"
                />
              </TransformComponent>
            </div>
          </TransformWrapper>
        </Suspense>
      </Box>
    </Stack>
  );
}
