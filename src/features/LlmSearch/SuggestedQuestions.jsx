import { useState, useEffect } from "react";

import { useLocation } from "react-router";

import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";

function getRandomQuestions(array, numberOfItems) {
  if (!array) {
    return [];
  }
  const shuffled = array.slice();
  const numberOfReturnItems = Math.min(array.length, numberOfItems);

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return the first numberOfReturnItems amount of items
  return shuffled.slice(0, numberOfReturnItems);
}

export default function SuggestedQuestions(props) {
  const suggestedQuestions = props.questions;
  const handleQuestionClick = props.handleQuestionClick;

  const location = useLocation();
  const [displayedQuestions, setDisplayedQuestions] = useState([]);

  // Getting random questions runs once on page load and every route change
  useEffect(() => {
    setDisplayedQuestions(getRandomQuestions(suggestedQuestions, 3));
  }, [location.pathname, suggestedQuestions]);

  if (!suggestedQuestions) {
    return null;
  }

  return (
    <Stack sx={{ py: 1.5 }} spacing={1}>
      <Typography align="center" level="title-sm">
        You could ask things like...
      </Typography>
      <Stack direction="row" flexWrap="wrap" justifyContent="center">
        {displayedQuestions.map((question) => (
          <Button
            key={question.id}
            variant="plain"
            color="success"
            size="sm"
            onClick={() => handleQuestionClick(question.query)}
          >
            {question.query}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
