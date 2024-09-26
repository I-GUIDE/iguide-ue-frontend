import React, { useState, useEffect } from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import { sampleChats } from "../features/LlmSearch/sampleChats";

import LlmSearchPane from "../features/LlmSearch/LlmSearchPane";

export default function LlmSearch() {
  const [selectedChat, setSelectedChat] = useState(sampleChats[0]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          component="main"
          sx={{
            minHeight: NO_HEADER_BODY_HEIGHT,
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "100%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <LlmSearchPane chat={selectedChat} />
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
