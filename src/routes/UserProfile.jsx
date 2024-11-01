import { React, useState, useEffect } from "react";
import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import { useOutletContext } from "react-router-dom";

import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";

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

export default function UserProfile() {
  usePageTitle("User Profile");

  // OutletContext retrieving the user object to display user info
  const { isAuthenticated, localUserInfo } = useOutletContext();

  const [userId, setUserId] = useState();

  const [localUserInfoMissing, setLocalUserInfoMissing] = useState("unknown");
  const [error, setError] = useState(null);
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);

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
    }
  }, [localUserInfo]);

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
              {/* For testing purposes */}
              {USE_DEMO_USER ? (
                <ElementGrid
                  uriPrefix="/user-profile"
                  headline="Demo contributions"
                  elementType="dataset"
                  noElementMsg="You currently don't have any contributions..."
                  showElementType
                />
              ) : (
                <ElementGrid
                  uriPrefix="/user-profile"
                  headline="Your contributions"
                  fieldName="contributor"
                  matchValue={encodeURIComponent(userId)}
                  noElementMsg="You currently don't have any contributions..."
                  showElementType
                />
              )}
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}