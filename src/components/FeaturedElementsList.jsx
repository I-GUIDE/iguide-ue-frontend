import React, { useState, useEffect } from "react";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Stack from "@mui/joy/Stack";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import InfoCard from "./InfoCard";
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
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Stack spacing={2} sx={{ py: 2 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
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
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Grid
              container
              spacing={2}
              columns={12}
              sx={{ flexGrow: 1 }}
              justifyContent="flex-start"
            >
              {featuredElements?.map((featuredElement) => (
                <Grid key={featuredElement.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <InfoCard
                    cardtype={featuredElement["resource-type"] + "s"}
                    pageid={featuredElement.id}
                    title={featuredElement.title}
                    contents={featuredElement.contents}
                    thumbnailImage={featuredElement["thumbnail-image"]}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
