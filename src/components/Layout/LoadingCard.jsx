import React from "react";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

export default function LoadingCard(props) {
  const title = props.title;
  const content = props.content;

  return (
    <Box
      sx={{
        maxWidth: 800,
        position: "relative",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Card
        variant="plain"
        orientation="horizontal"
        sx={{
          width: "100%",
          bgcolor: "#fff",
        }}
      >
        <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
          <Box
            sx={{
              p: 0.5,
              display: "flex",
              gap: 1.5,
              "& > button": { flex: 1 },
            }}
          >
            <Stack spacing={2}>
              <Typography level="title-md">{title}</Typography>
              {content && <Typography level="body-md">{content}</Typography>}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
