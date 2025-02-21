import React from "react";
import { useRouteError, useNavigate } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Stack from "@mui/joy/Stack";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import usePageTitle from "../hooks/usePageTitle";
import SearchBar from "../components/SearchBar";
import { SitemapErrorPage } from "../components/Sitemap";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";

export default function ErrorPage(props) {
  usePageTitle("Error");
  const navigate = useNavigate();

  const error = useRouteError();
  error && console.error("Err msg", error);

  const errorStatus = props.customStatus ? props.customStatus : error.status;
  const errorStatusText = props.customStatusText
    ? props.customStatusText
    : error.statusText;

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
              px: { xs: 2, md: 4 },
              pt: 4,
              pb: 8,
            }}
          >
            <Card
              variant="outlined"
              orientation="horizontal"
              sx={{
                "&:hover": {
                  boxShadow: "md",
                  borderColor: "neutral.outlinedHoverBorder",
                },
              }}
            >
              <CardContent sx={{ alignItems: "center", textAlign: "center" }}>
                <Stack
                  spacing={2}
                  sx={{
                    p: 1,
                    display: "flex",
                  }}
                >
                  <Typography level="h1">{`${errorStatus}`}</Typography>
                  <Typography level="title-lg">{`${errorStatusText} :(`}</Typography>
                  <SearchBar placeholder="Search elements..." />
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    useFlexGap
                    sx={{ p: 0.5 }}
                  >
                    <Button
                      component="a"
                      href="/contact-us"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="solid"
                      color="warning"
                      size="sm"
                      endDecorator={<OpenInNewIcon />}
                    >
                      Contact Us
                    </Button>
                    <Button
                      component="a"
                      href="/"
                      variant="outlined"
                      color="neutral"
                      size="sm"
                    >
                      Homepage
                    </Button>

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(-1)}
                      size="sm"
                    >
                      Go Back
                    </Button>
                  </Stack>
                  <SitemapErrorPage
                    isAuthenticated={props.isAuthenticated}
                    localUserInfo={props.localUserInfo}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
