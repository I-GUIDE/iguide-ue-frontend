import { useEffect, useState } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";

import { PT_OFFSET } from "../configs/VarConfigs";
import { PERMISSIONS } from "../configs/Permissions";

import SearchPane from "../features/LlmSearch/SearchPane";
import usePageTitle from "../hooks/usePageTitle";
import LoginPage from "./LoginPage";
import ErrorPage from "./ErrorPage";

export default function LlmSearch() {
  usePageTitle("Smart search");

  const { isAuthenticated, localUserInfo } = useOutletContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [initialValue, setInitialValue] = useState("");

  useEffect(() => {
    if (location.state?.llmInitialValue) {
      setInitialValue(location.state.llmInitialValue);
      // Destory location.state to prevent being reused
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  // If the user is not authenticated/logged in, they will be redirected to the login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!localUserInfo) {
    return (
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box
            component="main"
            sx={{
              height: "100vh",
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
                height: "100vh",
                backgroundColor: "inherit",
                px: { xs: 1, md: 3, lg: 6 },
                pt: PT_OFFSET,
                pb: 8,
              }}
            >
              <Typography>Loading smart search...</Typography>
            </Grid>
          </Box>
        </Container>
      </CssVarsProvider>
    );
  }

  const canAccessLLMSearch = localUserInfo?.role <= PERMISSIONS["access_llm"];
  if (!canAccessLLMSearch) {
    return (
      <ErrorPage
        statusCode={403}
        customStatusText={"You don’t have permission to access this page."}
        isAuthenticated={isAuthenticated}
        localUserInfo={localUserInfo}
      />
    );
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          height: "100vh",
          display: "grid",
          gridTemplateColumns: { xs: "auto", md: "100%" },
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <SearchPane initialValue={initialValue} />
      </Box>
    </CssVarsProvider>
  );
}
