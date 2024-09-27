import React, { useState, useEffect } from "react";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/material/Grid2";

import MessageBubble from "./MessageBubble";
import LlmSearchInput from "./LlmSearchInput";

import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";
import { fetchLlmSearchResult } from "../../utils/DataRetrieval";
import SimpleInfoCard from "../../components/SimpleInfoCard";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

// Get llm search result and update chatMessages array
async function getLlmSearchResult(
  input,
  memoryId,
  chatMessages,
  setChatMessages
) {
  const newId = chatMessages.length + 1;
  const newIdString = newId.toString();

  const currentChatMessage = chatMessages.concat({
    id: newIdString,
    sender: "You",
    content: input,
    timestamp: "Just now",
  });

  setChatMessages(currentChatMessage);

  const result = await fetchLlmSearchResult(input, memoryId);
  TEST_MODE && console.log("Question", input, memoryId, result);
  TEST_MODE && console.log("Response", result);

  if (!result) {
    alert("Error getting response from I-GUIDE AI.");
    return;
  }

  const answer = result.answer;
  const messageId = result.message_id;
  const elementList = result.elements;
  const count = result.count;

  const currentChatMessageWithResponse = currentChatMessage.concat({
    id: messageId,
    sender: "I-GUIDE AI",
    content: answer,
    elements: elementList,
    timestamp: "Just now",
  });
  setChatMessages(currentChatMessageWithResponse);
}

export default function LlmSearchPane(props) {
  const chat = props.chat;
  const memoryId = props.memoryId;

  const [chatMessages, setChatMessages] = useState(chat.messages);
  const [searchInputValue, setSearchInputValue] = useState("");

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
                <Stack direction="column">
                  <MessageBubble
                    variant={isYou ? "sent" : "received"}
                    {...message}
                  />
                  <Grid
                    container
                    spacing={3}
                    columns={12}
                    sx={{ flexGrow: 1 }}
                    justifyContent="flex-start"
                  >
                    {message.elements?.map((element) => (
                      <Grid key={element.id} size={{ xs: 3 }}>
                        <SimpleInfoCard
                          cardtype={element["resource-type"] + "s"}
                          pageId={element.id}
                          title={element.title}
                          thumbnailImage={element["thumbnail-image"]}
                          minHeight="100%"
                          width="100%"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <LlmSearchInput
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        onSubmit={() => {
          getLlmSearchResult(
            searchInputValue,
            memoryId,
            chatMessages,
            setChatMessages
          );
        }}
      />
    </Sheet>
  );
}
