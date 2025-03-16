import React, { useState } from "react";

import Tooltip from "@mui/joy/Tooltip";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Snackbar from "@mui/joy/Snackbar";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const DEEP_TEST_MODE = import.meta.env.VITE_DEEP_TEST_MODE;

export default function CopyButton(props) {
  const textToCopy = props.textToCopy;
  const tooltipText = props.tooltipText;
  const successText = props.successText;
  const icon = props.icon;
  DEEP_TEST_MODE && console.log("text to copy", textToCopy);

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
      <Tooltip title={tooltipText} placement="top" arrow>
        <Badge
          variant="plain"
          color="success"
          size="sm"
          badgeContent={<CheckCircleIcon />}
          invisible={!copied}
        >
          <IconButton
            variant="outlined"
            size="sm"
            color={copied ? "success" : "neutral"}
            onClick={() => copyText(textToCopy)}
          >
            {icon}
          </IconButton>
        </Badge>
      </Tooltip>
      <Snackbar
        autoHideDuration={3000}
        open={copied}
        variant="soft"
        color="success"
        size="md"
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Typography level="body-md">{successText}</Typography>
      </Snackbar>
    </Box>
  );
}
