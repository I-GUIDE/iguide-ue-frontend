import * as React from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

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
          <TransformComponent>
            <img width="100%" src={mapImg} loading="lazy" alt="static map" />
          </TransformComponent>
        </TransformWrapper>
      </Box>
    </Stack>
  );
}
