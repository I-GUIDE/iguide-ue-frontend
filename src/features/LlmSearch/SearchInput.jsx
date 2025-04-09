import React, { useRef } from "react";

import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Tooltip from "@mui/joy/Tooltip";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function SearchInput(props) {
  const searchInputValue = props.searchInputValue;
  const setSearchInputValue = props.setSearchInputValue;
  // When the server is processing answers, temporarily disable input
  const waitingForResponse = props.waitingForResponse;
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
          placeholder={
            waitingForResponse
              ? "We are processing your inquery"
              : "Ask me anything..."
          }
          aria-label="llm-search-input"
          disabled={!!waitingForResponse}
          ref={textAreaRef}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
          value={searchInputValue}
          endDecorator={
            <Tooltip title="Send" variant="solid">
              <IconButton
                size="lg"
                variant="solid"
                color="primary"
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                onClick={handleClick}
              >
                <ArrowUpwardIcon />
              </IconButton>
            </Tooltip>
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
            "--Input-decoratorChildHeight": "50px",
            "--Input-radius": "40px",
            "--Input-paddingInline": "20px",
          }}
        />
      </FormControl>
    </Box>
  );
}
