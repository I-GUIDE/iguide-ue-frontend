import React from "react";

import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

import SearchBar from "../components/SearchBar";
import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function SearchHome() {
  usePageTitle("Search");

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            height: NO_HEADER_BODY_HEIGHT,
          }}
        >
          <Card
            variant="plain"
            component="li"
            sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}
          >
            <CardCover>
              <img src="/images/network-bg.png" loading="lazy" alt="" />
            </CardCover>
            <CardContent
              sx={{ justifyContent: "center", alignItems: "center" }}
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
                      py: 1.5,
                    }}
                    endDecorator={
                      <Chip component="span" color="primary" size="sm">
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
                  <SearchBar
                    placeholder="Start your exploration..."
                    showTrendingSearchKeywords
                    showSmartSearch
                  />
                  {/* Box to keep the search bar afloat */}
                  <Box
                    sx={{
                      height: `calc(100vh * 0.3)`,
                    }}
                  />
                </Box>
              </Container>
            </CardContent>
          </Card>
        </Box>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
