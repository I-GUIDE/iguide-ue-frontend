import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router";

import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
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

import InfoCard from "../../components/InfoCard";
import { getHomepageElements } from "../../utils/DataRetrieval";

import { TAGLINES } from "../../configs/Texts";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function FeaturedElementsList(props) {
  const icon = props.icon;
  const title = props.title;
  const pageLink = props.pageLink;
  const type = props.type;
  const limit = props.limit;

  const [featuredElements, setFeaturedElements] = useState([]);

  const [error, setError] = useState(null);

  // When the state of hasSearched changed, check if hasSearched is false. If
  //   it is false, retrieve the featured resources.
  useEffect(() => {
    async function retrieveFeaturedElements() {
      try {
        const data = await getHomepageElements(type, limit);
        if (!data) {
          TEST_MODE && console.log("No featured elements returned for", type);
        }
        setFeaturedElements(data);
      } catch (error) {
        setError(error);
      }
    }
    retrieveFeaturedElements();
  }, [limit, type]);

  // Don't render if no featured elements returned
  if (!featuredElements || featuredElements.length === 0) {
    return null;
  }

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
            <Link component={RouterLink} to={pageLink} color="inherit">
              <Typography startDecorator={<ArrowForwardIcon />}>
                View More
              </Typography>
            </Link>
          </Stack>
          <Typography level="body-sm" textColor="#696969">
            {TAGLINES[type]}
          </Typography>
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
                  cardtype={featuredElement["resource-type"]}
                  elementId={featuredElement.id}
                  title={featuredElement.title}
                  contents={featuredElement.contents}
                  thumbnailImage={featuredElement["thumbnail-image"]}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
