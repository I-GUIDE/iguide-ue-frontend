import { useState, useEffect } from "react";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/joy/Box";
import Grid from "@mui/material/Grid2";
import Container from "@mui/joy/Container";

import PeopleIcon from "@mui/icons-material/People";

import CommunityCard from "../features/Community/CommunityCard";
import Header from "../components/Layout/Header";
import usePageTitle from "../hooks/usePageTitle";

import { DEFAULT_BODY_HEIGHT } from "../configs/VarConfigs";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function Communities(props) {
  usePageTitle("Communities");

  const [communityList, setCommunityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function retrieveData() {
      try {
        const response = await fetch("/data/community-demo.json");
        const data = await response.json();

        TEST_MODE && console.log("Retrieve communities", data);
        setCommunityList(data);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    retrieveData();
  }, []);

  return (
    <JoyCssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header
        title="Communities"
        subtitle="Join specialized communities focused on geospatial science, climate modeling, environmental analysis, and more."
        icon={<PeopleIcon />}
        currentPage="All Communities"
      />
      <Container maxWidth="lg">
        <Box
          component="main"
          sx={{
            minHeight: DEFAULT_BODY_HEIGHT,
            display: "block",
            gridTemplateColumns: { xs: "auto", md: "100%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <Grid
            rowSpacing={2}
            direction="column"
            sx={{
              backgroundColor: "inherit",
              px: { xs: 1, md: 2, lg: 4 },
              py: 4,
            }}
          >
            <Grid
              container
              spacing={3}
              columns={12}
              sx={{ flexGrow: 1 }}
              justifyContent="flex-start"
            >
              {communityList?.map((community) => (
                <Grid key={community.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <CommunityCard
                    communityId={community.id}
                    title={community.title}
                    subtitle={community.subtitle}
                    contents={community.contents}
                    thumbnailImage={community["thumbnail-image"]}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </JoyCssVarsProvider>
  );
}
