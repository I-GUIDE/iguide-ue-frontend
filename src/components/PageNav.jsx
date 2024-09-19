import * as React from "react";

import { Link as RouterLink } from "react-router-dom";

import Stack from "@mui/joy/Stack";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import HomeIcon from "@mui/icons-material/Home";

import { stringTruncator } from "../helpers/helper";

export default function PageNav(props) {
  const parentPages = props.parentPages ? props.parentPages : [];
  const currentPage = stringTruncator(props.currentPage, 0, 30);
  const fontLevel = props.fontLevel ? props.fontLevel : "body-xs";
  const sx = props.sx;

  if (!currentPage) {
    return null;
  }

  return (
    <Stack
      alignItems="flex-start"
      justifyContent="center"
      sx={{ width: "100%" }}
    >
      <Breadcrumbs separator="›" aria-label="breadcrumbs" sx={sx}>
        <Link color="neutral" component={RouterLink} to="/">
          <Typography level={fontLevel} startDecorator={<HomeIcon />}>
            Home
          </Typography>
        </Link>
        {parentPages.map((parentPage) => (
          <Link
            key={parentPage[0]}
            color="neureal"
            component={RouterLink}
            to={parentPage[1]}
          >
            <Typography level={fontLevel}>{parentPage[0]}</Typography>
          </Link>
        ))}
        <Typography level={fontLevel}>{currentPage}</Typography>
      </Breadcrumbs>
    </Stack>
  );
}
