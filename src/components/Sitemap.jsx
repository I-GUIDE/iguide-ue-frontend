import { CssVarsProvider, styled } from "@mui/joy/styles";
import Link from "@mui/joy/Link";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import CssBaseline from "@mui/joy/CssBaseline";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import { routes } from "../routes";

import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";

function groupRoutesByCategory(routes) {
  const items = {};
  routes.map((route) => {
    if (route.label && route.category) {
      if (items.hasOwnProperty(route.category)) {
        items[route.category] = [...items[route.category], route];
      } else {
        items[route.category] = [route];
      }
    }
  });
  return items;
}

export default function Sitemap() {
  const groupedRoutes = groupRoutesByCategory(routes);
  console.log(groupedRoutes);

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
