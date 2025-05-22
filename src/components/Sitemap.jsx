import { useOutletContext } from "react-router";

import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Link from "@mui/joy/Link";
import Box from "@mui/joy/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";

import { routes } from "../routes";
import usePageTitle from "../hooks/usePageTitle";
import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import { PERMISSIONS } from "../configs/Permissions";

const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

function groupRoutesByCategory(routes, isAuthenticated, localUserInfo) {
  const items = {};
  const isAdmin = localUserInfo?.role <= PERMISSIONS["edit_all"];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    if (
      !route.label ||
      (route.requireAuth === true && !isAuthenticated) ||
      (route.requireAdmin === true && !isAdmin)
    ) {
      continue;
    }

    if (items.hasOwnProperty(route.category)) {
      items[route.category] = [...items[route.category], route];
    } else {
      items[route.category] = [route];
    }

    if (!isAuthenticated) {
      items["Authentication"] = [
        {
          path: `${AUTH_BACKEND_URL}/login`,
          label: "Login",
          category: "User login",
        },
      ];
    }
  }

  return items;
}

export default function Sitemap() {
  usePageTitle("Site Map");

  const { isAuthenticated, localUserInfo } = useOutletContext();

  const groupedRoutes = groupRoutesByCategory(
    routes,
    isAuthenticated,
    localUserInfo
  );

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
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
              <Stack>
                <Stack spacing={3} alignItems="flex-start" sx={{ py: 2 }}>
                  <Typography level="title-lg">
                    I-GUIDE Platform Site Map
                  </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Grid
                  container
                  spacing={3}
                  columns={12}
                  sx={{ flexGrow: 1 }}
                  justifyContent="flex-start"
                >
                  {Object.entries(groupedRoutes).map(([category, items]) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category}>
                      <Stack spacing={1} sx={{ py: 2 }}>
                        <Typography level="title-lg">{category}</Typography>
                        {items.map((item) => (
                          <Link href={item.path} key={item.label}>
                            <Typography style={{ textAlign: "left" }}>
                              {item.label}
                            </Typography>
                          </Link>
                        ))}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
