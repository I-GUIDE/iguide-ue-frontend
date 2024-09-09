import React, { useState, useEffect } from "react";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

import DatasetIcon from "@mui/icons-material/Dataset";
import CodeIcon from "@mui/icons-material/Code";
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";

import FeaturedElementsList from "../components/FeaturedElementsList";
import SearchBar from "../components/SearchBar";
import { getHomepageElements } from "../utils/DataRetrieval";
import {
  HOME_BODY_HEIGHT,
  HOME_SEARCH_SEC_HEIGHT,
} from "../configs/VarConfigs";

export default function Home() {
  const [featuredElements, fsetFeaturedElements] = useState([]);

  const [error, setError] = useState(null);

  // When the state of hasSearched changed, check if hasSearched is false. If
  //   it is false, retrieve the featured resources.
  useEffect(() => {
    async function retrieveFeaturedElements() {
      try {
        const data = await getHomepageElements();
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
        <Box
          component="main"
          sx={{
            minHeight: HOME_BODY_HEIGHT,
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "100%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <Card
            component="li"
            sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}
          >
            <CardCover>
              <img
                src="/images/network-bg.png"
                loading="lazy"
                alt="Network with nodes and connections"
              />
            </CardCover>
            <CardContent
              sx={{
                justifyContent: "center",
                alignItems: "center",
                minHeight: HOME_SEARCH_SEC_HEIGHT,
              }}
            >
              <Container maxWidth="md">
                <Box
                  component="main"
                  sx={{
                    height: "25%",
                    display: "grid",
                    gridTemplateColumns: { xs: "auto", md: "100%" },
                    gridTemplateRows: "auto 1fr auto",
                  }}
                >
                  <Typography
                    level="h1"
                    textColor={"#000"}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      pt: 4,
                      pb: 0.5,
                    }}
                    endDecorator={
                      <Chip component="span" size="sm" color="primary">
                        BETA
                      </Chip>
                    }
                    justifyContent="center"
                  >
                    <Stack
                      direction={{ sx: "column", sm: "row" }}
                      spacing={0}
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="/images/iguide-word-color.png"
                        loading="lazy"
                        alt="I-GUIDE"
                      />
                      <img
                        src="/images/platform-word-gray.png"
                        loading="lazy"
                        alt="Platform"
                      />
                    </Stack>
                  </Typography>
                  <Typography
                    level="title-lg"
                    textColor={"#696969"}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      pt: 0.5,
                      pb: 4,
                    }}
                    justifyContent="center"
                  >
                    Harnessing the Geospatial Data Revolution to Empower
                    Convergence Science
                  </Typography>
                  <SearchBar />
                </Box>
              </Container>
            </CardContent>
          </Card>
          <Box
            sx={{
              bgcolor: "#fafafa",
              display: "grid",
              gridTemplateColumns: { xs: "auto", md: "100%" },
              gridTemplateRows: "auto 1fr auto",
              pb: 8,
            }}
          >
            <Container maxWidth="lg">
              <FeaturedElementsList
                featuredElements={featuredElements}
                icon={<DatasetIcon />}
                title="Datasets"
                elementsPage="/datasets"
              />
              <FeaturedElementsList
                featuredElements={featuredElements}
                icon={<CodeIcon />}
                title="Notebooks"
                elementsPage="/notebooks"
              />
              <FeaturedElementsList
                featuredElements={featuredElements}
                icon={<ArticleIcon />}
                title="Publications"
                elementsPage="/publications"
              />
              <FeaturedElementsList
                featuredElements={featuredElements}
                icon={<SchoolIcon />}
                title="Educational Resources"
                elementsPage="/oers"
              />
            </Container>
          </Box>
        </Box>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
