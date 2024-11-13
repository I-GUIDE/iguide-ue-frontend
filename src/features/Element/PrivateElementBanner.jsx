import React from "react";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import LockIcon from "@mui/icons-material/Lock";

export default function PrivateElementBanner(props) {
  const isPrivateElement = props.isPrivateElement;

  // Don't display this banner at all if it's not a private element.
  if (!isPrivateElement) {
    return null;
  }

  return (
    <Stack sx={{ px: { xs: 2, md: 4 }, pt: 1 }}>
      <Typography
        variant="soft"
        color="warning"
        startDecorator={<LockIcon />}
        sx={{ fontSize: "sm", "--Typography-gap": "0.5rem", p: 1 }}
      >
        This element is only visible to you.
      </Typography>
    </Stack>
  );
}
