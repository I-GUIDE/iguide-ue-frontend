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
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";

import SearchBar from "../components/SearchBar";
import { NAVBAR_HEIGHT, NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";
import Logo from "../components/Logo";

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
            sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}
          >
            <CardCover>
              <img src="/images/network-bg.png" loading="lazy" alt="" />
            </CardCover>
            <CardContent
              sx={{
                justifyContent: "center",
                alignItems: "center",
                pt: NAVBAR_HEIGHT / 8,
              }}
            >
              <Container maxWidth="md">
                <Box
                  component="main"
                  gap={3}
                  sx={{
                    height: "25%",
                    display: "grid",
                    gridTemplateColumns: { xs: "auto", md: "100%" },
                    gridTemplateRows: "auto 1fr auto",
                  }}
                >
                  <Logo
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      py: 1.5,
                    }}
                  />
                  <SearchBar
                    placeholder="Start your exploration..."
                    showTrendingSearchKeywords
                    showSmartSearch
                  />
                  {/* Box to keep the search bar afloat */}
                  <Box
                    sx={{
                      height: `calc(100vh * 0.25)`,
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
