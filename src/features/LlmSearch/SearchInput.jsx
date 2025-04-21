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
              disabled={waitingForResponse}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                background: `linear-gradient(135deg, #F2C20F 0%, #5B9A5A 60%)`,
                color: "#fff",
                "&:hover": {
                  background: `linear-gradient(135deg, #5B9A5A 0%, #F2C20F 100%)`,
                },
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
                transition: "background 0.3s ease",
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
