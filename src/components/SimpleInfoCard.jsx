import { Link as RouterLink } from "react-router";

import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

import { removeMarkdown } from "../helpers/helper";

import {
  RESOURCE_TYPE_COLORS,
  RESOURCE_TYPE_NAMES,
  RESOURCE_TYPE_NAMES_PLURAL_FOR_URI,
} from "../configs/VarConfigs";

export default function SimpleInfoCard(props) {
  const thumbnailImage = props.thumbnailImage;
  const title = props.title;
  const contents = props.contents;
  const cardType = props.cardtype;
  const pageId = props.pageId;
  const minHeight = props.minHeight;
  const width = props.width;
  const showElementType = props.showElementType;
  const openInNewTab = props.openInNewTab;
  // customDomain is for LLM search, which only returns elements from production
  const customDomain = props.customDomain;

  const categoryColor = RESOURCE_TYPE_COLORS[cardType];
  const categoryName = RESOURCE_TYPE_NAMES[cardType];

  const contentsWithoutMarkdown = removeMarkdown(contents);

  return (
    <Card
      variant="outlined"
      color={categoryColor}
      sx={{
        width: width,
        maxWidth: 250,
        minHeight: minHeight,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: "xl",
        },
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="2">
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
      </CardOverflow>
      <CardContent>
        <Link
          overlay
          underline="none"
          // When there is customDomain, do not use react router
          component={customDomain ? "a" : RouterLink}
          // href is used when customDomain is defined as react router is not used
          href={
            customDomain +
            "/" +
            RESOURCE_TYPE_NAMES_PLURAL_FOR_URI[cardType] +
            "/" +
            pageId
          }
          // to is used when react router is used
          to={"/" + RESOURCE_TYPE_NAMES_PLURAL_FOR_URI[cardType] + "/" + pageId}
          target={openInNewTab ? "_blank" : null}
          rel={openInNewTab ? "noopener noreferrer" : null}
          sx={{ color: "text.tertiary" }}
        >
          <Stack spacing={1}>
            <Typography
              level="body-sm"
              textColor="#000"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>
            <Typography
              level="body-xs"
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
          </Stack>
        </Link>
      </CardContent>
      {showElementType && (
        <CardOverflow
          variant="soft"
          color={categoryColor}
          sx={{
            px: 2,
            py: 1,
            justifyContent: "center",
            fontSize: "xs",
            fontWeight: "xl",
            letterSpacing: "0.3px",
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
