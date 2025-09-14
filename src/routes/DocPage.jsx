import { useState, useEffect, Suspense } from "react";

import { useParams, useOutletContext } from "react-router";

import { lazyWithRetryAndReload } from "../helpers/lazyWithRetryAndReload";
const MarkdownPreview = lazyWithRetryAndReload(() =>
  import("@uiw/react-markdown-preview")
);

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";

import { fetchADocumentation } from "../utils/DataRetrieval";
import { NO_HEADER_BODY_HEIGHT, PT_OFFSET } from "../configs/VarConfigs";

import usePageTitle from "../hooks/usePageTitle";
import PageNav from "../components/PageNav";
import DocAdminOps from "../features/DocSubmission/DocAdminOps";

import ErrorPage from "./ErrorPage";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function DocPage() {
  const id = useParams().id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState(false);

  const { isAuthenticated, localUserInfo } = useOutletContext();

  useEffect(() => {
    async function fetchData() {
      const docObject = await fetchADocumentation(id);

      if (!docObject.ok) {
        setError(docObject.body);
        TEST_MODE &&
          console.log("Error from fetchADocumentation():", docObject.body);
        return;
      }

      const thisDoc = docObject.body;
      TEST_MODE && console.log("Returned doc", thisDoc);
      setTitle(thisDoc.name);
      setContent(thisDoc.content);
    }
    fetchData();
  }, [id]);

  usePageTitle(title);

  if (error) {
    return (
      <ErrorPage
        customStatusText={error}
        isAuthenticated={isAuthenticated}
        localUserInfo={localUserInfo}
      />
    );
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Container maxWidth="md">
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
              px: { xs: 1, md: 3, lg: 6 },
              pt: PT_OFFSET,
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
                  sx={{ px: 0 }}
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
                  <Suspense fallback={<p>Loading content...</p>}>
                    <MarkdownPreview source={content} />
                  </Suspense>
                </div>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
