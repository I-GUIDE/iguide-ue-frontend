import * as React from "react";

import {
  MiniMap,
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";

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
        Map (Panable)
      </Typography>
      <Typography color="neutral" level="body-xs" variant="plain">
        Click{" "}
        <Link href={mapImg} target="_blank" rel="noopener noreferrer">
          here
        </Link>{" "}
        to view the static map in new window.
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
        <TransformWrapper>
          <div>
            <div
              style={{
                position: "absolute",
                zIndex: 5,
                top: "20px",
                right: "20px",
              }}
            >
              <MiniMap width={300}>
                <img
                  width="100%"
                  src={mapImg}
                  loading="lazy"
                  alt="static map"
                />
              </MiniMap>
            </div>
            <TransformComponent>
              <img width="100%" src={mapImg} loading="lazy" alt="static map" />
            </TransformComponent>
          </div>
        </TransformWrapper>
      </Box>
    </Stack>
  );
}
