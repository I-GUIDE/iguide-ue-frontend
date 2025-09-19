import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Grid from "@mui/material/Grid2";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";

import { userLogin } from "../utils/UserManager";

import { NO_HEADER_BODY_HEIGHT, PT_OFFSET } from "../configs/VarConfigs";

export default function LoginCard() {
  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
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
              <Typography level="title-md" sx={{ py: 1 }}>
                You need to sign in to access this page
              </Typography>
              <Card
                variant="plain"
                component="button"
                onClick={userLogin}
                sx={{
                  width: 320,
                  border: "none",
                  cursor: "pointer",
                  "--Card-radius": "15px",
                  overflow: "hidden",
                  boxShadow: `
                    0 1px 2px rgba(0, 0, 0, 0.3),
                    0 2px 4px rgba(0, 0, 0, 0.2)
                  `,
                  transition: "transform 0.4s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: `
                      0 4px 8px rgba(0, 0, 0, 0.25),
                      0 12px 24px rgba(0, 0, 0, 0.2)
                    `,
                  },
                }}
              >
                <CardOverflow>
                  <img
                    src="https://cilogon.org/images/cilogon-ci-64-g.png"
                    srcSet="https://cilogon.org/images/cilogon-ci-64-g.png 2x"
                    loading="lazy"
                    alt="CILogon Service"
                  />
                </CardOverflow>
                <CardContent>
                  <Typography level="title-sm">
                    Click here to sign in
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
