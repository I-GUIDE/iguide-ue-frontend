import { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router";

import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";

import MessageBubble from "./MessageBubble";
import SearchInput from "./SearchInput";
import Logo from "../../components/Logo";
import { SampleChatHistory } from "./SampleChatHistory";

import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";
import {
  streamLlmSearchResult,
  fetchLlmSearchMemoryId,
} from "../../utils/DataRetrieval";
import { useAlertModal } from "../../utils/AlertModalProvider";
import SuggestedQuestions from "./SuggestedQuestions";

import myIcon from "./smart-logo.svg";

const DO_NOT_USE_LLM_ENDPOINT = import.meta.env.VITE_DO_NOT_USE_LLM_ENDPOINT;
const USE_LLM_SAMPLE_CHAT = import.meta.env.VITE_USE_LLM_SAMPLE_CHAT === "true";

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
  setStatus,
  alertModal
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
      alertModal("Smart Search error", "Error initializing Smart Search.");
      setWaitingForResponse(false);
      return;
    }
    setMemoryId(newMemoryId);
    result = await streamLlmSearchResult(input, newMemoryId, setStatus);
  } else {
    result = await streamLlmSearchResult(input, memoryId, setStatus);
  }

  if (!result) {
    alertModal(
      "Smart Search error",
      "Error getting response from Smart Search."
    );
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
  const [chatMessages, setChatMessages] = useState(
    USE_LLM_SAMPLE_CHAT ? SampleChatHistory : []
  );
  const [searchInputValue, setSearchInputValue] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [status, setStatus] = useState("");
  const [svgError, setSvgError] = useState(false);

  const scrollRef = useRef(null);
  const alertModal = useAlertModal();

  // Scroll to the bottom whenever the items change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Load suggested questions for the JSON file
  useEffect(() => {
    (async function () {
      try {
        const llmSuggestedQuestions = await import(
          "./configs/llm-questions.json"
        );
        setSuggestedQuestions(llmSuggestedQuestions.default);
      } catch {
        const deafultLlmSuggestedQuestions = await import(
          "./configs/llm-questions.example.json"
        );
        setSuggestedQuestions(deafultLlmSuggestedQuestions.default);
      }
    })();
  }, []);

  function handleClickSuggestedQuestion(question) {
    getLlmSearchResult(
      question,
      memoryId,
      setMemoryId,
      chatMessages,
      setChatMessages,
      setWaitingForResponse,
      setStatus,
      alertModal
    );
  }

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
          <Logo
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              py: 1.5,
            }}
          />
          <Typography
            level="h2"
            align="center"
            justifyContent="center"
            sx={{
              p: 3,
            }}
          >
            {!svgError ? (
              <img
                src={myIcon}
                alt="icon"
                onError={() => setSvgError(true)}
                style={{ height: "2em" }}
              />
            ) : (
              "Smart"
            )}{" "}
            Search
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
                setStatus,
                alertModal
              );
            }}
          />
          <SuggestedQuestions
            questions={suggestedQuestions}
            handleQuestionClick={handleClickSuggestedQuestion}
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={5}
            sx={{ pt: 3 }}
          >
            <Typography level="title-md" color="primary" align="center">
              <Link component={RouterLink} to="/search-home">
                Go back to traditional search
              </Link>
            </Typography>
            <Typography level="title-md" color="primary" align="center">
              <Link component={RouterLink} to="/">
                Go back to home page
              </Link>
            </Typography>
          </Stack>
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
                  messageType={isYou ? "out" : "in"}
                  messageBody={message}
                  memoryId={memoryId}
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
                setStatus,
                alertModal
              );
            }}
          />
        </Box>
      </Box>
    </Sheet>
  );
}
