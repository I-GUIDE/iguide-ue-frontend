import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Link from "@mui/joy/Link";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

import { routes } from "../routes";

function groupRoutesByCategory(routes) {
  const items = {};

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    if (!route.label) {
      continue;
    }

    if (items.hasOwnProperty(route.category)) {
      items[route.category] = [...items[route.category], route];
    } else {
      items[route.category] = [route];
    }
  }

  return items;
}

export default function WebsiteNav() {
  const groupedRoutes = groupRoutesByCategory(routes);

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
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
                <Typography level="title-md">{category}</Typography>
                {items.map((item) => (
                  <Link href={item.path} key={item.label}>
                    <Typography
                      color="primary"
                      level="body-md"
                      style={{ textAlign: "left" }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
