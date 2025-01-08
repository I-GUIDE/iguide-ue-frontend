import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";
import { DocRetriever } from "../utils/DataRetrieval";
import PageNav from "../components/PageNav";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function Tutorials() {
  usePageTitle("Tutorials");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [docList, setDocList] = useState();

  const itemsPerPage = 20;

  useEffect(() => {
    async function retrieveDocs() {
      try {
        const data = await DocRetriever(0, itemsPerPage);
        TEST_MODE && console.log("docs returned", data);

        setDocList(data.documentation);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    retrieveDocs();
  }, []);

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
              px: { xs: 2, md: 4 },
              pt: 4,
              pb: 8,
            }}
          >
            <Grid xs={12}>
              <Stack
                spacing={3}
                alignItems={{ xs: "flex-start", md: "center" }}
                sx={{ p: 2 }}
              >
                <PageNav
                  currentPage={"Tutorials"}
                  fontLevel="body-xs"
                  sx={{ px: 0, pb: { xs: 1, sm: 2.5 } }}
                />
                <Typography level="h2">Tutorials</Typography>
              </Stack>
              <Divider sx={{ mx: 2, my: 4 }} />
            </Grid>
            {/* Section for tutorial articles */}
            {Array.isArray(docList) && docList.length > 0 && (
              <Grid xs={12}>
                <Stack spacing={1} alignItems={"flex-start"} sx={{ p: 2 }}>
                  <List marker="disc">
                    {docList?.map((doc) => (
                      <Link
                        key={doc.id}
                        component={RouterLink}
                        to={"/docs/" + doc.id}
                        color="inherit"
                      >
                        <ListItem>
                          <Typography color="primary" level="body-lg">
                            {doc.name}
                          </Typography>
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
