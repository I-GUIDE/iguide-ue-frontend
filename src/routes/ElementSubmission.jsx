import { useOutletContext, useParams } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";

import LoginPage from "./LoginPage";
import SubmissionCard from "../features/ElementSubmission/SubmissionCard";
import usePageTitle from "../hooks/usePageTitle";

import { NO_HEADER_BODY_HEIGHT, PT_OFFSET } from "../configs/VarConfigs";
import Meta from "../components/Meta";

export default function ElementSubmission() {
  usePageTitle("Contribution");

  const { isAuthenticated } = useOutletContext();

  const elementType = useParams().elementType;

  // If the user is not authenticated/logged in, they will be redirected to the login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Meta />
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
            <SubmissionCard
              submissionType="initial"
              elementType={elementType}
            />
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
