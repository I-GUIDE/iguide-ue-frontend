import { useOutletContext } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";

import LoginCard from "../components/LoginCard";
import UserProfileEditCard from "../features/UserProfile/UserProfileEditCard";
import usePageTitle from "../hooks/usePageTitle";

import { NO_HEADER_BODY_HEIGHT, PT_OFFSET } from "../configs/VarConfigs";

export default function UserProfileUpdate() {
  usePageTitle("Update User Profile");

  const { isAuthenticated } = useOutletContext();

  // If the user is not authenticated/logged in, they will be redirected to the login page
  if (!isAuthenticated) {
    return <LoginCard />;
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
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
              px: { xs: 1, md: 3, lg: 6 },
              pt: PT_OFFSET,
              pb: 8,
            }}
          >
            <UserProfileEditCard userProfileEditType="update" />
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
