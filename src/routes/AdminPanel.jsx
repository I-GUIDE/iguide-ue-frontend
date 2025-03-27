import React, { useEffect, useState } from "react";

import { useNavigate, useSearchParams, useOutletContext } from "react-router";

import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Pagination from "@mui/material/Pagination";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";

import UserProfileCard from "../components/UserProfileCard";
import Header from "../components/Layout/Header";
import LoginCard from "../components/LoginCard";
import usePageTitle from "../hooks/usePageTitle";

import {
  DEFAULT_BODY_HEIGHT,
  NO_HEADER_BODY_HEIGHT,
} from "../configs/VarConfigs";
import { arrayLength } from "../helpers/helper";
import { getAllUsers } from "../utils/UserManager";
import { PERMISSIONS } from "../configs/Permissions";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function AdminPanel() {
  usePageTitle("User Profile");

  // OutletContext retrieving the user object to display user info
  const { isAuthenticated, localUserInfo } = useOutletContext();

  const navigate = useNavigate();
  const [pageParam, setPageParam] = useSearchParams();
  const itemsPerPage = 24;
  const uriPrefix = "/admin-panel";

  const fromPageParam =
    pageParam.get("page") >= 1 ? parseInt(pageParam.get("page")) : 1;

  const initialStartingIdx = (fromPageParam - 1) * itemsPerPage;
  // Format as list of objects with attributes: id, first/last name, role, affiliation, email, avatar
  const [userList, setUserList] = useState([]);

  const [currentPage, setCurrentPage] = useState(fromPageParam);
  const [currentStartingIdx, setCurrentStartingIdx] =
    useState(initialStartingIdx);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);
  const [resultLength, setResultLength] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // Check if the current user is super admin, if yes, allow edit
  const canAccess =
    typeof localUserInfo?.role === "number" &&
    localUserInfo?.role <= PERMISSIONS["super_admin"];

  useEffect(() => {
    async function fetchAllUsers(startingIdx) {
      setLoading(true);
      try {
        const data = await getAllUsers(startingIdx, itemsPerPage);

        setNumberOfTotalItems(data["total-users"]);
        setNumberOfPages(Math.ceil(data["total-users"] / itemsPerPage));
        setUserList(data.users);
        setLoading(false);
        setResultLength(arrayLength(data.users));
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    fetchAllUsers(currentStartingIdx);
  }, [currentStartingIdx]);

  function deleteUser(contributorId) {
    const index = userList.findIndex((user) => user["id"] === contributorId);
    const newArray = [
      ...userList.slice(0, index),
      ...userList.slice(index + 1),
    ];
    setUserList(newArray);
  }

  function handlePageClick(event, newPageNumber) {
    const newStartingIdx = (newPageNumber - 1) * itemsPerPage;
    setCurrentStartingIdx(newStartingIdx);
    setPageParam({ page: newPageNumber });
    TEST_MODE &&
      console.log("Navigating to", `${uriPrefix}?page=${newPageNumber}`);
    navigate(`${uriPrefix}?page=${newPageNumber}`, { replace: true });
    setCurrentPage(newPageNumber);
    window.scrollTo(0, 0);
  }

  // If the user is not authenticated/logged in, they will be redirected to the login page
  if (!isAuthenticated) {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline />
          <Container maxWidth="lg">
            <Box
              component="main"
              sx={{
                minHeight: NO_HEADER_BODY_HEIGHT,
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
                  minHeight: NO_HEADER_BODY_HEIGHT,
                  backgroundColor: "inherit",
                  px: { xs: 2, md: 4 },
                  pt: 4,
                  pb: 8,
                }}
              >
                <LoginCard />
              </Grid>
            </Box>
          </Container>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    );
  }

  if (!canAccess) {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Typography level="title-lg" color="warning">
            You do not have permission to access this page.
          </Typography>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    );
  }

  if (loading) {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    );
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline />
        <Header
          title="Admin Panel"
          subtitle="Administrator Options"
          icon={<AdminPanelSettings />}
          currentPage={"Admin Panel"}
        />
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
              rowSpacing={2}
              sx={{
                backgroundColor: "inherit",
                p: 4,
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>
                    Showing {currentStartingIdx + 1}-
                    {currentStartingIdx + resultLength} of {numberOfTotalItems}
                  </Typography>
                </Stack>
                <Grid
                  container
                  spacing={3}
                  columns={12}
                  sx={{ flexGrow: 1 }}
                  justifyContent="flex-start"
                >
                  {userList?.map((user) => (
                    <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <UserProfileCard
                        id={user.id}
                        firstName={user["first-name"]}
                        lastName={user["last-name"]}
                        role={user.role}
                        affiliation={user.affiliation}
                        email={user.email}
                        avatar={user["avatar-url"]?.low}
                        deleteUser={deleteUser}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                  sx={{
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
              </Stack>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
