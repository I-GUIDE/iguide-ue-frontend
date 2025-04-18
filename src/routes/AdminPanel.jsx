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
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";

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
  usePageTitle("Admin Panel");

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

  const [ranking, setRanking] = useState({ sortBy: "last_name", order: "asc" });
  const [filterName, setFilterName] = useState("none");
  const [filterValue, setFilterValue] = useState("");
  const [filter, setFilter] = useState({ filterName: "none", filterValue: "" });

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
        const data = await getAllUsers(
          startingIdx,
          itemsPerPage,
          ranking.sortBy,
          ranking.order,
          filter.filterName,
          filter.filterValue
        );

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
  }, [currentStartingIdx, ranking, filter]);

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

  function handleUserListSortingChange(event, newValue) {
    switch (newValue) {
      case "last_name_asc":
        setRanking({
          sortBy: "last_name",
          order: "asc",
        });
        break;
      case "last_name_desc":
        setRanking({
          sortBy: "last_name",
          order: "desc",
        });
        break;
      case "first_name_asc":
        setRanking({
          sortBy: "first_name",
          order: "asc",
        });
        break;
      case "first_name_desc":
        setRanking({
          sortBy: "first_name",
          order: "desc",
        });
        break;
      default:
        TEST_MODE && console.log(`Unknown sorting mechanism: ${newValue}`);
    }
  }

  function handleFilterNameChange(event, newValue) {
    switch (newValue) {
      case "none":
        setFilterName("none");
        break;
      case "last-name":
        setFilterName("last-name");
        break;
      case "first-name":
        setFilterName("first-name");
        break;
      case "affiliation":
        setFilterName("affiliation");
        break;
      case "role-no":
        setFilterName("role-no");
        break;
      default:
        TEST_MODE && console.log(`Unknown filter: ${newValue}`);
    }
    // Only re-render list when there is currently a filterValue applied
    if (newValue === "none" && filter.filterValue) {
      setFilter({ filterName: "none", filterValue: "" });
      handlePageClick(undefined, 1);
    }
    setFilterValue("");
  }

  function handleFilterValueChangeForRoles(event, newValue) {
    // Will trigger re-rendering only when there is a valid role number
    if (newValue) {
      setFilterName("role-no");
      setFilterValue(newValue);
      setFilter({ filterName: "role-no", filterValue: newValue });
      handlePageClick(undefined, 1);
    }
  }

  function handleFilterValueChange(event) {
    const val = event.target.value;
    setFilterValue(val);
  }

  // Will trigger re-rendering
  function handleFilterButtonClick(event) {
    setFilter({ filterName: filterName, filterValue: filterValue });
    handlePageClick(undefined, 1);
  }

  // Will trigger re-rendering
  function handleResetButtonClick(event) {
    setFilter({ filterName: "none", filterValue: "" });
    setFilterName("none");
    setFilterValue("");
    handlePageClick(undefined, 1);
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
                  direction={{ xs: "column", md: "row" }}
                  justifyContent={{ xs: "center", md: "space-between" }}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={1}
                >
                  {/* If no results, don't render */}
                  {resultLength !== 0 ? (
                    <Typography>
                      Showing {currentStartingIdx + 1}-
                      {currentStartingIdx + resultLength} of{" "}
                      {numberOfTotalItems}
                    </Typography>
                  ) : (
                    <Typography color="danger">No results returned</Typography>
                  )}
                  <Stack direction="row" spacing={1}>
                    <Stack
                      sx={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography level="body-xs">Sort by</Typography>
                      <Select
                        defaultValue="last_name_asc"
                        onChange={handleUserListSortingChange}
                        sx={{ width: 170 }}
                      >
                        <Option value="last_name_asc">Last Name</Option>
                        <Option value="last_name_desc">Last Name (Z-A)</Option>
                        <Option value="first_name_asc">First Name</Option>
                        <Option value="first_name_desc">
                          First Name (Z-A)
                        </Option>
                      </Select>
                    </Stack>
                    <Stack
                      sx={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography level="body-xs">Filter Name</Typography>
                      <Select
                        defaultValue="none"
                        value={filterName || "none"}
                        onChange={handleFilterNameChange}
                        sx={{ width: 130 }}
                      >
                        <Option value="none">No Filter</Option>
                        <Option value="role-no">Role</Option>
                        <Option value="affiliation">Affiliation</Option>
                        <Option value="last-name">Last Name</Option>
                        <Option value="first-name">First Name</Option>
                      </Select>
                    </Stack>
                    <Stack
                      sx={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography level="body-xs">Filter Value</Typography>
                      <Stack direction="row" spacing={1}>
                        {filterName === "role-no" ? (
                          <Select
                            value={filterValue || ""}
                            name="role"
                            onChange={handleFilterValueChangeForRoles}
                            sx={{ width: 210 }}
                          >
                            <Option value={1}>Super Admin (1)</Option>
                            <Option value={2}>Admin (2)</Option>
                            <Option value={3}>Moderator (3)</Option>
                            <Option value={4}>Trusted User Plus (4)</Option>
                            <Option value={8}>Trusted User (8)</Option>
                            <Option value={10}>User (10)</Option>
                          </Select>
                        ) : (
                          <>
                            <Input
                              disabled={filterName === "none"}
                              value={filterValue || ""}
                              onChange={handleFilterValueChange}
                              sx={{ maxWidth: 180 }}
                            />
                            <Button
                              size="sm"
                              disabled={filterName === "none" || !filterValue}
                              onClick={handleFilterButtonClick}
                            >
                              GO
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outlined"
                          disabled={filterName === "none"}
                          onClick={handleResetButtonClick}
                        >
                          Reset
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <>
                    <Grid
                      container
                      spacing={3}
                      columns={12}
                      sx={{ flexGrow: 1 }}
                      justifyContent="flex-start"
                    >
                      {userList?.map((user) => (
                        <Grid key={user.id} size={{ xs: 12, lg: 6 }}>
                          <UserProfileCard
                            id={user.id}
                            firstName={user["first-name"]}
                            lastName={user["last-name"]}
                            role={user.role}
                            affiliation={user.affiliation}
                            email={user.email}
                            avatar={user["avatar-url"]?.low}
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
