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
import {
  RESOURCE_TYPE_COLORS,
  ELEMENT_TYPE_CAP,
  ELEMENT_TYPE_URI_PLURAL,
} from "../configs/VarConfigs";
import { PeriodAgoText } from "../utils/PeriodAgoText";
import UserProfileTooltip from "./UserProfileTooltip";

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
          transform: "scale(1.01) translateY(-1px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
        },
        "&:focus-within:has(:focus-visible)": {
          outline: "2px solid",
          outlineColor: "var(--joy-palette-primary-500, #1976d2)",
          outlineOffset: "2px",
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
          tabIndex={0}
          aria-label={`View details for ${title}`}
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
              fontWeight: "bold",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "4",
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
              lineHeight: 1.5,
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
          }}
        >
          {printListWithDelimiter(authors, ",")}
        </Typography>
        {contentsWithoutMarkdown && (
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
        )}
      </CardContent>

      {contributorName && (
        <CardActions sx={{ pb: 0 }}>
          <Stack direction="column">
            <Typography
              level="body-xs"
              sx={{
                whiteSpace: "normal",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                overflow: "visible",
                textOverflow: "unset",
              }}
            >
              By{" "}
              <UserProfileTooltip userId={contributorUserId} enterDelay={500}>
                <Link
                  color="neutral"
                  component={RouterLink}
                  to={"/contributor/" + encodeURIComponent(contributorUserId)}
                  sx={{
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  {contributorName}
                </Link>
              </UserProfileTooltip>
              {contributionTimestamp &&
                PeriodAgoText(" • ", contributionTimestamp)}
            </Typography>
          </Stack>
        </CardActions>
      )}

      {showElementType && categoryName && (
        <CardOverflow
          variant="soft"
          color={categoryColor}
          sx={{
            py: 0.5,
            alignItems: "center",
            fontSize: "xs",
            fontWeight: "lg",
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderColor: "divider",
          }}
        >
          {categoryName}
        </CardOverflow>
      )}
    </Card>
  );
}
