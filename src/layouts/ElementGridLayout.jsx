import React from "react";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";

import ElementGrid from "../components/ElementGrid";
import PageNav from "../components/PageNav";
import Header from "../components/Layout/Header";

import { DEFAULT_BODY_HEIGHT } from "../configs/VarConfigs";

export default function ElementGridLayout(props) {
  const elementType = props.elementType;
  const fieldName = props.fieldName;
  const matchValue = props.matchValue;
  const title = props.title;
  const pageNavName = props.pageNavName ? props.pageNavName : "All " + title;
  const icon = props.icon;
  const showElementType = props.showElementType;

  return (
    <JoyCssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header title={title} icon={icon} displayNewContributionButton={true} />
      <Container maxWidth="xl">
        <Box
          component="main"
          sx={{
            minHeight: DEFAULT_BODY_HEIGHT,
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "100%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="center"
            alignItems="center"
            direction="column"
            sx={{
              backgroundColor: "inherit",
              px: { xs: 2, md: 6 },
              pt: 4,
              pb: 8,
            }}
          >
            <PageNav currentPage={pageNavName} sx={{ px: 0 }} />
            <ElementGrid
              elementType={elementType}
              fieldName={fieldName}
              matchValue={matchValue}
              noElementMsg="No element returned"
              showElementType={showElementType}
            />
          </Grid>
        </Box>
      </Container>
    </JoyCssVarsProvider>
  );
}
