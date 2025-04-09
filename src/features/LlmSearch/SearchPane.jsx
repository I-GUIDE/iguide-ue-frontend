import React, { useState } from "react";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";

import MessageBubble from "./MessageBubble";
import SearchInput from "./SearchInput";

import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";
import { fetchLlmSearchResult } from "../../utils/DataRetrieval";
import { Typography } from "@mui/material";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

// Get llm search result and update chatMessages array
async function getLlmSearchResult(
  input,
  memoryId,
  chatMessages,
  setChatMessages,
  setWaitingForResponse
) {
  const newId = chatMessages.length + 1;
  const newIdString = newId.toString();

  const currentChatMessage = chatMessages.concat({
    message_id: newIdString,
    sender: "You",
    answer: input,
  });

  setWaitingForResponse(true);
  setChatMessages(currentChatMessage);

  const result = await fetchLlmSearchResult(input, memoryId);
  TEST_MODE && console.log("Question", input, memoryId, "Response", result);

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
  const startingChat = props.startingChat;
  const memoryId = props.memoryId;

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
            chatMessages,
            setChatMessages,
            setWaitingForResponse
          );
        }}
      />
    </Sheet>
  );
}
