import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/joy/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";

import usePageTitle from "../hooks/usePageTitle";
import { NO_HEADER_BODY_HEIGHT, PT_OFFSET } from "../configs/VarConfigs";
import WebsiteNav from "../components/WebsiteNav";
import Meta from "../components/Meta";

export default function Sitemap() {
  usePageTitle("Site Map");

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
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              backgroundColor: "inherit",
              px: { xs: 1, md: 3, lg: 6 },
              pt: PT_OFFSET,
              pb: 8,
            }}
          >
            <Stack sx={{ width: "100%" }}>
              <Stack spacing={3} alignItems="flex-start" sx={{ py: 2 }}>
                <Typography level="h4">I-GUIDE Platform Site Map</Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <WebsiteNav />
            </Stack>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
