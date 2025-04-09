import React, { useState } from "react";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import MessageBubble from "./MessageBubble";
import SearchInput from "./SearchInput";

import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";
import {
  fetchLlmSearchResult,
  fetchLlmSearchMemoryId,
} from "../../utils/DataRetrieval";
import { SampleChats } from "./SampleChats";

const DO_NOT_USE_LLM_ENDPOINT = import.meta.env.VITE_DO_NOT_USE_LLM_ENDPOINT;

async function fetchMemoryIdForNewConversation() {
  const llmMemory =
    DO_NOT_USE_LLM_ENDPOINT === "true" ? {} : await fetchLlmSearchMemoryId();

  if (llmMemory === "ERROR") {
    setError(true);
    return;
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
  setWaitingForResponse
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
    setMemoryId(newMemoryId);
    result = await fetchLlmSearchResult(input, newMemoryId);
  } else {
    result = await fetchLlmSearchResult(input, memoryId);
  }

  if (!result) {
    alert("Error getting response from I-GUIDE AI.");
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

export default function SearchPane(props) {
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

  const [memoryId, setMemoryId] = useState("");
  const [chatMessages, setChatMessages] = useState(startingChat);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);

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
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
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
          {waitingForResponse && (
            <Typography level="body-sm">Thinking...</Typography>
          )}
        </Stack>
      </Box>
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
            setWaitingForResponse
          );
        }}
      />
    </Sheet>
  );
}
