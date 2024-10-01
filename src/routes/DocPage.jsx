import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import { Typography, Divider } from "@mui/joy";

import { fetchADocumentation } from "../utils/DataRetrieval";
import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";

import usePageTitle from "../hooks/usePageTitle";
import PageNav from "../components/PageNav";
import DocAdminOps from "../components/DocAdminOps";
import ErrorPage from "../ErrorPage";

export default function DocPage() {
  const id = useParams().id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const thisDoc = await fetchADocumentation(id);
      console.log(thisDoc);

      if (thisDoc === "ERROR") {
        setError(true);
        return;
      }

      setTitle(thisDoc.name);
      setContent(thisDoc.content);
    }
    fetchData();
  }, [id]);

  usePageTitle(title);

  if (error) {
    return (
      <ErrorPage customStatus="404" customStatusText="Element Not Found" />
    );
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
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              backgroundColor: "inherit",
              px: { xs: 2, md: 4 },
              pt: 4,
              pb: 8,
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <PageNav
                  parentPages={[["Tutorials", "/tutorials"]]}
                  currentPage={title}
                />
                <DocAdminOps
                  title={title}
                  docId={id}
                  afterDeleteRedirection="/about"
                />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack
                alignItems={{ xs: "flex-start", md: "center" }}
                sx={{ p: 2 }}
              >
                <Typography level="h2">{title}</Typography>
              </Stack>
              <Divider sx={{ mx: 2, my: 4 }} />
              <Stack spacing={1} sx={{ p: 2 }}>
                <div className="container" data-color-mode="light">
                  <MDEditor.Markdown source={content} />
                </div>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
