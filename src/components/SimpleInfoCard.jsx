import { Link as RouterLink } from "react-router";

import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

import {
  RESOURCE_TYPE_COLORS,
  ELEMENT_TYPE_CAP,
  ELEMENT_TYPE_URI_PLURAL,
} from "../configs/VarConfigs";

export default function SimpleInfoCard(props) {
  const thumbnailImage = props.thumbnailImage;
  const title = props.title;
  const cardType = props.cardtype;
  const pageId = props.pageId;
  const minHeight = props.minHeight;
  const width = props.width;
  const showElementType = props.showElementType;
  const openInNewTab = props.openInNewTab;
  // customDomain is for LLM search, which only returns elements from production
  const customDomain = props.customDomain;

  const categoryColor = RESOURCE_TYPE_COLORS[cardType];
  const categoryName = ELEMENT_TYPE_CAP[cardType];

  return (
    <Card
      variant="plain"
      color={categoryColor}
      sx={{
        width: width,
        maxWidth: 250,
        minHeight: minHeight,
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
            ELEMENT_TYPE_URI_PLURAL[cardType] +
            "/" +
            pageId
          }
          // to is used when react router is used
          to={"/" + ELEMENT_TYPE_URI_PLURAL[cardType] + "/" + pageId}
          target={openInNewTab ? "_blank" : null}
          rel={openInNewTab ? "noopener noreferrer" : null}
          sx={{ color: "text.tertiary" }}
        >
          <Stack
            spacing={1}
            sx={{
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Typography
              level="title-sm"
              textColor="#000"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: "lg",
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>
          </Stack>
        </Link>
      </CardContent>
      {showElementType && categoryName && (
        <CardOverflow
          variant="soft"
          color={categoryColor}
          sx={{
            py: 0.5,
            justifyContent: "center",
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
