import * as React from "react";

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
  RESOURCE_TYPE_NAMES,
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

  const updateFormUri = `/element-update/${elementId}${
    isPrivateElement ? "?private-mode=true" : ""
  }`;
  const categoryColor = RESOURCE_TYPE_COLORS[cardType];
  const categoryName = RESOURCE_TYPE_NAMES[cardType];
  const uri = `/${cardType}/${elementId}${
    isPrivateElement ? "?private-mode=true" : ""
  }`;
  const numberOfClicksAsString = NumberText(numberOfClicks);
  const contributorUserId = contributor.id;

  return (
    <Card
      variant="outlined"
      color={categoryColor}
      sx={{
        width: "100%",
        height: "100%",
        "--Card-radius": "15px",
        "&:hover": {
          borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="2.4">
          {thumbnailImage ? (
            <img src={thumbnailImage.low} loading="lazy" alt="thumbnail" />
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
          component={RouterLink}
          to={uri}
          sx={{ color: "text.tertiary" }}
        >
          <Typography
            level="title-sm"
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
        <Button size="sm" variant="plain" color="primary">
          <Link
            aria-label="Edit this element"
            underline="none"
            component={RouterLink}
            to={updateFormUri}
            sx={{ color: "inherit" }}
          >
            <Typography
              startDecorator={<EditIcon />}
              level="title-sm"
              color="primary"
            >
              Edit
            </Typography>
          </Link>
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
            borderColor: "divider",
          }}
        >
          {categoryName}
        </CardOverflow>
      )}
    </Card>
  );
}
