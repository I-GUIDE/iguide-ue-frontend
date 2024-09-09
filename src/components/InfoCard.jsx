import * as React from "react";

import AspectRatio from "@mui/joy/AspectRatio";
import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import { printListWithDelimiter, stringTruncator } from "../helpers/helper";
import {
  RESOURCE_TYPE_COLORS,
  RESOURCE_TYPE_NAMES,
} from "../configs/VarConfigs";

export default function InfoCard(props) {
  const thumbnailImage = props.thumbnailImage;
  const title = props.title;
  const authors = props.authors;
  const cardType = props.cardtype;
  const pageid = props.pageid;
  const tags = props.tags;
  const contents = props.contents;
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
        sx={{ width: 320, height: "100%", "--Card-radius": "25px" }}
      >
        <CardOverflow>
          <AspectRatio ratio="2">
            {thumbnailImage ? (
              <img src={thumbnailImage} loading="lazy" alt="thumbnail" />
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
          <Typography
            level="title-lg"
            id="card-description"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Link
            overlay
            underline="none"
            href={"/" + cardType + "/" + pageid}
            sx={{ color: "text.tertiary" }}
          >
            <Typography
              level="body-lg"
              aria-describedby="card-description"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "1",
                WebkitBoxOrient: "vertical",
                mb: 0.5,
              }}
            >
              {printListWithDelimiter(authors, ",")}
            </Typography>
          </Link>
          <Typography
            level="body-sm"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              mb: 0.5,
            }}
          >
            {contentsTruncated}
          </Typography>
        </CardContent>
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
    </Tooltip>
  );
}
