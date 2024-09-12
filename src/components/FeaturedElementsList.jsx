import React, { useState, useEffect } from "react";

import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import SimpleInfoCard from "./SimpleInfoCard";
import { getHomepageElements } from "../utils/DataRetrieval";

export default function FeaturedElementsList(props) {
  const icon = props.icon;
  const title = props.title;
  const pageLink = props.pageLink;
  const type = props.type;
  const limit = props.limit;

  const [featuredElements, fsetFeaturedElements] = useState([]);

  const [error, setError] = useState(null);

  // When the state of hasSearched changed, check if hasSearched is false. If
  //   it is false, retrieve the featured resources.
  useEffect(() => {
    async function retrieveFeaturedElements() {
      try {
        const data = await getHomepageElements(type, limit);
        fsetFeaturedElements(data);
      } catch (error) {
        setError(error);
      }
    }
    retrieveFeaturedElements();
  }, []);

  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      direction="column"
      sx={{
        backgroundColor: "inherit",
        px: { xs: 2, md: 4 },
        py: 3,
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 2,
        }}
      >
        <Typography level="h3" startDecorator={icon}>
          {title}
        </Typography>
        <Link
          href={pageLink}
          color="inherit"
          style={{ textDecoration: "none" }}
        >
          <Typography startDecorator={<ArrowForwardIcon />}>
            View All
          </Typography>
        </Link>
      </Stack>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        xs={12}
        sx={{ px: 2 }}
      >
        {featuredElements?.map((featuredElement) => (
          <Grid
            container
            key={featuredElement.id}
            xs={12}
            sm={6}
            md={3}
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              px: 2,
              py: { xs: 2, md: 1 },
            }}
          >
            <SimpleInfoCard
              key={featuredElement.id}
              cardtype={featuredElement["resource-type"] + "s"}
              pageId={featuredElement.id}
              title={featuredElement.title}
              contents={featuredElement.contents}
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
