import React, { lazy, Suspense } from "react";

import { Link as RouterLink } from "react-router-dom";
const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import AspectRatio from "@mui/joy/AspectRatio";
import Grid from "@mui/joy/Grid";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { printListWithDelimiter } from "../../helpers/helper";
import UserAvatar from "../UserAvatar";
import { PeriodAgoText } from "../../utils/PeriodAgoText";

function AuthorsDisplay(props) {
  const authorsList = props.authorsList;
  if (!authorsList) {
    return null;
  }

  const numberOfAuthors = authorsList.length;

  if (numberOfAuthors === 0) return null;

  // When there are too many authors, use tooltip to display the full list
  if (numberOfAuthors > 10) {
    return (
      <Tooltip
        title={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 450,
              maxHeight: 400,
              overflow: "hidden",
              overflowY: "scroll",
              p: 1,
            }}
          >
            <Typography level="title-md">
              Author{authorsList.length > 1 && "s"}
            </Typography>
            <Typography level="body-md">
              {printListWithDelimiter(authorsList, ",")}
            </Typography>
          </Box>
        }
        variant="outlined"
      >
        <Typography
          level="title-md"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
          }}
        >
          {printListWithDelimiter(authorsList, ",")}
        </Typography>
      </Tooltip>
    );
  }

  return (
    <Typography
      level="title-md"
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: "2",
        WebkitBoxOrient: "vertical",
      }}
    >
      {printListWithDelimiter(authorsList, ",")}
    </Typography>
  );
}

export default function MainContent(props) {
  const title = props.title;
  const contributor = props.contributor ? props.contributor : {};
  const authors = props.authors;
  const doi = props.doi;
  const contentsTitle = props.contentsTitle;
  const contents = props.contents;
  const thumbnailImage = props.thumbnailImage;
  const elementType = props.elementType;
  const useMarkdown = props.useMarkdown;
  const useOERLayout = props.useOERLayout;
  const creationTime = props.creationTime;
  const updateTime = props.updateTime;

  const hasTimestamp = creationTime || updateTime;
  const timePassedText = updateTime
    ? PeriodAgoText("Updated ", updateTime)
    : PeriodAgoText("Contributed ", creationTime);
  const contributorAvatar = contributor["avatar_url"];
  const contributorName = contributor.name;
  const contributorUserId = contributor.id;
  const encodedUserId = encodeURIComponent(contributor.id);

  if (useOERLayout) {
    return (
      <Stack sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Grid
          container
          rowSpacing={2}
          columnSpacing={8}
          alignItems="flex-start"
          sx={{ py: 2 }}
        >
          <Grid xs={12}>
            <Card sx={{ minHeight: "400px" }}>
              <CardCover>
                {thumbnailImage ? (
                  <img src={thumbnailImage} loading="lazy" alt="thumbnail" />
                ) : (
                  <img
                    src={`/default-images/${elementType}.png`}
                    loading="lazy"
                    alt="deafult-thumbnail"
                  />
                )}
              </CardCover>
              <CardCover
                sx={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                }}
              />
              <CardContent sx={{ justifyContent: "flex-end" }}>
                <Typography level="h2" textColor="#fff">
                  {title}
                </Typography>
                {authors && authors.length > 0 && (
                  <Typography level="body-lg" textColor="neutral.300">
                    {printListWithDelimiter(authors, ",")}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} md={8}>
            {contributorName && (
              <Link
                component={RouterLink}
                to={"/contributor/" + encodedUserId}
                style={{ textDecoration: "none" }}
              >
                <Card
                  variant="plain"
                  orientation="horizontal"
                  sx={{
                    maxHeight: "150px",
                    bgcolor: "#fff",
                    p: 0,
                    "&:hover": {
                      borderColor:
                        "theme.vars.palette.primary.outlinedHoverBorder",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ py: 2 }}
                    >
                      <UserAvatar
                        link={contributorAvatar}
                        userId={contributorUserId}
                      />
                      <Stack direction="column">
                        <Typography level="title-lg">
                          {contributorName}
                        </Typography>
                        <Typography level="body-sm">
                          {hasTimestamp ? timePassedText : "Contributor"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Link>
            )}
          </Grid>
        </Grid>
        {contentsTitle && (
          <Typography level="h4" sx={{ pt: 2 }}>
            {contentsTitle}
          </Typography>
        )}
        {useMarkdown ? (
          <Box sx={{ py: 2 }}>
            <div className="container" data-color-mode="light">
              <Suspense fallback={<p>Loading content...</p>}>
                <MarkdownPreview source={contents} />
              </Suspense>
            </div>
          </Box>
        ) : (
          <Typography level="body-lg">{contents}</Typography>
        )}
      </Stack>
    );
  }

  return (
    <Stack sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={8}
        alignItems="flex-start"
        sx={{ py: 2 }}
      >
        <Grid xs={12} md={8}>
          {contributorName && (
            <Link
              component={RouterLink}
              to={"/contributor/" + encodedUserId}
              style={{ textDecoration: "none" }}
            >
              <Card
                variant="plain"
                orientation="horizontal"
                sx={{
                  maxHeight: "150px",
                  bgcolor: "#fff",
                  p: 0,
                  "&:hover": {
                    borderColor:
                      "theme.vars.palette.primary.outlinedHoverBorder",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ pb: 2 }}
                  >
                    <UserAvatar
                      link={contributorAvatar}
                      userId={contributorUserId}
                    />
                    <Stack direction="column">
                      <Typography level="title-lg">
                        {contributorName}
                      </Typography>
                      <Typography level="body-sm">
                        {hasTimestamp ? timePassedText : "Contributor"}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          )}
          <Typography level="h2" sx={{ py: 1, wordBreak: "break-word" }}>
            {title}
          </Typography>
          <AuthorsDisplay authorsList={authors} />
          {doi && (
            <Link
              href={doi}
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
            >
              <Typography
                level="body-sm"
                startDecorator={<OpenInNewIcon />}
                sx={{ py: 1, wordBreak: "break-word" }}
              >
                {doi}
              </Typography>
            </Link>
          )}
        </Grid>
        <Grid xs={12} md={4}>
          <AspectRatio
            variant="outlined"
            sx={{ py: 1, borderRadius: "lg", height: "100%" }}
          >
            {thumbnailImage ? (
              <img src={thumbnailImage} loading="lazy" alt="thumbnail" />
            ) : (
              <img
                src={`/default-images/${elementType}.png`}
                loading="lazy"
                alt="deafult-thumbnail"
              />
            )}
          </AspectRatio>
        </Grid>
      </Grid>
      {contentsTitle && (
        <Typography level="h4" sx={{ pt: 2 }}>
          {contentsTitle}
        </Typography>
      )}
      {useMarkdown ? (
        <Box sx={{ py: 2 }}>
          <div className="container" data-color-mode="light">
            <Suspense fallback={<p>Loading content...</p>}>
              <MarkdownPreview source={contents} />
            </Suspense>
          </div>
        </Box>
      ) : (
        <Typography
          level="body-lg"
          sx={{ pt: 2, wordBreak: "break-word", lineHeight: "150%" }}
        >
          {contents}
        </Typography>
      )}
    </Stack>
  );
}
