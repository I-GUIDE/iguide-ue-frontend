import React, { useState, useEffect, lazy, Suspense } from "react";

const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();
import Rating from "@mui/material/Rating";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/joy/Divider";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import FormControl from "@mui/joy/FormControl";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import { useTheme } from "@mui/joy";

import SimpleInfoCard from "../../components/SimpleInfoCard";
import { submitLlmResponseRating } from "../../utils/DataRetrieval";

const LLM_ELEMENTS_DOMAIN = import.meta.env.VITE_LLM_ELEMENTS_DOMAIN;

function RatingItem(props) {
  const title = props.title;
  const description = props.description;
  const rating = props.rating;
  const setRating = props.setRating;
  return (
    <FormControl orientation="vertical" sx={{ gap: 0.2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography level="title-md">{title}</Typography>
        <Rating
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </Stack>
      <Typography level="body-xs">{description}</Typography>
    </FormControl>
  );
}

export default function MessageBubble(props) {
  const outgoingMessage = props.messageType === "out";
  const messageBody = props.messageBody;
  const memoryId = props.memoryId;

  const messageId = messageBody.message_id;
  const answer = messageBody.answer;
  const elements = messageBody.elements;
  const sender = messageBody.sender;

  // Responsive breakpoints for number of visible elements
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [needToExpand, setNeedToExpand] = useState();
  const [expanded, setExpanded] = useState(false);

  let numberOfElementsVisibleWithoutExpansion;
  if (isSm) {
    numberOfElementsVisibleWithoutExpansion = 4;
  } else if (isMdUp) {
    numberOfElementsVisibleWithoutExpansion = 6;
  } else {
    numberOfElementsVisibleWithoutExpansion = 2;
  }

  // Decide if there is a need to provide expansion...
  useEffect(() => {
    if (!elements) {
      setNeedToExpand(false);
    } else if (elements.length <= numberOfElementsVisibleWithoutExpansion) {
      setNeedToExpand(false);
    } else {
      setNeedToExpand(true);
    }
  }, [elements, numberOfElementsVisibleWithoutExpansion]);

  // Visible elements contains all elements when it doesn't need to expand or expanded or empty
  const visibleElements =
    expanded || !elements || !needToExpand
      ? elements
      : elements.slice(0, numberOfElementsVisibleWithoutExpansion);

  const [ratingRelevance, setRatingRelevance] = useState(-1);
  const [ratingSufficiency, setRatingSufficiency] = useState(-1);
  const [ratingAccuracy, setRatingAccuracy] = useState(-1);
  const [ratingClarity, setRatingClarity] = useState(-1);
  const [ratingCompleteness, setRatingCompleteness] = useState(-1);
  const [ratingTrust, setRatingTrust] = useState(-1);
  const [ratingComment, setRatingComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [invalidSubmission, setInvalidSubmission] = useState(false);

  async function handleFeedbackSubmission() {
    // If every rating added up equals to - and comment being null, it means the user never rates
    if (
      ratingRelevance +
        ratingSufficiency +
        ratingAccuracy +
        ratingClarity +
        ratingCompleteness +
        ratingTrust ===
        -6 &&
      !ratingComment
    ) {
      setInvalidSubmission(true);
      return;
    }
    const ratingBody = {
      memoryId: memoryId,
      messageId: messageId,
      relevance: ratingRelevance,
      sufficiency: ratingSufficiency,
      accuracy: ratingAccuracy,
      clarity: ratingClarity,
      completeness: ratingCompleteness,
      trust: ratingTrust,
      comment: ratingComment,
    };
    setError(false);
    setInvalidSubmission(false);
    setLoading(true);
    const response = await submitLlmResponseRating(ratingBody);
    setLoading(false);
    if (response === "ERROR") {
      setError(true);
    } else {
      setRatingSubmitted(true);
    }
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Box sx={{ maxWidth: "75%", minWidth: "auto" }}>
          {/* MessageBubble title */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: outgoingMessage ? "flex-end" : "flex-start",
              mb: 0.25,
            }}
          >
            <Typography level="body-xs">{sender}</Typography>
          </Stack>

          {/* Message body */}
          <Box sx={{ position: "relative" }}>
            <Sheet
              color={outgoingMessage ? "primary" : "neutral"}
              variant={outgoingMessage ? "solid" : "outlined"}
              sx={[
                {
                  p: 2,
                  borderRadius: "lg",
                },
                outgoingMessage
                  ? {
                      borderTopRightRadius: 0,
                    }
                  : {
                      borderTopRightRadius: "lg",
                    },
                outgoingMessage
                  ? {
                      borderTopLeftRadius: "lg",
                    }
                  : {
                      borderTopLeftRadius: 0,
                    },
                outgoingMessage
                  ? {
                      background: `linear-gradient(170deg, #5B9A5A 60%, #A8B400 95%)`,
                    }
                  : {
                      backgroundColor: "background.body",
                    },
              ]}
            >
              {outgoingMessage ? (
                <Typography
                  level="body-md"
                  sx={{ color: "var(--joy-palette-common-white)" }}
                >
                  {answer}
                </Typography>
              ) : (
                <div
                  className="container"
                  data-color-mode="light"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  <Suspense fallback={<p>Loading message...</p>}>
                    <MarkdownPreview source={answer} />
                  </Suspense>
                </div>
              )}
              {visibleElements && visibleElements.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography level="title-md" sx={{ pb: 1 }}>
                    Related Knowledge Elements
                  </Typography>
                  <Grid
                    container
                    spacing={2}
                    columns={12}
                    sx={{
                      flexGrow: 1,
                      width: "100%", // Message box bottom fade out
                      height: !expanded && needToExpand && 300,
                      maskImage:
                        !expanded &&
                        needToExpand &&
                        "linear-gradient(to bottom, black, 80%, transparent)",
                      // Message box bottom fade out for Webkit browsers (Safari)
                      WebkitMaskImage:
                        !expanded &&
                        needToExpand &&
                        "linear-gradient(to bottom, black, 80%, transparent)",
                    }}
                  >
                    {visibleElements?.map((element) => (
                      <Grid key={element._id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <SimpleInfoCard
                          cardtype={element["resource-type"] + "s"}
                          pageId={element._id}
                          title={element.title}
                          thumbnailImage={element["thumbnail-image"]}
                          minHeight="100%"
                          width="100%"
                          showElementType
                          openInNewTab
                          customDomain={LLM_ELEMENTS_DOMAIN}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  {needToExpand &&
                    (!expanded ? (
                      <Button
                        variant="plain"
                        sx={{ my: 1 }}
                        onClick={() => setExpanded(true)}
                      >
                        Show all
                      </Button>
                    ) : (
                      <Button
                        variant="plain"
                        sx={{ my: 2 }}
                        onClick={() => setExpanded(false)}
                      >
                        Show less
                      </Button>
                    ))}
                </>
              )}
              {!outgoingMessage &&
                (!ratingSubmitted ? (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <AccordionGroup disableDivider>
                      <Accordion>
                        <AccordionSummary>
                          <Typography level="title-sm">
                            Provide your feedback on this answer
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ bgcolor: "#f9fcff" }}>
                          <Stack spacing={2} direction="column" sx={{ py: 1 }}>
                            <RatingItem
                              title="Relevance"
                              description="How well did the returned knowledge elements relate to your question?"
                              rating={ratingRelevance}
                              setRating={setRatingRelevance}
                            />
                            <RatingItem
                              title="Sufficiency"
                              description="To what extent did the returned knowledge elements contain enough information?"
                              rating={ratingSufficiency}
                              setRating={setRatingSufficiency}
                            />
                            <RatingItem
                              title="Accuracy"
                              description="To what extent is the answer factually correct?"
                              rating={ratingAccuracy}
                              setRating={setRatingAccuracy}
                            />
                            <RatingItem
                              title="Clarity"
                              description="How clear and easy to follow is the answer?"
                              rating={ratingClarity}
                              setRating={setRatingClarity}
                            />
                            <RatingItem
                              title="Completeness"
                              description="How well did the answer cover everything you needed?"
                              rating={ratingCompleteness}
                              setRating={setRatingCompleteness}
                            />
                            <RatingItem
                              title="Trust"
                              description="How confident are you in citing this answer?"
                              rating={ratingTrust}
                              setRating={setRatingTrust}
                            />
                            <FormControl
                              orientation="vertical"
                              sx={{ gap: 1, width: "100%" }}
                            >
                              <Typography level="body-sm">
                                Comment (Optional)
                              </Typography>
                              <Textarea
                                name="comment"
                                minRows={4}
                                maxRows={10}
                                value={ratingComment}
                                onChange={(event) =>
                                  setRatingComment(event.target.value)
                                }
                                sx={{ width: "100%" }}
                              />
                            </FormControl>
                            <Button
                              variant="soft"
                              size="sm"
                              sx={{ width: 150 }}
                              loading={loading}
                              onClick={handleFeedbackSubmission}
                            >
                              Submit Feedback
                            </Button>
                            {invalidSubmission && (
                              <Typography
                                level="body-md"
                                color="warning"
                                sx={{ pt: 1 }}
                              >
                                Please provide feedback for at least one field.
                              </Typography>
                            )}
                            {error && (
                              <Typography
                                level="body-md"
                                color="danger"
                                sx={{ pt: 1 }}
                              >
                                We couldn't submit your rating due to an error!
                              </Typography>
                            )}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    </AccordionGroup>
                  </>
                ) : (
                  <Typography level="title-sm" color="success" sx={{ pt: 2 }}>
                    You've rated this response. Thank you for your feedback!
                  </Typography>
                ))}
            </Sheet>
          </Box>
        </Box>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
