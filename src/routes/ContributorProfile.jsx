import { useState, useEffect } from "react";
import { useParams } from "react-router";

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

import UserProfileHeader from "../features/UserProfile/UserProfileHeader";
import usePageTitle from "../hooks/usePageTitle";
import ElementGrid from "../components/Layout/ElementGrid";

import { USER_PROFILE_BODY_HEIGHT } from "../configs/VarConfigs";
import { getNumberOfContributions } from "../utils/DataRetrieval";
import { fetchUser } from "../utils/UserManager";
import { useMeta } from "../meta/MetaContext";
import { defaultMeta } from "../meta/MetaProvider";

export default function ContributorProfile() {
  const userId = decodeURIComponent(useParams().id);

  const [contributorInfo, setContributorInfo] = useState({});
  const [contributorInfoLoading, setContributorInfoLoading] = useState(true);
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);

  const { setPageMeta } = useMeta();

  // When users select a new page or when there is a change of total items,
  //   retrieve the data
  useEffect(() => {
    async function getContributorInfo(uid) {
      const user = await fetchUser(uid);
      const tally = await getNumberOfContributions(uid);
      setNumberOfTotalItems(tally);

      setContributorInfo({
        first_name: user["display-first-name"],
        last_name: user["display-last-name"],
        affiliation: user.affiliation,
        bio: user.bio,
        avatar_url: user["avatar-url"],
        id: user.id,
        role: user.role,
        gitHubLink: user.gitHubLink,
        linkedInLink: user.linkedInLink,
        googleScholarLink: user.googleScholarLink,
        personalWebsiteLink: user.personalWebsiteLink,
        createdAt: user["created-at"],
      });
      setContributorInfoLoading(false);

      setPageMeta((prev) => ({
        ...prev,
        title: `${user["display-first-name"]} ${user["display-last-name"]}`,
        description: user.affiliation,
        imageUrl: user["avatar-url"]?.high,
        url: window.location.href,
      }));
    }
    getContributorInfo(userId);

    // Reset pageMeta to default
    return function () {
      return setPageMeta(defaultMeta);
    };
  }, [setPageMeta, userId]);

  const pageTitle = contributorInfo.first_name
    ? contributorInfo.first_name + " " + contributorInfo.last_name
    : "Contributor Profile";

  usePageTitle(pageTitle);

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        {contributorInfo && (
          <UserProfileHeader
            userInfo={contributorInfo}
            contributionCount={numberOfTotalItems}
            loading={contributorInfoLoading}
            hideEmail
          />
        )}
        <Container maxWidth="lg">
          <Box
            component="main"
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
                px: { xs: 1, md: 2, lg: 4 },
                py: 4,
              }}
            >
              <ElementGrid
                uriPrefix={"/contributor/" + userId}
                fieldName="contributor"
                matchValue={userId}
                noElementMsg="This user doesn't have any contribution"
                showElementType
              />
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
