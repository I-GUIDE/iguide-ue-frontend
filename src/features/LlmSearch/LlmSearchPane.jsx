import React, { useState, useEffect } from "react";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";

import MessageBubble from "./MessageBubble";
import LlmSearchInput from "./LlmSearchInput";

import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";
import { fetchLlmSearchResult } from "../../utils/DataRetrieval";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function LlmSearchPane(props) {
  const chat = props.chat;
  const memoryId = props.memoryId;

  const [chatMessages, setChatMessages] = useState(chat.messages);
  const [searchInputValue, setSearchInputValue] = useState("");

  useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

  async function getLlmSearchResult(input, mid) {
    const result = await fetchLlmSearchResult(input, mid);
    TEST_MODE && console.log("Llm response", input, mid, result);

    let answer = "";
    let messageId = "";
    let elementList = [];

    if (!result) {
      alert("Error getting response from I-GUIDE AI.");
      return;
    }

    if (result.ext) {
      answer = result.ext.retrieval_augmented_generation.answer;
      messageId = result.ext.retrieval_augmented_generation.message_id;
    }

    if (result.hits) {
      elementList = result.hits.hits;
    }

    setChatMessages([
      ...chatMessages,
      {
        id: messageId,
        sender: "I-GUIDE AI",
        content: answer,
        elements: elementList,
        timestamp: "Just now",
      },
    ]);
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
                  {...message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <LlmSearchInput
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        onSubmit={() => {
          const newId = chatMessages.length + 1;
          const newIdString = newId.toString();
          setChatMessages([
            ...chatMessages,
            {
              id: newIdString,
              sender: "You",
              content: searchInputValue,
              timestamp: "Just now",
            },
          ]);
          getLlmSearchResult(searchInputValue, memoryId);
        }}
      />
    </Sheet>
  );
}
