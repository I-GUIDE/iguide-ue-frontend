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
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";

import { userLogin } from "../utils/UserManager";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";

export default function LoginPage() {
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
                px: { xs: 2, md: 4 },
                pt: 4,
                pb: 8,
              }}
            >
              <Typography level="title-lg" sx={{ py: 1 }}>
                You need to log in to access this page
              </Typography>
              <Button variant="plain" color="success" onClick={userLogin}>
                <Card variant="outlined" sx={{ width: 320 }}>
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
                      Click here to log in
                    </Typography>
                  </CardContent>
                </Card>
              </Button>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
