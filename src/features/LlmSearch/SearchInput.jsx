import React, { useRef } from "react";

import IconButton from "@mui/joy/IconButton";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";

import WarningIcon from "@mui/icons-material/Warning";
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
    <FormControl>
      <Input
        placeholder={
          waitingForResponse
            ? "We are processing your inquery"
            : "Ask me anything..."
        }
        name="llm-search-input"
        aria-label="llm search input"
        autoComplete="off"
        disabled={waitingForResponse}
        ref={textAreaRef}
        onChange={(e) => {
          setSearchInputValue(e.target.value);
        }}
        value={searchInputValue}
        endDecorator={
          <Tooltip
            title={!waitingForResponse && "Send"}
            variant="solid"
            placement="top"
          >
            <IconButton
              size="lg"
              variant="solid"
              loading={waitingForResponse}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                backgroundColor: "#5B9A5A",
                "&:hover": {
                  backgroundColor: "#A8B400",
                },
                transition: "background 0.5s ease",
              }}
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
      <FormHelperText>
        <Typography level="body-xs" startDecorator={<WarningIcon />}>
          Smart Search is still under development. Not all responses may be
          accurate.
        </Typography>
      </FormHelperText>
    </FormControl>
  );
}
