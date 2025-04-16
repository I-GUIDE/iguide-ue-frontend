import React from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";

export default function Maintenance() {
  usePageTitle("We'll be back soon");

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
                spacing={3}
                alignItems={{ xs: "flex-start", md: "center" }}
                sx={{ p: 2 }}
              >
                <Stack
                  direction={{ sx: "column", sm: "row" }}
                  spacing={0}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="tourid-0"
                >
                  <img src="/images/iguide-word-color.png" alt="I-GUIDE" />
                  <img src="/images/platform-word-gray.png" alt="Platform" />
                </Stack>
                <Typography level="h2">
                  I-GUIDE Platform will be back soon
                </Typography>
                <Typography level="title-md">
                  We are performing regular maintenance on the Platform to make
                  it better. Thank you for your patience and for using our
                  Platform.
                </Typography>
                <Typography level="body-md">
                  In the meantime, you can still visit our main website{" "}
                  <Link
                    href="https://i-guide.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </Link>
                  . If you have any other questions, please reach out to{" "}
                  <Link
                    href="mailto:help@i-guide.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    help@i-guide.io
                  </Link>
                  .
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
