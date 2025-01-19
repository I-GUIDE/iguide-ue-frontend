import { CssVarsProvider, styled } from "@mui/joy/styles";
import Link from "@mui/joy/Link";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import CssBaseline from "@mui/joy/CssBaseline";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import { useOutletContext } from "react-router";

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
      items["User login"] = [
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

export function SitemapErrorPage({ isAuthenticated, localUserInfo }) {
  const groupedRoutes = groupRoutesByCategory(
    routes,
    isAuthenticated,
    localUserInfo
  );

  return (
    <Grid>
      <Typography level="h3" style={{ textAlign: "left", margin: "0 20px" }}>
        I-GUIDE Site Map
      </Typography>
      <Divider sx={{ mx: 2, my: 2 }} />
      <LinkContainerErrorPage>
        {Object.entries(groupedRoutes).map(([category, items]) => (
          <Group>
            <Typography level="h4" style={{ textAlign: "left" }}>
              {category}
            </Typography>
            <Group style={{ gap: "5px" }}>
              {items.map((item) => (
                <Link href={item.path} style={{ textAlign: "left" }}>
                  {item.label}
                </Link>
              ))}
            </Group>
          </Group>
        ))}
      </LinkContainerErrorPage>
    </Grid>
  );
}

export default function Sitemap() {
  usePageTitle("Site Map");

  const { isAuthenticated, localUserInfo } = useOutletContext();

  const groupedRoutes = localUserInfo
    ? groupRoutesByCategory(routes, isAuthenticated, localUserInfo)
    : {};

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
                <Typography level="h2">I-GUIDE Site Map</Typography>
              </Stack>
              <Divider sx={{ mx: 2, my: 4 }} />

              <LinkContainer>
                {Object.entries(groupedRoutes).map(([category, items]) => (
                  <Group>
                    <Typography level="h4">{category}</Typography>
                    <Group style={{ gap: "5px" }}>
                      {items.map((item) => (
                        <Link href={item.path}>{item.label}</Link>
                      ))}
                    </Group>
                  </Group>
                ))}
              </LinkContainer>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}

const Group = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LinkContainer = styled("div")`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  align-items: start;

  margin: 0 20px;

  @media only screen and (max-width: 900px) {
    grid-template-columns: auto;
  }
`;

const LinkContainerErrorPage = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  align-items: start;

  margin: 0 20px;

  @media only screen and (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;
