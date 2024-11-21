import React, { useState, useEffect } from "react";

import Tooltip from "@mui/joy/Tooltip";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

import { getElementBookmarkStatus } from "../../utils/DataRetrieval";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function UserOperations(props) {
  const elementId = props.elementId;
  const elementType = props.elementType;

  const [isBookmarked, setIsBookmarked] = useState();

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
  }, [elementId, elementType]);

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
        >
          {isBookmarked ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
