import * as React from "react";

import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import HomeIcon from "@mui/icons-material/Home";

import { stringTruncator } from "../helpers/helper";

import { RESOURCE_TYPE_COLORS } from "../configs/VarConfigs";

export default function PageNav(props) {
  const parentPages = props.parentPages ? props.parentPages : [];
  const currentPage = stringTruncator(props.currentPage, 0, 30);
  const sx = props.sx;

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumbs" sx={sx}>
      <Link color="neutral" href="/">
        <HomeIcon sx={{ mr: 0.5 }} />
        Home
      </Link>
      {parentPages.map((parentPage) => (
        <Link key={parentPage[0]} color="neureal" href={parentPage[1]}>
          {parentPage[0]}
        </Link>
      ))}
      <Typography>{currentPage}</Typography>
    </Breadcrumbs>
  );
}
