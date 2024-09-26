import React, { useState, useEffect, useRef } from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function LlmSearchInput(props) {
  const searchInputValue = props.searchInputValue;
  const setSearchInputValue = props.setSearchInputValue;
  const onSubmit = props.onSubmit;

  const textAreaRef = useRef(null);

  const handleClick = () => {
    if (searchInputValue.trim() !== "") {
      onSubmit();
      setSearchInputValue("");
    }
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        <Input
          placeholder="Ask me anything..."
          aria-label="llm-search-input"
          ref={textAreaRef}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
          value={searchInputValue}
          endDecorator={
            <Stack
              direction="row"
              sx={{
                justifyContent: "flex-end",
                alignItems: "center",
                flexGrow: 1,
                py: 0.5,
                pr: 0.5,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button
                size="sm"
                color="primary"
                sx={{ alignSelf: "center", borderRadius: "sm" }}
                endDecorator={<ArrowUpwardIcon />}
                onClick={handleClick}
              >
                Send
              </Button>
            </Stack>
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleClick();
            }
          }}
          sx={{
            "& textarea:first-of-type": {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
}
