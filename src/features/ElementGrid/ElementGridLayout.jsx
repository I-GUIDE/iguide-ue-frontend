import React from "react";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";

import ElementGrid from "../../components/Layout/ElementGrid";
import Header from "../../components/Layout/Header";

import {
  DEFAULT_BODY_HEIGHT,
  RESOURCE_TYPE_NAMES_PLURAL_FOR_URI,
} from "../../configs/VarConfigs";

export default function ElementGridLayout(props) {
  const elementType = props.elementType;
  const fieldName = props.fieldName;
  const matchValue = props.matchValue;
  const title = props.title;
  const subtitle = props.subtitle;
  const pageNavName = props.pageNavName ? props.pageNavName : "All " + title;
  const icon = props.icon;
  const contribution = props.contribution;
  const showElementType = props.showElementType;

  return (
    <JoyCssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header
        title={title}
        subtitle={subtitle}
        icon={icon}
        currentPage={pageNavName}
        contribution={contribution}
        elementType={elementType}
      />
      <Container maxWidth="lg">
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
            // Tip: removing the "container" property from this Grid element fixed incorrect child height (bottom part covered by footer)
            rowSpacing={2}
            direction="column"
            sx={{
              backgroundColor: "inherit",
              p: 4,
            }}
          >
            <ElementGrid
              uriPrefix={"/" + RESOURCE_TYPE_NAMES_PLURAL_FOR_URI[elementType]}
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
