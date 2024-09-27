import React, { useState, useEffect } from "react";

import MDEditor from "@uiw/react-md-editor";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

export default function MessageBubble(props) {
  const content = props.content;
  const elementList = props.elementList;
  const variant = props.variant;
  const sender = props.sender;
  const isSent = variant === "sent";

  return (
    <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", mb: 0.25 }}
      >
        <Typography level="body-xs">{sender}</Typography>
      </Stack>

      <Box sx={{ position: "relative" }}>
        <Sheet
          color={isSent ? "primary" : "neutral"}
          variant={isSent ? "solid" : "outlined"}
          sx={[
            {
              p: 1.25,
              borderRadius: "lg",
            },
            isSent
              ? {
                  borderTopRightRadius: 0,
                }
              : {
                  borderTopRightRadius: "lg",
                },
            isSent
              ? {
                  borderTopLeftRadius: "lg",
                }
              : {
                  borderTopLeftRadius: 0,
                },
            isSent
              ? {
                  backgroundColor: "var(--joy-palette-primary-solidBg)",
                }
              : {
                  backgroundColor: "background.body",
                },
          ]}
        >
          {isSent ? (
            <Typography
              level="body-sm"
              sx={{ color: "var(--joy-palette-common-white)" }}
            >
              {content}
            </Typography>
          ) : (
            <>
              <div className="container" data-color-mode="light">
                <MDEditor.Markdown source={content} />
              </div>
            </>
          )}
        </Sheet>
      </Box>
    </Box>
  );
}
