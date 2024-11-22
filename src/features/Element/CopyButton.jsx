import React, { useState } from "react";

import Tooltip from "@mui/joy/Tooltip";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Snackbar from "@mui/joy/Snackbar";
import Typography from "@mui/joy/Typography";

import LinkIcon from "@mui/icons-material/Link";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function CopyButton(props) {
  const textToCopy = props.textToCopy;
  TEST_MODE && console.log("text to copy", textToCopy);

  const [copied, setCopied] = useState(false);

  if (!textToCopy) {
    return null;
  }

  async function copyText(textToCopy) {
    try {
      // This function only works when the server is under HTTPS
      await navigator.clipboard.writeText(textToCopy);
      TEST_MODE && console.log("Content copied to clipboard", textToCopy);
      setCopied(true);
    } catch (err) {
      TEST_MODE && console.error("Failed to copy: ", err);
      setCopied(false);
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", py: 1 }}>
      <Tooltip title="Copy element URL" placement="top" arrow>
        <IconButton
          variant="outlined"
          size="sm"
          onClick={() => copyText(textToCopy)}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Snackbar
        autoHideDuration={3000}
        open={copied}
        variant="soft"
        color="primary"
        size="md"
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ maxWidth: 360 }}
      >
        <Typography level="body-md">Element URL copied!</Typography>
      </Snackbar>
    </Box>
  );
}
