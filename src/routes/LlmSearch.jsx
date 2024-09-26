import React, { useState, useEffect } from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import { sampleChats } from "../features/LlmSearch/sampleChats";
import { fetchLlmSearchMemoryId } from "../utils/DataRetrieval";

import LlmSearchPane from "../features/LlmSearch/LlmSearchPane";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function LlmSearch() {
  const [selectedChat, setSelectedChat] = useState(sampleChats[0]);
  const [memoryId, setMemoryId] = useState();

  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchMemoryId() {
      const LlmMemory = await fetchLlmSearchMemoryId();
      // const LlmMemory = {};
      TEST_MODE && console.log("memory returned", LlmMemory);

      if (LlmMemory === "ERROR") {
        setError(true);
        return;
      }

      setMemoryId(LlmMemory.memoryId);
    }
    fetchMemoryId();
  }, []);

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
          <LlmSearchPane chat={selectedChat} memoryId={memoryId} />
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
