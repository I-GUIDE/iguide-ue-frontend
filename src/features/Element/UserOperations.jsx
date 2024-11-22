import React, { useState, useEffect } from "react";

import Tooltip from "@mui/joy/Tooltip";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Snackbar from "@mui/joy/Snackbar";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

import {
  getElementBookmarkStatus,
  handleBookmarkingAnElement,
} from "../../utils/DataRetrieval";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function UserOperations(props) {
  const elementId = props.elementId;
  const elementType = props.elementType;

  const [isBookmarked, setIsBookmarked] = useState();
  const [open, setOpen] = useState(false);
  const [triggerUseEffect, setTriggerUseEffect] = useState(0);

  useEffect(() => {
    async function getBookmarkStatus() {
      const status = await getElementBookmarkStatus(elementId, elementType);
      TEST_MODE && console.log("Element bookmark status", status);

      if (status !== "ERROR") {
        setIsBookmarked(status);
      }
    }

    if (elementId) {
      getBookmarkStatus();
    }
  }, [elementId, elementType, triggerUseEffect]);

  async function handleBookmarking(currentStatus) {
    const status = await handleBookmarkingAnElement(
      elementId,
      !currentStatus,
      elementType
    );

    TEST_MODE && console.log("handle bookmarking return msg", status);
    setTriggerUseEffect(triggerUseEffect + 1);
    setOpen(true);
  }

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", py: 1 }}>
      <Tooltip
        title={isBookmarked ? "Remove bookmark" : "Bookmark this element"}
      >
        <IconButton
          variant="outlined"
          size="sm"
          disabled={isBookmarked === undefined}
          color={isBookmarked ? "success" : "neutral"}
          onClick={() => handleBookmarking(isBookmarked)}
        >
          {isBookmarked ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
        </IconButton>
      </Tooltip>
      <Snackbar
        autoHideDuration={8000}
        open={open}
        variant="soft"
        color={isBookmarked ? "success" : "neutral"}
        size="md"
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ maxWidth: 360 }}
      >
        <Stack spacing={0.5}>
          <Typography level="title-md">
            {isBookmarked && "Bookmarked!"}
          </Typography>
          <Typography level="body-md">
            {isBookmarked
              ? "You can view your bookmarked elements in the User Profile."
              : "Bookmark removed!"}
          </Typography>
        </Stack>
      </Snackbar>
    </Box>
  );
}
