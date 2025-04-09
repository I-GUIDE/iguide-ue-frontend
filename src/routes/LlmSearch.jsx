import React, { useState, useEffect } from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import { SampleChats } from "../features/LlmSearch/SampleChats";
import { fetchLlmSearchMemoryId } from "../utils/DataRetrieval";

import SearchPane from "../features/LlmSearch/SearchPane";
import usePageTitle from "../hooks/usePageTitle";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const DO_NOT_USE_LLM_ENDPOINT = import.meta.env.VITE_DO_NOT_USE_LLM_ENDPOINT;

export default function LlmSearch() {
  usePageTitle("Smart search");

  const [memoryId, setMemoryId] = useState();
  const [error, setError] = useState(false);

  // Greetings from I-GUIDE
  const starterChat = [
    [
      {
        message_id: "0",
        answer: "Hi! What can I help you today :)",
        sender: "I-GUIDE AI",
      },
    ],
  ];
  const startingChat =
    DO_NOT_USE_LLM_ENDPOINT === "true" ? SampleChats[0] : starterChat[0];

  useEffect(() => {
    async function fetchMemoryId() {
      const llmMemory =
        DO_NOT_USE_LLM_ENDPOINT === "true"
          ? {}
          : await fetchLlmSearchMemoryId();
      TEST_MODE && console.log("llm memory returned", llmMemory);

      if (llmMemory === "ERROR") {
        setError(true);
        return;
      }

      setMemoryId(llmMemory.memoryId);
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
          <SearchPane startingChat={startingChat} memoryId={memoryId} />
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
