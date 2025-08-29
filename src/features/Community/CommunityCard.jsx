import { Link as RouterLink } from "react-router";

import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";

export default function CommunityCard(props) {
  const thumbnailImage = props.thumbnailImage;
  const title = props.title;
  const subtitle = props.subtitle;
  const communityId = props.communityId;
  const contents = props.contents;
  const openInNewTab = props.openInNewTab;

  const uri = `/communities/${communityId}`;

  return (
    <Card
      variant="outlined"
      color="neutral"
      sx={{
        width: "100%",
        height: "100%",
        "--Card-radius": "15px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: "xl",
        },
      }}
    >
      <CardOverflow sx={{ overflow: "hidden" }}>
        <AspectRatio
          ratio="1.75"
          sx={{ transition: "transform 0.5s ease-in-out" }}
        >
          <img
            src={thumbnailImage?.low ? thumbnailImage.low : thumbnailImage}
            loading="lazy"
            alt="thumbnail"
          />
        </AspectRatio>
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
          {subtitle}
        </Typography>
        <Typography
          level="body-xs"
          textColor="#a1a1a1"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: "4",
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
        >
          {contents}
        </Typography>
      </CardContent>
    </Card>
  );
}
