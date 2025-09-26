import { useState, useEffect } from "react";

import { useOutletContext } from "react-router";

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
import Grid from "@mui/material/Grid2";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import Typography from "@mui/joy/Typography";

import PublicIcon from "@mui/icons-material/Public";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import Header from "../components/Layout/Header";
import LoginCard from "../components/LoginCard";
import UserProfileHeader from "../features/UserProfile/UserProfileHeader";
import UserProfileEditCard from "../features/UserProfile/UserProfileEditCard";
import usePageTitle from "../hooks/usePageTitle";
import ElementGrid from "../components/Layout/ElementGrid";
import UserAliases from "../features/UserProfile/UserAliases";

import {
  DEFAULT_BODY_HEIGHT,
  PT_OFFSET,
  USER_PROFILE_BODY_HEIGHT,
} from "../configs/VarConfigs";
import { getNumberOfContributions } from "../utils/DataRetrieval";

const USE_DEMO_USER = import.meta.env.VITE_USE_DEMO_USER === "true";
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function UserProfile() {
  usePageTitle("My Profile");

  // OutletContext retrieving the user object to display user info
  const { isAuthenticated, localUserInfo } = useOutletContext();

  const [userId, setUserId] = useState();

  const [localUserInfoMissing, setLocalUserInfoMissing] = useState("unknown");
  const [error, setError] = useState(null);
  const [localUserInfoLoading, setLocalUserInfoLoading] = useState(true);
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);

  const [elementDisplayOption, setElementDisplayOption] = useState("public");

  // When users select a new page or when there is a change of total items,
  //   retrieve the data
  useEffect(() => {
    async function getTally(uid) {
      const tally = await getNumberOfContributions(uid);
      setNumberOfTotalItems(tally);
    }
    if (localUserInfo) {
      getTally(localUserInfo.id);
      setUserId(localUserInfo.id);
    }
  }, [localUserInfo]);

  // Check if the user exists on the local DB, if not, add the user
  useEffect(() => {
    async function checkLocalUserInfo() {
      if (localUserInfo.first_name && localUserInfo.last_name) {
        setLocalUserInfoMissing("good");
      } else {
        setLocalUserInfoMissing("missing");
      }
    }

    if (localUserInfo) {
      checkLocalUserInfo();
      setLocalUserInfoLoading(false);
    }
  }, [localUserInfo]);

  // When user select a different category in the search bar
  function handleElementDisplayOptionChange(event, value) {
    setElementDisplayOption(value);
    TEST_MODE && console.log("Element display option set to", value);
  }

  if (!isAuthenticated) {
    return <LoginCard />;
  }

  if (error) {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Header title={"Error: " + error.message} />
          <Container maxWidth="lg">
            <Box
              component="main"
              sx={{
                minHeight: DEFAULT_BODY_HEIGHT,
                display: "grid",
                gridTemplateColumns: { xs: "auto", md: "100%" },
                gridTemplateRows: "auto 1fr auto",
              }}
            />
          </Container>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    );
  }

  // If local user information is missing, ask them to fill out the info
  if (localUserInfoMissing === "unknown") {
    return;
  } else if (localUserInfoMissing === "missing") {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Header title="Please complete your profile" />
          <Container maxWidth="lg">
            <Box
              component="main"
              sx={{
                minHeight: USER_PROFILE_BODY_HEIGHT,
                display: "grid",
                gridTemplateColumns: { xs: "auto", md: "100%" },
                gridTemplateRows: "auto 1fr auto",
              }}
            >
              <Grid
                container
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                sx={{
                  minHeight: USER_PROFILE_BODY_HEIGHT,
                  backgroundColor: "inherit",
                  px: { xs: 1, md: 3, lg: 6 },
                  pt: PT_OFFSET,
                  pb: 8,
                }}
              >
                <UserProfileEditCard userProfileEditType="mandatory" />
              </Grid>
            </Box>
          </Container>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    );
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        {localUserInfo && (
          <UserProfileHeader
            userInfo={localUserInfo}
            contributionCount={numberOfTotalItems}
            loading={localUserInfoLoading}
            managementView
          />
        )}
        <Container maxWidth="lg">
          <Box
            component="main"
            gap={1}
            sx={{
              minHeight: USER_PROFILE_BODY_HEIGHT,
              display: "grid",
              gridTemplateColumns: { xs: "auto", md: "100%" },
              gridTemplateRows: "auto 1fr auto",
              py: 4,
            }}
          >
            {localUserInfo && (
              <Box sx={{ px: { xs: 1, md: 2, lg: 4 }, py: 1 }}>
                <UserAliases
                  userInfo={localUserInfo}
                  loading={localUserInfoLoading}
                />
              </Box>
            )}
            <Grid
              container
              display="flex"
              direction="column"
              gap={1}
              sx={{
                backgroundColor: "inherit",
                px: { xs: 1, md: 2, lg: 4 },
                py: 4,
              }}
            >
              <Typography level="title-md" sx={{ textAlign: "center" }}>
                Your Contributions and Bookmarks
              </Typography>
              <Tabs
                aria-label="Search-filter-by-types"
                defaultValue="public"
                value={elementDisplayOption}
                onChange={handleElementDisplayOptionChange}
                sx={{
                  mb: 2,
                  bgcolor: "transparent",
                  width: "100%",
                }}
              >
                <TabList
                  sx={{
                    pt: 1,
                    justifyContent: "center",
                    [`&& .${tabClasses.root}`]: {
                      flex: "initial",
                      bgcolor: "transparent",
                      "&:hover": {
                        bgcolor: "transparent",
                      },
                      [`&.${tabClasses.selected}`]: {
                        color: "primary.plainColor",
                        "&::after": {
                          height: 2,
                          borderTopLeftRadius: 3,
                          borderTopRightRadius: 3,
                          bgcolor: "primary",
                        },
                      },
                    },
                  }}
                >
                  <Tab indicatorInset value="public">
                    <Typography startDecorator={<PublicIcon />}>
                      Public
                    </Typography>
                  </Tab>
                  <Tab indicatorInset value="private">
                    <Typography startDecorator={<VisibilityOffIcon />}>
                      Private
                    </Typography>
                  </Tab>
                  <Tab indicatorInset value="bookmarked">
                    <Typography startDecorator={<BookmarkIcon />}>
                      Bookmarks
                    </Typography>
                  </Tab>
                </TabList>
              </Tabs>
              {elementDisplayOption === "public" &&
                // For testing purposes
                (USE_DEMO_USER && !userId ? (
                  <ElementGrid
                    uriPrefix="/user-profile"
                    headline="Demo contributions"
                    elementType="dataset"
                    noElementMsg="You currently don't have any contributions..."
                    showElementType
                    showUserElementCard
                    disableUriChange
                  />
                ) : (
                  <ElementGrid
                    fieldName="contributor"
                    matchValue={encodeURIComponent(userId)}
                    noElementMsg="You don't have any contributions..."
                    showElementType
                    showUserElementCard
                    disableUriChange
                  />
                ))}
              {elementDisplayOption === "private" && (
                <ElementGrid
                  matchValue={localUserInfo.id}
                  noElementMsg="You don't have any private elements..."
                  showElementType
                  showUserElementCard
                  isPrivateElement
                  disableUriChange
                />
              )}
              {elementDisplayOption === "bookmarked" && (
                <ElementGrid
                  matchValue={localUserInfo.id}
                  noElementMsg="You haven't bookmarked any elements yet..."
                  showElementType
                  isBookmarkedElement
                  disableUriChange
                />
              )}
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
