import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Pagination from "@mui/material/Pagination";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";

import UserProfileCard from "../components/UserProfileCard";
import Header from "../components/Layout/Header";

import CssBaseline from "@mui/material/CssBaseline";

import { CssVarsProvider} from "@mui/joy/styles";
import { DEFAULT_BODY_HEIGHT } from "../configs/VarConfigs";

import { fetchWithAuth } from "../utils/FetcherWithJWT";
import { PERMISSIONS } from "../configs/Permissions";

const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function AdminPanel() {
  // Format as list of objects with attributes: id, name role, org, email
  const [userList, setUserList] = useState([]); 

  useEffect(() => {
    const fetchAllUsers = async () => {
        const response = await fetchWithAuth(
          `${BACKEND_URL_PORT}/api/users`,
          {
            method: "GET",
          }
        );
        const result = await response.json();
        TEST_MODE && console.log("Response - all users", result);
      };
      
      fetchAllUsers();
    }, []);

  function deleteContributor(contributorId) {
    const index = userList.findIndex((user) => user["id"] === contributorId);
    const newArray = [...userList.slice(0, index), ...userList.slice(index + 1)];
    setUserList(newArray);
  }

  return(
      <CssVarsProvider disableTransitionOnChange>
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
              container
              spacing={2}
              // direction="column"
              sx={{
                backgroundColor: "inherit",
                p: 4,
              }}
            >
              {userList?.map((user) => (
                <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <UserProfileCard 
                    id = {user.id}
                    name = {user.name} 
                    role = {user.role}
                    org = {user.org}
                    email = {user.email}
                    avatar = "https://backend.i-guide.io/user-uploads/avatars/1722637076955-dsc07617.jpg"
                    deleteContributor = {deleteContributor}
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
              {/* <Pagination
                count={1}
                color="primary"
                page={1}
                onChange={handlePageClick}
              /> */}
            </Stack>
            
          </Box>
        </Container>
      </CssVarsProvider>
  );
}

