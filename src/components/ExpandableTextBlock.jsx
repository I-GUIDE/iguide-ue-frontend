import { useState, useRef, useEffect } from "react";

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

export default function ExpandableTextBlock(props) {
  const text = props.text;
  const numberOfLines = props.numberOfLines || 2;
  const expandButtonText = props.expandButtonText || "Expand";
  const collapseButtonText = props.collapseButtonText || "Collapse";

  const [expanded, setExpanded] = useState(false);
  const [showExpand, setShowExpand] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const hasOverflow =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setShowExpand(hasOverflow);
    }
  }, [text]);

  if (!text) {
    return;
  }

  return (
    <Box>
      <Typography
        ref={textRef}
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: expanded ? "none" : numberOfLines,
          whiteSpace: expanded ? "normal" : "initial",
        }}
      >
        {text}
      </Typography>
      {showExpand && (
        <Typography
          level="title-sm"
          color="primary"
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: "inline",
            cursor: "pointer",
            userSelect: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              () => setExpanded(!expanded);
          }}
        >
          {expanded ? collapseButtonText : expandButtonText}
        </Typography>
      )}
    </Box>
  );
}
