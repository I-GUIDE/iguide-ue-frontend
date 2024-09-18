import * as React from "react";

import AspectRatio from "@mui/joy/AspectRatio";
import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";

import { printListWithDelimiter, stringTruncator } from "../helpers/helper";
import UserAvatar from "./UserAvatar";
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
  const contributor = props.contributor;
  const showElementType = props.showElementType;

  const categoryColor = RESOURCE_TYPE_COLORS[cardType];
  const categoryName = RESOURCE_TYPE_NAMES[cardType];

  const contentsTruncated = stringTruncator(contents, 0, 200, "");
  const contributorUserId = contributor.id;
  const contributorName = contributor.name;
  const contributorAvatar = contributor["avatar-url"];

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
          width: "100%",
          height: "100%",
          "--Card-radius": "25px",
          "&:hover": {
            borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardOverflow>
          <AspectRatio ratio="2.4">
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
          <Link
            overlay
            underline="none"
            href={"/" + cardType + "/" + pageid}
            sx={{ color: "text.tertiary" }}
          >
            <Typography
              level="title-md"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
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
            }}
          >
            {contentsTruncated}
          </Typography>
        </CardContent>

        {contributorName && (
          <CardActions>
            <Link
              href={"/contributor/" + encodeURIComponent(contributorUserId)}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <UserAvatar
                  size={30}
                  link={contributorAvatar}
                  userId={contributorUserId}
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
    </Tooltip>
  );
}
