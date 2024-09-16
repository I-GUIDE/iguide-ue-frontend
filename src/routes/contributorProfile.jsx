import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/material/Grid2";

import UserProfileHeader from "../components/UserProfileHeader";
import usePageTitle from "../hooks/usePageTitle";
import ElementGrid from "../components/ElementGrid";

import { USER_PROFILE_BODY_HEIGHT } from "../configs/VarConfigs";
import { getNumberOfContributions } from "../utils/DataRetrieval";
import { fetchUser } from "../utils/UserManager";

export default function ContributorProfile() {
  usePageTitle("User Profile");

  const userId = decodeURIComponent(useParams().id);

  const [contributorInfo, setContributorInfo] = useState({});
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);

  // When users select a new page or when there is a change of total items,
  //   retrieve the data
  useEffect(() => {
    async function getContributorInfo(uid) {
      const user = await fetchUser(uid);
      const tally = await getNumberOfContributions(uid);
      setNumberOfTotalItems(tally);

      setContributorInfo({
        first_name: user["first_name"],
        last_name: user["last_name"],
        email: user["email"],
        affiliation: user["affiliation"],
        bio: user["bio"],
        avatar_url: user["avatar_url"],
        openid: user["openid"],
      });
    }
    getContributorInfo(userId);
  }, [userId]);

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        {contributorInfo && (
          <UserProfileHeader
            userInfo={contributorInfo}
            contributionCount={numberOfTotalItems}
          />
        )}
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: USER_PROFILE_BODY_HEIGHT,
              display: "grid",
              width: "100%",
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
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <ElementGrid
                  fieldName="contributor"
                  matchValue={userId}
                  noElementMsg="This user doesn't have any contribution"
                  showElementType
                />
              </Stack>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
