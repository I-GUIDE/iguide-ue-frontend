import { React, useState, useEffect } from "react";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
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
import Typography from "@mui/joy/Typography";
import Pagination from "@mui/material/Pagination";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import Header from "../components/Layout/Header";
import LoginCard from "../components/LoginCard";
import InfoCard from "../components/InfoCard";
import UserProfileHeader from "../components/UserProfileHeader";
import UserProfileEditCard from "../components/UserProfileEditCard";
import usePageTitle from "../hooks/usePageTitle";

import { elementRetriever } from "../utils/DataRetrieval";
import { arrayLength } from "../helpers/helper";

import { fetchWithAuth } from "../utils/FetcherWithJWT";

import {
  DEFAULT_BODY_HEIGHT,
  USER_PROFILE_BODY_HEIGHT,
} from "../configs/VarConfigs";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;

export default function UserProfile() {
  usePageTitle("User Profile");

  // OutletContext retrieving the user object to display user info
  const [
    isAuthenticated,
    setIsAuthenticated,
    userInfo,
    setUserInfo,
    localUserInfo,
    setLocalUserInfo,
  ] = useOutletContext();
  const [localUserInfoMissing, setLocalUserInfoMissing] = useState("unknown");

  const [metadataList, setMetadataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultLength, setResultLength] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentStartingIdx, setCurrentStartingIdx] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);

  const itemsPerPage = 12;

  // When users select a new page or when there is a change of total items,
  //   retrieve the data
  useEffect(() => {
    async function retrieveData(startingIdx) {
      if (userInfo.sub) {
        const data = await elementRetriever(
          "contributor",
          [userInfo.sub],
          null,
          "_score",
          "desc",
          startingIdx,
          itemsPerPage
        );

        setNumberOfTotalItems(data["total-count"]);
        setNumberOfPages(Math.ceil(numberOfTotalItems / itemsPerPage));
        setMetadataList(data.elements);
        setLoading(false);
        setResultLength(arrayLength(data.elements));
      }
    }
    async function retrieveDemoData(startingIdx) {
      const data = await elementRetriever(
        null,
        null,
        "dataset",
        "_id",
        "desc",
        startingIdx,
        itemsPerPage
      );

      setNumberOfTotalItems(data["total-count"]);
      setNumberOfPages(Math.ceil(numberOfTotalItems / itemsPerPage));
      setMetadataList(data.elements);
      setLoading(false);
      setResultLength(arrayLength(data.elements));
    }
    if (userInfo) {
      if (userInfo.sub === "http://cilogon.org/serverE/users/do-not-use") {
        retrieveDemoData(currentStartingIdx);
      } else {
        retrieveData(currentStartingIdx);
      }
    }
  }, [currentStartingIdx, numberOfTotalItems, userInfo]);

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
        <Container maxWidth="xl">
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

  function handlePageClick(event, value) {
    const newStartingIdx = (value - 1) * itemsPerPage;
    console.log(
      `User requested page number ${value}, which is offset ${newStartingIdx}`
    );
    setCurrentStartingIdx(newStartingIdx);
    setCurrentPage(value);
  }

  if (error) {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Header title={"Error: " + error.message} />
          <Container maxWidth="xl">
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

  async function handleElementDelete(elementId) {
    console.log("Deleting...", elementId);
    try {
      const response = await fetchWithAuth(
        `${USER_BACKEND_URL}/api/elements/${elementId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting resource");
      }

      setDeleteMetadataId(undefined);
      setDeleteMetadataTitle(undefined);

      const result = await response.json();
      // When the deletion was successful, rerender the list
      if (result && result.message === "Resource deleted successfully") {
        setNumberOfTotalItems(numberOfTotalItems - 1);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting resource");
    }
  }

  // If local user information is missing, ask them to fill out the info
  if (localUserInfoMissing === "unknwon") {
    return;
  } else if (localUserInfoMissing === "missing") {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Header title="Please complete your profile" />
          <Container maxWidth="xl">
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
        {userInfo && (
          <UserProfileHeader
            localUserInfo={localUserInfo}
            contributionCount={numberOfTotalItems}
          />
        )}
        <Container maxWidth="xl">
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
              {numberOfTotalItems === 0 && (
                <Box
                  sx={{
                    position: "relative",
                    overflow: "auto",
                    display: "flex",
                  }}
                >
                  <Card
                    variant="outlined"
                    orientation="horizontal"
                    sx={{
                      width: "100%",
                      "&:hover": {
                        boxShadow: "md",
                        borderColor: "neutral.outlinedHoverBorder",
                      },
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid
                          xs={12}
                          justifyContent="center"
                          alignItems="center"
                          display="flex"
                        >
                          <Typography level="title-lg">
                            You currently don't have any contribution...
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                spacing={2}
                width="100%"
              >
                {numberOfTotalItems > 0 && (
                  <>
                    <Stack
                      spacing={2}
                      sx={{
                        px: { xs: 2, md: 4, width: "100%" },
                        pt: 2,
                        minHeight: 0,
                      }}
                    >
                      <Typography level="h3">Your contributions</Typography>
                      <Typography>
                        Showing {currentStartingIdx + 1}-
                        {currentStartingIdx + resultLength} of{" "}
                        {numberOfTotalItems}
                      </Typography>
                      <Grid
                        container
                        spacing={2}
                        columns={12}
                        sx={{ flexGrow: 1 }}
                      >
                        {metadataList?.map((metadata, idx) => (
                          <Grid
                            size={{ xs: 12, sm: 6, md: 3 }}
                            key={metadata._id}
                          >
                            <InfoCard
                              cardtype={metadata["resource-type"] + "s"}
                              pageid={metadata._id}
                              title={metadata.title}
                              authors={metadata.authors}
                              tags={metadata.tags}
                              contents={metadata.contents}
                              thumbnailImage={metadata["thumbnail-image"]}
                              showElementType
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                      sx={{
                        px: { xs: 2, md: 4, width: "100%" },
                        pt: 2,
                        minHeight: 0,
                      }}
                    >
                      <Pagination
                        count={numberOfPages}
                        color="primary"
                        page={currentPage}
                        onChange={handlePageClick}
                      />
                    </Stack>
                  </>
                )}
              </Stack>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
