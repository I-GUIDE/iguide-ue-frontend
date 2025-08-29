import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/joy/Box";
import Grid from "@mui/material/Grid2";
import Container from "@mui/joy/Container";

import InfoCard from "../components/InfoCard";
import CommunityHeader from "../features/Community/CommunityHeader";
import usePageTitle from "../hooks/usePageTitle";

import { DEFAULT_BODY_HEIGHT } from "../configs/VarConfigs";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function CommunityPage(props) {
  const communityId = useParams().id;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function retrieveData(id) {
      try {
        const response = await fetch("/data/community-demo.json");
        const data = await response.json();
        const community = data.find((item) => item.id === id);

        TEST_MODE && console.log("Retrieve a single community", community);
        setTitle(community.title);
        setSubtitle(community.subtitle);
        setThumbnailImage(community["thumbnail-image"]);
        setElements(community.elements);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    retrieveData(communityId);
  }, [communityId]);

  usePageTitle(title || "Community");

  return (
    <JoyCssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <CommunityHeader
        title={title}
        subtitle={subtitle}
        banner={thumbnailImage?.high ? thumbnailImage.high : thumbnailImage}
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
              {elements?.map((element) => (
                <Grid key={element._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoCard
                    cardtype={element["resource-type"]}
                    elementId={element._id}
                    title={element.title}
                    authors={element.authors}
                    tags={element.tags}
                    contents={element.contents}
                    thumbnailImage={element["thumbnail-image"]}
                    contributor={element["contributor"]}
                    showElementType
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
