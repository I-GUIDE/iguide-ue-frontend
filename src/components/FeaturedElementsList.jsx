import React, { useState, useEffect } from "react";

import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import SimpleInfoCard from "./SimpleInfoCard";
import { RESOURCE_TYPE_NAMES } from "../configs/VarConfigs";

export default function FeaturedElementsList(props) {
  const featuredElements = props.featuredElements;
  const icon = props.icon;
  const title = props.title;
  const elementsPage = props.elementsPage;

  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      direction="column"
      sx={{
        backgroundColor: "inherit",
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          level="h3"
          sx={{
            px: 2,
            py: 1,
          }}
          startDecorator={icon}
        >
          {title}
        </Typography>
        <Link
          href={elementsPage}
          color="inherit"
          style={{ textDecoration: "none" }}
        >
          <Typography
            sx={{
              px: 2,
              py: 1,
            }}
            startDecorator={<ArrowForwardIcon />}
          >
            View All
          </Typography>
        </Link>
      </Stack>
      <Grid container direction="row" justifyContent="center" xs={12}>
        {featuredElements?.map((featuredElement) => (
          <Grid
            container
            key={featuredElement._id}
            xs={12}
            sm={6}
            md={3}
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              px: 2,
              py: 1,
            }}
          >
            <SimpleInfoCard
              key={featuredElement._id}
              cardtype={featuredElement["resource-type"] + "s"}
              pageId={featuredElement._id}
              title={featuredElement.title}
              thumbnailImage={featuredElement["thumbnail-image"]}
              minHeight="100%"
              width="100%"
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
