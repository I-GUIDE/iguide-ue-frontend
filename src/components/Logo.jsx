import React from "react";

import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

export default function Logo(props) {
  const sx = props.sx;
  return (
    <Typography
      level="h1"
      textColor={"#000"}
      sx={sx}
      endDecorator={
        <Chip component="span" size="sm" color="primary">
          BETA
        </Chip>
      }
      justifyContent="center"
    >
      <Stack
        direction={{ sx: "column", sm: "row" }}
        spacing={0}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
        className="tourid-0"
      >
        <img src="/images/iguide-word-color.png" alt="I-GUIDE" />
        <img src="/images/platform-word-gray.png" alt="Platform" />
      </Stack>
    </Typography>
  );
}
