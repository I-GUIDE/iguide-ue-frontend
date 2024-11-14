import React from "react";
import { useOutletContext } from "react-router-dom";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";

import LockIcon from "@mui/icons-material/Lock";

import ElementGrid from "../components/Layout/ElementGrid";
import Header from "../components/Layout/Header";
import LoginCard from "../components/LoginCard";

import { DEFAULT_BODY_HEIGHT } from "../configs/VarConfigs";

export default function UserPrivateElements() {
  const { isAuthenticated, localUserInfo } = useOutletContext();

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

  if (!localUserInfo) {
    return null;
  }

  return (
    <JoyCssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header
        title="Private Elements"
        subtitle="Only you can see the listed elements here"
        currentPage="Private Elements"
        parentPages={[["User Profile", "/user-profile"]]}
        icon={<LockIcon />}
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
            rowSpacing={2}
            direction="column"
            sx={{
              backgroundColor: "inherit",
              p: 4,
            }}
          >
            <ElementGrid
              uriPrefix={"/private-elements"}
              matchValue={localUserInfo.id}
              noElementMsg="No private element returned"
              showElementType
              showUserElementCard
              isPrivateElement
            />
          </Grid>
        </Box>
      </Container>
    </JoyCssVarsProvider>
  );
}
