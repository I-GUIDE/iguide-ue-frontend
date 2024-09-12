import * as React from "react";

import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";

import { stringTruncator } from "../helpers/helper";

import {
  RESOURCE_TYPE_COLORS,
  RESOURCE_TYPE_NAMES,
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

  const categoryColor = RESOURCE_TYPE_COLORS[cardType];
  const categoryName = RESOURCE_TYPE_NAMES[cardType];

  const contentsTruncated = stringTruncator(contents, 0, 200, "");

  return (
    <Tooltip
      title={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 300,
            justifyContent: "center",
            p: 1,
          }}
        >
          <Typography level="title-sm">{title}</Typography>
        </Box>
      }
      variant="soft"
      placement="top-end"
      color={categoryColor}
    >
      <Card
        variant="outlined"
        color={categoryColor}
        sx={{
          width: width,
          maxWidth: 250,
          minHeight: minHeight,
          "&:hover": {
            borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardOverflow>
          <AspectRatio ratio="2">
            <img src={thumbnailImage} loading="lazy" alt="thumbnail" />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Link
            overlay
            underline="none"
            href={"/" + cardType + "/" + pageId}
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
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
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
                }}
              >
                {contentsTruncated}
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
    </Tooltip>
  );
}
