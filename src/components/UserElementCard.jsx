import { Link as RouterLink } from "react-router";

import AspectRatio from "@mui/joy/AspectRatio";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import CardActions from "@mui/joy/CardActions";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";
import Divider from "@mui/joy/Divider";

import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockIcon from "@mui/icons-material/Lock";

import { NumberText } from "../utils/NumberText";
import ElementDeleteButton from "./ElementDeleteButton";
import {
  RESOURCE_TYPE_COLORS,
  ELEMENT_TYPE_CAP,
  ELEMENT_TYPE_URI_PLURAL,
} from "../configs/VarConfigs";

export default function UserElementCard(props) {
  const thumbnailImage = props.thumbnailImage;
  const title = props.title;
  const cardType = props.cardtype;
  const elementId = props.elementId;
  const numberOfClicks = props.numberOfClicks || 0;
  const showElementType = props.showElementType;
  const contributor = props.contributor ? props.contributor : {};
  const isPrivateElement = props.isPrivateElement;

  const cardTypePlural = ELEMENT_TYPE_URI_PLURAL[cardType];
  const updateFormUri = `/element-update/${elementId}${
    isPrivateElement ? "?private-mode=true" : ""
  }`;
  const categoryColor = RESOURCE_TYPE_COLORS[cardType];
  const categoryName = ELEMENT_TYPE_CAP[cardType];
  const uri = `/${cardTypePlural}/${elementId}${
    isPrivateElement ? "?private-mode=true" : ""
  }`;
  const numberOfClicksAsString = NumberText(numberOfClicks);
  const contributorUserId = contributor.id;

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
      <CardOverflow>
        <AspectRatio ratio="2.4">
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
          aria-label={`View details for ${title}`}
          component={RouterLink}
          to={uri}
          tabIndex={0}
          sx={{ color: "text.tertiary" }}
        >
          <Typography
            level="title-md"
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
      </CardContent>
      <Divider orientation="horizontal" />
      <CardActions
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          borderColor: "#fff",
        }}
      >
        <Tooltip
          title={numberOfClicks > 1000 && numberOfClicks}
          placement="top"
          arrow
        >
          <Typography level="title-sm">
            {numberOfClicksAsString} view{numberOfClicks > 1 && "s"}
          </Typography>
        </Tooltip>
        <Divider orientation="vertical" />
        <Button
          size="sm"
          variant="plain"
          color="primary"
          component="a"
          href={updateFormUri}
          startDecorator={<EditIcon />}
        >
          Edit
        </Button>
        <Divider orientation="vertical" />
        <ElementDeleteButton
          variant="plain"
          color="danger"
          size="sm"
          title={title}
          elementId={elementId}
          contributorId={contributorUserId}
          afterDeleteRedirection="/user-profile"
        >
          <Typography
            startDecorator={<DeleteForeverIcon />}
            level="title-sm"
            color="danger"
          >
            Delete
          </Typography>
        </ElementDeleteButton>
      </CardActions>

      {showElementType && categoryName && (
        <CardOverflow
          variant="soft"
          color={categoryColor}
          sx={{
            py: 0.5,
            writingMode: "horizontal-rl",
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
