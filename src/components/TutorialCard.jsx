import * as React from "react";

import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";

export default function TutorialCard(props) {
  const thumbnailImage = props.thumbnailImage;
  const title = props.title;
  const content = props.content;
  const link = props.link;

  return (
    <Card
      variant="plain"
      orientation="horizontal"
      sx={{
        maxHeight: "150px",
        bgcolor: "#fff",
        "&:hover": {
          borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
          transform: "translateY(-2px)",
        },
        p: 0,
      }}
    >
      <CardContent>
        <Stack direction="column" sx={{ p: 0 }}>
          <Link
            overlay
            href={link}
            underline="none"
            sx={{ color: "text.tertiary" }}
          >
            <Typography
              level="h4"
              textColor="#000"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                py: 0.5,
              }}
            >
              {title}
            </Typography>
          </Link>
          <Typography
            level="body-sm"
            textColor="#000"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              py: 0.5,
            }}
          >
            {content}
          </Typography>
        </Stack>
      </CardContent>
      <CardOverflow>
        <AspectRatio
          variant="plain"
          objectFit="contain"
          ratio="1"
          sx={{ width: "100px" }}
        >
          <img src={thumbnailImage} loading="lazy" alt="thumbnail" />
        </AspectRatio>
      </CardOverflow>
    </Card>
  );
}
