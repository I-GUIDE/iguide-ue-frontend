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
  ELEMENT_TYPE_CAP,
  ELEMENT_TYPE_URI_PLURAL,
} from "../configs/VarConfigs";
import { PeriodAgoText } from "../utils/PeriodAgoText";

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
  const contributionTimestamp = props.contributionTimestamp;

  const categoryColor = RESOURCE_TYPE_COLORS[cardType];
  const categoryName = ELEMENT_TYPE_CAP[cardType];
  const categoryNamePlural = ELEMENT_TYPE_URI_PLURAL[cardType];
  const uri = `/${categoryNamePlural}/${elementId}${
    isPrivateElement ? "?private-mode=true" : ""
  }`;

  const contentsWithoutMarkdown = removeMarkdown(contents);

  const contributorUserId = contributor.id;
  const contributorName = contributor.name;
  const contributorAvatar = contributor["avatar-url"];

  return (
    <Card
      variant="plain"
      color={categoryColor}
      sx={{
        width: "100%",
        height: "100%",
        "--Card-radius": "15px",
        overflow: "hidden",
        boxShadow: `
          0 1px 2px rgba(0, 0, 0, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.2)
        `,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.015) translateY(-2px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardOverflow sx={{ overflow: "hidden" }}>
        <AspectRatio
          ratio="2.4"
          sx={{ transition: "transform 0.5s ease-in-out" }}
        >
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
            level="title-lg"
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
          level="title-sm"
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
            color={categoryColor}
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
                {contributionTimestamp ? (
                  <Typography level="body-xs">
                    {PeriodAgoText("Contributed ", contributionTimestamp)}
                  </Typography>
                ) : (
                  <Typography level="body-xs">Contributor</Typography>
                )}
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
