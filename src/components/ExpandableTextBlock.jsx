import { useState, useRef, useEffect } from "react";

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";

export default function ExpandableTextBlock(props) {
  const text = props.text;
  const textLevel = props.textLevel || "title-sm";
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
        level={textLevel}
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
        <Button
          color="primary"
          size="xs"
          variant="plain"
          onClick={() => setExpanded(!expanded)}
          sx={{ p: 0 }}
        >
          {expanded ? collapseButtonText : expandButtonText}
        </Button>
      )}
    </Box>
  );
}
