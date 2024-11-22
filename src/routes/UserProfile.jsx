import { React, useState, useEffect } from "react";

import { useOutletContext } from "react-router-dom";

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
import Grid from "@mui/joy/Grid";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";

import Header from "../components/Layout/Header";
import LoginCard from "../components/LoginCard";
import UserProfileHeader from "../features/UserProfile/UserProfileHeader";
import UserProfileEditCard from "../features/UserProfile/UserProfileEditCard";
import usePageTitle from "../hooks/usePageTitle";
import ElementGrid from "../components/Layout/ElementGrid";

import {
  DEFAULT_BODY_HEIGHT,
  USER_PROFILE_BODY_HEIGHT,
} from "../configs/VarConfigs";
import { getNumberOfContributions } from "../utils/DataRetrieval";

const USE_DEMO_USER = import.meta.env.VITE_USE_DEMO_USER === "true";
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function UserProfile() {
  usePageTitle("User Profile");

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
      if (
        localUserInfo.first_name &&
        localUserInfo.last_name &&
        localUserInfo.email &&
        localUserInfo.affiliation
      ) {
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
    return (
      <JoyCssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Header title="Please login to continue" subtitle="" />
        <Container maxWidth="lg">
          <Box
            component="main"
            sx={{
              minHeight: DEFAULT_BODY_HEIGHT,
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
                minHeight: DEFAULT_BODY_HEIGHT,
                backgroundColor: "inherit",
                px: { xs: 2, md: 4 },
                pt: 4,
                pb: 8,
              }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <LoginCard />
              </Stack>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    );
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
                  px: { xs: 2, md: 4 },
                  pt: 4,
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
            localUserInfo={localUserInfo}
            contributionCount={numberOfTotalItems}
            loading={localUserInfoLoading}
            allowProfileOps
          />
        )}
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
              direction="column"
              sx={{
                minHeight: USER_PROFILE_BODY_HEIGHT,
                backgroundColor: "inherit",
                px: { xs: 2, md: 4 },
                pt: 4,
                pb: 8,
              }}
            >
              <Tabs
                aria-label="Search-filter-by-types"
                defaultValue="public"
                value={elementDisplayOption}
                onChange={handleElementDisplayOptionChange}
                sx={{ mb: 2, bgcolor: "transparent" }}
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
                    Public Elements
                  </Tab>
                  <Tab indicatorInset value="private">
                    Private Elements
                  </Tab>
                  <Tab indicatorInset value="bookmarked">
                    Bookmarked Elements
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
                  showUserElementCard
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
