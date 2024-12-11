import React, { useState } from "react";

import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import ContributorProfileCard from "../components/ContributorProfileCard";
import Header from "../components/Layout/Header";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";

import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import CssBaseline from "@mui/material/CssBaseline";
import { CssVarsProvider} from "@mui/joy/styles";

import { DEFAULT_BODY_HEIGHT } from "../configs/VarConfigs";

export default function AdminPanel() {
  const [userList, setUserList] = useState([
    {
      id: "0",
      name: "Joe Doe",
      role: "Admin",
      org: "University of Illinois Urbana-Champaign",
      email: "joedoe@gmail.com"
    },
    {
      id: "1",
      name: "James Jamerson",
      role: "User",
      org: "University of Arkansas",
      email: "jamesyguy@gmail.com"
    },
    {
      id: "2",
      name: "Ryan Berwick",
      role: "Trusted User",
      org: "Naperville North High School",
      email: "rberw@gmail.com"
    },
    {
      id: "3",
      name: "Michael Kiwanuka",
      role: "Trusted User",
      org: "Royal Academy of Music London",
      email: "michaelkiwanuka@gmail.com"
    }
  ]);

  function deleteContributor(contributorId) {
    const index = userList.findIndex((user) => user["id"] == contributorId);
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
                  <ContributorProfileCard 
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
          </Box>
        </Container>
      </CssVarsProvider>
  )
}

