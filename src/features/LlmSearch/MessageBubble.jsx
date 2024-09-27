import React, { useState, useEffect } from "react";

import MDEditor from "@uiw/react-md-editor";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/joy/Divider";

import SimpleInfoCard from "../../components/SimpleInfoCard";

export default function MessageBubble(props) {
  const variant = props.variant;
  const messageBody = props.messageBody;
  const sender = props.sender;
  const isSent = variant === "sent";

  const answer = messageBody.answer;
  const elements = messageBody.elements;

  return (
    <Box sx={{ maxWidth: "75%", minWidth: "auto" }}>
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
              {answer}
            </Typography>
          ) : (
            <>
              <div className="container" data-color-mode="light">
                <MDEditor.Markdown source={answer} />
              </div>
            </>
          )}
          {elements && elements.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Grid
                container
                spacing={1}
                columns={12}
                sx={{ flexGrow: 1 }}
                justifyContent="flex-start"
              >
                {elements?.map((element) => (
                  <Grid key={element._id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <SimpleInfoCard
                      cardtype={element["resource-type"] + "s"}
                      pageId={element._id}
                      title={element.title}
                      thumbnailImage={element["thumbnail-image"]}
                      minHeight="100%"
                      width="100%"
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Sheet>
      </Box>
    </Box>
  );
}
