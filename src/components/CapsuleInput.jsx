import React, { useState, useEffect } from "react";

import Grid from "@mui/joy/Grid";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";

import CheckIcon from "@mui/icons-material/Check";
import Stack from "@mui/joy/Stack";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function CapsuleInput(props) {
  const array = props.array;
  const setArray = props.setArray;
  const placeholder = props.placeholder;

  const [inputValue, setInputValue] = useState("");

  // Add one item
  const handleAddingOneItem = (event) => {
    if (!inputValue || inputValue === "") {
      alert("Please enter a value!");
      return;
    }
    setArray([...array, inputValue]);
    setInputValue("");
    TEST_MODE && console.log("Added one item to", array, inputValue);
  };

  const handleRemovingOneItem = (idx) => {
    let newArray = [...array];
    newArray.splice(idx, 1);
    setArray(newArray);
    TEST_MODE && console.log("Removing one item, updated array", newArray);
  };

  return (
    <Grid sx={{ gridColumn: "1/-1" }}>
      {array && array.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ py: 1 }}>
          {array?.map((x, i) => (
            <Chip
              key={i}
              size="md"
              variant="outlined"
              color="primary"
              endDecorator={
                <ChipDelete onDelete={() => handleRemovingOneItem(i)} />
              }
            >
              {x}
            </Chip>
          ))}
        </Stack>
      )}

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid md>
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </Grid>
        <Grid md="auto">
          <IconButton
            size="sm"
            variant="solid"
            onClick={handleAddingOneItem}
            style={{ marginTop: "4px", cursor: "pointer" }}
            color="primary"
          >
            <CheckIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
}
