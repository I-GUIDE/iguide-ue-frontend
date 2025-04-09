import * as React from "react";

import { Link as RouterLink } from "react-router";

import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import IconButton from "@mui/joy/IconButton";
import LockIcon from "@mui/icons-material/Lock";

import { printListWithDelimiter, removeMarkdown } from "../helpers/helper";
import UserAvatar from "./UserAvatar";
import {
  RESOURCE_TYPE_COLORS,
  RESOURCE_TYPE_NAMES,
  RESOURCE_TYPE_NAMES_PLURAL_FOR_URI,
} from "../configs/VarConfigs";

export default function InfoCard(props) {
  const thumbnailImage = props.thumbnailImage;
  const title = props.title;
  const authors = props.authors;
  const cardType = props.cardtype;
  const elementId = props.elementId;
  const contents = props.contents;
  const contributor = props.contributor ? props.contributor : {};
  const showElementType = props.showElementType;
  const isPrivateElement = props.isPrivateElement;
  const openInNewTab = props.openInNewTab;

  const categoryColor = RESOURCE_TYPE_COLORS[cardType];
  const categoryName = RESOURCE_TYPE_NAMES[cardType];
  const categoryNamePlural = RESOURCE_TYPE_NAMES_PLURAL_FOR_URI[cardType];
  const uri = `/${categoryNamePlural}/${elementId}${
    isPrivateElement ? "?private-mode=true" : ""
  }`;

  const contentsWithoutMarkdown = removeMarkdown(contents);

  const contributorUserId = contributor.id;
  const contributorName = contributor.name;
  const contributorAvatar = contributor["avatar-url"];

  return (
    <Card
      variant="outlined"
      color={categoryColor}
      sx={{
        width: "100%",
        height: "100%",
        "--Card-radius": "15px",
        "&:hover": {
          borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="2.4">
          {thumbnailImage ? (
            <img
              src={thumbnailImage.low ? thumbnailImage.low : thumbnailImage}
              loading="lazy"
              alt="thumbnail"
            />
          ) : (
            <img
              src={`/default-images/${cardType}.png`}
              loading="lazy"
              alt="deafult-thumbnail"
            />
          )}
        </AspectRatio>
        {isPrivateElement && (
          <IconButton
            aria-label="lock icon"
            size="md"
            variant="solid"
            color="neutral"
            disabled
            sx={{
              position: "absolute",
              zIndex: 2,
              borderRadius: "50%",
              right: "1rem",
              bottom: 0,
              transform: "translateY(50%)",
            }}
          >
            <LockIcon />
          </IconButton>
        )}
      </CardOverflow>
      <CardContent>
        <Link
          overlay
          underline="none"
          component={RouterLink}
          to={uri}
          target={openInNewTab && "_blank"}
          rel={openInNewTab && "noopener noreferrer"}
          sx={{ color: "text.tertiary" }}
        >
          <Typography
            level="title-md"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
        </Link>
        <Typography
          level="body-sm"
          textColor="#4D4F5C"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
            mb: 0.5,
          }}
        >
          {printListWithDelimiter(authors, ",")}
        </Typography>
        <Typography
          level="body-xs"
          textColor="#a1a1a1"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
        >
          {contentsWithoutMarkdown}
        </Typography>
      </CardContent>

      {contributorName && (
        <CardActions>
          <Link
            component={RouterLink}
            to={"/contributor/" + encodeURIComponent(contributorUserId)}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <UserAvatar
                size={30}
                userAvatarUrls={contributorAvatar}
                userId={contributorUserId}
                avatarResolution="low"
              />
              <Stack direction="column">
                <Typography
                  level="title-sm"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {contributorName}
                </Typography>
                <Typography level="body-xs">Contributor</Typography>
              </Stack>
            </Stack>
          </Link>
        </CardActions>
      )}

      {showElementType && (
        <CardOverflow
          variant="soft"
          color={categoryColor}
          sx={{
            py: 1,
            writingMode: "horizontal-rl",
            alignItems: "center",
            fontSize: "xs",
            fontWeight: "xl",
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderLeft: "1px solid",
            borderColor: "divider",
          }}
        >
          {categoryName}
        </CardOverflow>
      )}
    </Card>
  );
}
