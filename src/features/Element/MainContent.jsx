import { lazy, Suspense } from "react";

import { useOutletContext, Link as RouterLink } from "react-router";
const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LinkIcon from "@mui/icons-material/Link";

import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";
import CopyButton from "./CopyButton";
import ExpandableTextBlock from "../../components/ExpandableTextBlock";
import { printListWithDelimiter } from "../../helpers/helper";
import UserAvatar from "../../components/UserAvatar";
import { PeriodAgoText } from "../../utils/PeriodAgoText";
import { RESOURCE_TYPE_NAMES_PLURAL_FOR_URI } from "../../configs/VarConfigs";

const REACT_FRONTEND_URL = import.meta.env.VITE_REACT_FRONTEND_URL;
const WEBSITE_TITLE = import.meta.env.VITE_WEBSITE_TITLE;

function ContributorCard(props) {
  const encodedUserId = props.encodedUserId;
  const avatar = props.avatar;
  const userId = props.userId;
  const name = props.name;
  const isLoading = props.isLoading;
  const timePassedText = props.timePassedText;

  return (
    <Tooltip title="View profile" placement="top">
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
              borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
              transform: "translateY(-2px)",
            },
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ py: 1 }}
            >
              <UserAvatar
                userAvatarUrls={avatar}
                userId={userId}
                avatarResolution="low"
                isLoading={isLoading}
              />
              <Stack direction="column">
                <Typography level="title-lg">{name}</Typography>
                <Typography level="body-sm">{timePassedText}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Link>
    </Tooltip>
  );
}

export default function MainContent(props) {
  const elementId = props.elementId;
  const title = props.title;
  const contributor = props.contributor ? props.contributor : {};
  const authors = props.authors;
  const doi = props.doi;
  const contentsTitle = props.contentsTitle;
  const contents = props.contents;
  const thumbnailImage = props.thumbnailImage;
  const thumbnailImageCredit = props.thumbnailImageCredit;
  const elementType = props.elementType;
  const useMarkdown = props.useMarkdown;
  const useOERLayout = props.useOERLayout;
  const creationTime = props.creationTime;
  const updateTime = props.updateTime;
  const isLoading = props.isLoading;

  const elementTypePlural = RESOURCE_TYPE_NAMES_PLURAL_FOR_URI[elementType];

  const hasTimestamp = creationTime || updateTime;
  const timePassedText = updateTime
    ? PeriodAgoText("Updated ", updateTime)
    : PeriodAgoText("Contributed ", creationTime);
  const contributorAvatar = contributor["avatar-url"];
  const contributorName = contributor.name;
  const contributorUserId = contributor.id;
  const encodedUserId = encodeURIComponent(contributor.id);

  // OutletContext retrieving the user object to display user info
  const { isAuthenticated } = useOutletContext();

  const shareUrl = `${REACT_FRONTEND_URL}/${elementTypePlural}/${elementId}`;
  const shareTitle = `${WEBSITE_TITLE}: ${title}`;

  // Only display when the URL or DOI is validated
  const validDOI = new RegExp("10\\.\\d{4,9}/[-._;()/:A-Z0-9]+", "i");
  const validURL = new RegExp(
    "^(https?|ftp):\\/\\/(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(?:\\/[^\\s]*)?$"
  );
  let validatedPublicationURL = "";
  if (doi) {
    if (validURL.test(doi)) {
      validatedPublicationURL = doi;
    } else if (validDOI.test(doi)) {
      validatedPublicationURL = "https://doi.org/" + doi;
    }
  }

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
                  <img
                    src={
                      thumbnailImage.high ? thumbnailImage.high : thumbnailImage
                    }
                    loading="lazy"
                    style={isLoading ? { display: "none" } : null}
                    alt="thumbnail"
                  />
                ) : (
                  <img
                    src={`/default-images/${elementType}.png`}
                    loading="lazy"
                    style={isLoading ? { display: "none" } : null}
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
          <Grid xs={12}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "center", sm: "space-between" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              {contributorName && (
                <ContributorCard
                  encodedUserId={encodedUserId}
                  userId={contributorUserId}
                  name={contributorName}
                  avatar={contributorAvatar}
                  isLoading={isLoading}
                  timePassedText={hasTimestamp ? timePassedText : "Contributor"}
                />
              )}
              <Stack direction="row" spacing={1}>
                <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} />
                <CopyButton
                  textToCopy={shareUrl}
                  tooltipText="Copy element URL"
                  successText="Element URL copied!"
                  icon={<LinkIcon />}
                />
                {isAuthenticated && (
                  <BookmarkButton
                    elementId={elementId}
                    elementType={elementType}
                  />
                )}
              </Stack>
            </Stack>
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
            sx={{
              pt: 2,
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              lineHeight: "150%",
            }}
          >
            {contents}
          </Typography>
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
        <Grid xs={12}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            {contributorName && (
              <ContributorCard
                encodedUserId={encodedUserId}
                userId={contributorUserId}
                name={contributorName}
                avatar={contributorAvatar}
                isLoading={isLoading}
                timePassedText={hasTimestamp ? timePassedText : "Contributor"}
              />
            )}
            <Stack direction="row" spacing={1}>
              <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} />
              <CopyButton
                textToCopy={shareUrl}
                tooltipText="Copy element URL"
                successText="Element URL copied!"
                icon={<LinkIcon />}
              />
              {isAuthenticated && (
                <BookmarkButton
                  elementId={elementId}
                  elementType={elementType}
                />
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Typography level="h2" sx={{ py: 1, wordBreak: "break-word" }}>
            {title}
          </Typography>
          <ExpandableTextBlock
            text={printListWithDelimiter(authors, ",")}
            expandButtonText="See all authors"
            collapseButtonText="See fewer authors"
          />
          {validatedPublicationURL && (
            <Link
              href={validatedPublicationURL}
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
            >
              <Typography
                level="body-sm"
                startDecorator={<OpenInNewIcon />}
                sx={{ py: 1, wordBreak: "break-word" }}
              >
                {validatedPublicationURL}
              </Typography>
            </Link>
          )}
        </Grid>
        {thumbnailImage && (
          <Grid xs={12} sx={{ py: 2 }}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                maxHeight: 800,
                height: "100%",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "neutral.outlinedBorder",
                borderRadius: "xl",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  thumbnailImage.medium ? thumbnailImage.medium : thumbnailImage
                }
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  display: isLoading ? "none" : "block",
                }}
                alt="thumbnail"
              />
            </Box>
            {thumbnailImageCredit && (
              <Typography level="body-xs">
                Credit: {thumbnailImageCredit}
              </Typography>
            )}
          </Grid>
        )}
      </Grid>
      {contentsTitle && (
        <Typography level="h4" sx={{ pt: 2 }}>
          {contentsTitle}
        </Typography>
      )}
      <Box sx={{ pt: 2 }}>
        {useMarkdown ? (
          <div className="container" data-color-mode="light">
            <Suspense fallback={<p>Loading content...</p>}>
              <MarkdownPreview source={contents} />
            </Suspense>
          </div>
        ) : (
          <Typography
            level="body-lg"
            sx={{
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              lineHeight: "160%",
            }}
          >
            {contents}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
