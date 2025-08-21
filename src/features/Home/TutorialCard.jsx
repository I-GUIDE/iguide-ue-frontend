import { Link as RouterLink } from "react-router";

import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";

function Img(props) {
  const children = props.children;
  return (
    <CardOverflow sx={{ alignItems: "center" }}>
      <AspectRatio
        variant="plain"
        objectFit="contain"
        ratio="1"
        sx={{
          width: "60px",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {children}
      </AspectRatio>
    </CardOverflow>
  );
}

export default function TutorialCard(props) {
  const iconImage = props.iconImage;
  const title = props.title;
  const content = props.content;
  const link = props.link;
  const bgColor = props.bgColor;
  const inColumn = props.inColumn;

  return (
    <Card
      variant="plain"
      orientation={inColumn ? "vertical" : "horizontal"}
      sx={{
        maxHeight: "300px",
        width: "100%",
        bgcolor: bgColor,
        "&:hover": {
          borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
          // Apply the rotation to the nested component
          "& .MuiAspectRatio-root": {
            transform: "rotate(15deg) scale(1.1)",
          },
        },
        p: 0,
      }}
    >
      {inColumn && (
        <Img>
          <img src={iconImage} loading="lazy" alt="thumbnail" />
        </Img>
      )}
      <CardContent>
        <Link
          overlay
          component={RouterLink}
          to={link}
          underline="none"
          sx={{ color: "text.tertiary" }}
        >
          <Stack direction="column" sx={{ p: 0, width: "100%" }}>
            <Typography
              level="h4"
              textColor="#000"
              align={inColumn ? "center" : "left"}
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
            <Typography
              level="body-sm"
              align={inColumn ? "center" : "left"}
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
        </Link>
      </CardContent>
      {!inColumn && (
        <Img>
          <img src={iconImage} loading="lazy" alt="thumbnail" />
        </Img>
      )}
    </Card>
  );
}
