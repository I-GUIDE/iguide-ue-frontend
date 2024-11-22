import React from "react";

import Tooltip from "@mui/joy/Tooltip";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";

import LinkIcon from "@mui/icons-material/Link";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function CopyButton(props) {
  const textToCopy = props.textToCopy;
  TEST_MODE && console.log("text to copy", textToCopy);

  if (!textToCopy) {
    return null;
  }

  async function copyText(textToCopy) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      TEST_MODE && console.log("Content copied to clipboard", textToCopy);
    } catch (err) {
      TEST_MODE && console.error("Failed to copy: ", err);
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", py: 1 }}>
      <Tooltip title="Copy the link">
        <IconButton
          variant="outlined"
          size="sm"
          onClick={() => copyText(textToCopy)}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
