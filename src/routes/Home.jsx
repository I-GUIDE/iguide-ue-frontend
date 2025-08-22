import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import { useTour } from "@reactour/tour";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";

import MapIcon from "@mui/icons-material/Map";
import DatasetIcon from "@mui/icons-material/Dataset";
import CodeIcon from "@mui/icons-material/Code";
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import GitHubIcon from "@mui/icons-material/GitHub";

import FeaturedElementsList from "../features/Home/FeaturedElementsList";
import TutorialCard from "../features/Home/TutorialCard";
import SearchBar from "../components/SearchBar";
import FloatingButton from "../components/FloatingButton";
import usePageTitle from "../hooks/usePageTitle";
import Logo from "../components/Logo";

const JUPYTER_TUTORIAL_EID = import.meta.env.VITE_JUPYTER_TUTORIAL_EID;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

import {
  NO_HEADER_BODY_HEIGHT,
  HOME_SEARCH_SEC_HEIGHT,
  NAVBAR_HEIGHT,
} from "../configs/VarConfigs";

export default function Home() {
  usePageTitle("", true);

  const { setIsOpen } = useTour();

  function startTour() {
    if (window.innerWidth >= 1200) {
      TEST_MODE && console.log("Start tour");
      setIsOpen(true);
    } else {
      TEST_MODE && console.log("Cannot start tour: page is too small");
    }
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Box
          component="main"
          sx={{
            minHeight: NO_HEADER_BODY_HEIGHT,
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "100%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <Card
            variant="plain"
            component="li"
            sx={{
              bgcolor: "#fff",
              borderRadius: 0,
              minWidth: 300,
              flexGrow: 1,
            }}
          >
            <CardCover>
              <img
                src="/images/network-bg.png"
                alt="Network with nodes and connections"
              />
            </CardCover>
            <CardContent
              sx={{
                justifyContent: "flex-end",
                alignItems: "center",
                minHeight: HOME_SEARCH_SEC_HEIGHT,
                pt: NAVBAR_HEIGHT / 8,
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
                    pb: 1,
                  }}
                >
                  <Logo
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      pt: 4,
                      pb: 0.5,
                    }}
                  />
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
                    align="center"
                  >
                    Harnessing the Geospatial Data Revolution to Empower
                    Convergence Science
                  </Typography>
                  <Box>
                    <SearchBar
                      placeholder="Start your exploration..."
                      showTrendingSearchKeywords
                      showSmartSearch
                    />
                  </Box>
                </Box>
              </Container>
            </CardContent>
          </Card>
          <Box
            sx={{
              bgcolor: "#fff",
              display: "grid",
              gridTemplateColumns: { xs: "auto", md: "100%" },
              gridTemplateRows: "auto 1fr auto",
              py: 4,
            }}
          >
            <Container maxWidth="lg">
              <Stack
                direction="column"
                alignItems="center"
                spacing={2}
                sx={{
                  backgroundColor: "inherit",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: "50px", md: "100px" }}
                  sx={{
                    backgroundColor: "inherit",
                    py: "50px",
                  }}
                >
                  <Box className="tourid-6">
                    <TutorialCard
                      iconImage="/images/homepage/map.png"
                      title="Map"
                      link="/element-map"
                      content="Transform geospatial data to knowledge and insights"
                      bgColor="#fff"
                      inColumn
                    />
                  </Box>
                  <Box className="tourid-7">
                    <TutorialCard
                      iconImage="/images/homepage/network.png"
                      title="Connect"
                      link="/element-network"
                      content="Gain holistic understanding of linked knowledge elements"
                      bgColor="#fff"
                      inColumn
                    />
                  </Box>
                  <Box className="tourid-8">
                    <TutorialCard
                      iconImage="/images/homepage/search.png"
                      title="Discover"
                      link="/search-home"
                      content="Seek new convergence knowledge through intelligent search"
                      bgColor="#fff"
                      inColumn
                    />
                  </Box>
                </Stack>
              </Stack>
            </Container>
          </Box>
          <Box
            sx={{
              bgcolor: "#fafafa",
              display: "grid",
              gridTemplateColumns: { xs: "auto", md: "100%" },
              gridTemplateRows: "auto 1fr auto",
              pt: 4,
              pb: 8,
            }}
          >
            <Container maxWidth="lg">
              <Stack
                direction="column"
                alignItems="center"
                spacing={4}
                sx={{
                  backgroundColor: "inherit",
                  py: "50px",
                }}
              >
                <Typography level="h3" textColor="#000">
                  What to do next?
                </Typography>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: 4, md: 10 }}
                >
                  <TutorialCard
                    iconImage="/images/homepage/verify.png"
                    title="Register"
                    content="Become a member of the I-GUIDE community"
                    link="/user-profile"
                    bgColor="#fafafa"
                  />
                  <TutorialCard
                    iconImage="/images/homepage/reading-book.png"
                    title="Learn"
                    content="Explore the power of I-GUIDE Platform"
                    link={"/notebooks/" + JUPYTER_TUTORIAL_EID}
                    bgColor="#fafafa"
                  />
                  <TutorialCard
                    iconImage="/images/homepage/jigsaw.png"
                    title="Contribute"
                    content="Share your knowledge with our community"
                    link="/user-profile"
                    bgColor="#fafafa"
                  />
                </Stack>
              </Stack>
              <Stack direction="column" spacing={2}>
                <FeaturedElementsList
                  icon={<MapIcon />}
                  title="Maps"
                  pageLink="/maps"
                  type="map"
                  limit={4}
                />
                <FeaturedElementsList
                  icon={<DatasetIcon />}
                  title="Datasets"
                  pageLink="/datasets"
                  type="dataset"
                  limit={4}
                />
                <FeaturedElementsList
                  icon={<CodeIcon />}
                  title="Notebooks"
                  pageLink="/notebooks"
                  type="notebook"
                  limit={4}
                />
                <FeaturedElementsList
                  icon={<ArticleIcon />}
                  title="Publications"
                  pageLink="/publications"
                  type="publication"
                  limit={4}
                />
                <FeaturedElementsList
                  icon={<SchoolIcon />}
                  title="Educational Resources"
                  pageLink="/oers"
                  type="oer"
                  limit={4}
                />
                <FeaturedElementsList
                  icon={<GitHubIcon />}
                  title="Code"
                  pageLink="/code"
                  type="code"
                  limit={4}
                />
              </Stack>
            </Container>
          </Box>
        </Box>
        <Box sx={{ display: { xs: "none", lg: "flex" } }}>
          <FloatingButton onClick={startTour} label="🚀 Tour" />
        </Box>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
