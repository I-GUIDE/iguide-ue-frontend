import React, { useState, useRef, useEffect } from "react";

import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

import MessageBubble from "./MessageBubble";
import SearchInput from "./SearchInput";

import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";
import {
  streamLlmSearchResult,
  fetchLlmSearchMemoryId,
} from "../../utils/DataRetrieval";

const DO_NOT_USE_LLM_ENDPOINT = import.meta.env.VITE_DO_NOT_USE_LLM_ENDPOINT;

async function fetchMemoryIdForNewConversation() {
  const llmMemory =
    DO_NOT_USE_LLM_ENDPOINT === "true" ? {} : await fetchLlmSearchMemoryId();

  if (llmMemory === "ERROR") {
    return "ERROR";
  }

  return llmMemory.memoryId;
}

// Get llm search result and update chatMessages array
async function getLlmSearchResult(
  input,
  memoryId,
  setMemoryId,
  chatMessages,
  setChatMessages,
  setWaitingForResponse,
  setStatus
) {
  let result;
  const newId = chatMessages.length + 1;
  const newIdString = newId.toString();

  const currentChatMessage = chatMessages.concat({
    message_id: newIdString,
    sender: "You",
    answer: input,
  });

  setWaitingForResponse(true);
  setChatMessages(currentChatMessage);

  if (!memoryId) {
    const newMemoryId = await fetchMemoryIdForNewConversation();
    // When memory id cannot be generated
    if (newMemoryId === "ERROR") {
      alert("Error initializing I-GUIDE AI.");
      setWaitingForResponse(false);
      return;
    }
    setMemoryId(newMemoryId);
    result = await streamLlmSearchResult(input, newMemoryId, setStatus);
  } else {
    result = await streamLlmSearchResult(input, memoryId, setStatus);
  }

  if (!result) {
    alert("Error getting response from I-GUIDE AI.");
    setWaitingForResponse(false);
    return;
  }

  const answer = result.answer;
  const messageId = result.message_id;
  const elementList = result.elements;
  const count = result.count;

  const currentChatMessageWithResponse = currentChatMessage.concat({
    message_id: messageId,
    sender: "I-GUIDE AI",
    answer: answer,
    elements: elementList,
  });
  setChatMessages(currentChatMessageWithResponse);
  setWaitingForResponse(false);
}

export default function SearchPane() {
  const [memoryId, setMemoryId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [status, setStatus] = useState("");

  const scrollRef = useRef(null);

  // Scroll to the bottom whenever the items change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Starting page
  if (chatMessages.length === 0) {
    return (
      <Box
        sx={{
          height: NO_HEADER_BODY_HEIGHT,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            level="h2"
            justifyContent="center"
            endDecorator={
              <Chip component="span" size="sm" color="primary">
                BETA
              </Chip>
            }
            sx={{
              p: 3,
            }}
          >
            I-GUIDE Platform Smart Search
          </Typography>
          <Typography
            level="h4"
            align="center"
            sx={{
              p: 3,
            }}
          >
            Hi! What can I help with today?
          </Typography>
          <SearchInput
            searchInputValue={searchInputValue}
            setSearchInputValue={setSearchInputValue}
            waitingForResponse={waitingForResponse}
            onSubmit={() => {
              getLlmSearchResult(
                searchInputValue,
                memoryId,
                setMemoryId,
                chatMessages,
                setChatMessages,
                setWaitingForResponse,
                setStatus
              );
            }}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Sheet
      sx={{
        height: NO_HEADER_BODY_HEIGHT,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "auto",
          flexDirection: "column",
          // Message box bottom fade out
          maskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 99.5%, rgba(0, 0, 0, 0) 100%)",
          // Message box bottom fade out for Webkit browsers (Safari)
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 99.5%, rgba(0, 0, 0, 0) 100%)",
          alignItems: "center",
        }}
        ref={scrollRef}
      >
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: "960px",
          }}
        >
          {chatMessages.map((message, index) => {
            const isYou = message.sender === "You";
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
              >
                {message.sender !== "You" && (
                  <Box
                    component="img"
                    sx={{ height: 40, mt: 1, px: 2 }}
                    alt="Logo"
                    src="/images/Logo-favicon.png"
                  />
                )}
                <MessageBubble
                  variant={isYou ? "sent" : "received"}
                  messageBody={message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <Box sx={{ px: 2, pb: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 960 }}>
          {waitingForResponse ? (
            <Typography level="body-sm" sx={{ pb: 2 }}>
              {status}
            </Typography>
          ) : (
            <Typography level="body-sm" sx={{ pb: 2 }}>
              &nbsp;
            </Typography>
          )}
          <SearchInput
            searchInputValue={searchInputValue}
            setSearchInputValue={setSearchInputValue}
            waitingForResponse={waitingForResponse}
            onSubmit={() => {
              getLlmSearchResult(
                searchInputValue,
                memoryId,
                setMemoryId,
                chatMessages,
                setChatMessages,
                setWaitingForResponse,
                setStatus
              );
            }}
          />
        </Box>
      </Box>
    </Sheet>
  );
}
