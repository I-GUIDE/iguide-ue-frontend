import React from "react";

import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";

export default function FloatingButton(props) {
  const onClick = props.onClick;
  const label = props.label;

  return (
    <Tooltip title="Take a tour of the homepage" variant="solid">
      <Button
        variant="soft"
        size="lg"
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          borderRadius: "999px",
          textTransform: "none",
          paddingX: 3,
          paddingY: 1,
          fontSize: "16px",
          zIndex: 1000,
          borderWidth: 2,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", // custom shadow
          "&:hover": {
            borderColor: "darkblue",
            transform: "translateY(-2px)",
            boxShadow: "0px 10px 24px rgba(0, 0, 0, 0.35)", // stronger shadow on hover
          },
        }}
      >
        {label}
      </Button>
    </Tooltip>
  );
}
