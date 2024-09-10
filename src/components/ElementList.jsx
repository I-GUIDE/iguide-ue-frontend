import React, { useState, useEffect } from "react";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Pagination from "@mui/material/Pagination";

import InfoCard from "./InfoCard";
import Header from "./Layout/Header";
import PageNav from "./PageNav";

import { elementRetriever } from "../utils/DataRetrieval";
import { arrayLength } from "../helpers/helper";

import { DEFAULT_BODY_HEIGHT } from "../configs/VarConfigs";

export default function ElementList(props) {
  const fieldName = props.fieldName;
  const matchValue = props.matchValue;
  const dataType = props.dataType;
  const title = props.title;
  const subtitle = props.subtitle;
  const icon = props.icon;
  const showElementType = props.showElementType;

  const [metadataList, setMetadataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultLength, setResultLength] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentStartingIdx, setCurrentStartingIdx] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);
  const itemsPerPage = 12;

  // When users select a new page or when there is a change of total items,
  //   retrieve the data
  useEffect(() => {
    async function retrieveData(startingIdx) {
      try {
        const data = await elementRetriever(
          fieldName,
          matchValue,
          dataType,
          "_id",
          "desc",
          startingIdx,
          itemsPerPage
        );

        setNumberOfTotalItems(data["total-count"]);
        setNumberOfPages(Math.ceil(numberOfTotalItems / itemsPerPage));
        setMetadataList(data.elements);
        setLoading(false);
        setResultLength(arrayLength(data.elements));
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    retrieveData(currentStartingIdx);
  }, [currentStartingIdx, numberOfTotalItems, dataType]);

  const handlePageClick = (event, value) => {
    const newStartingIdx = (value - 1) * itemsPerPage;
    setCurrentStartingIdx(newStartingIdx);
    setCurrentPage(value);
  };

  if (error) {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Header title={"Error: " + error.message} />
          <Container maxWidth="xl">
            <Box
              component="main"
              sx={{
                minHeight: DEFAULT_BODY_HEIGHT,
                display: "grid",
                gridTemplateColumns: { xs: "auto", md: "100%" },
                gridTemplateRows: "auto 1fr auto",
              }}
            />
          </Container>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    );
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Header
          title={title}
          subtitle={subtitle}
          icon={icon}
          displayNewContributionButton={true}
        />
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
                px: { xs: 2, md: 4 },
                pt: 4,
                pb: 8,
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  px: { xs: 2, md: 4, width: "100%" },
                }}
              >
                <PageNav currentPage={"All " + title} sx={{ px: 0 }} />
                <Typography>
                  Showing {currentStartingIdx + 1}-
                  {currentStartingIdx + resultLength} of {numberOfTotalItems}
                </Typography>
                <Stack
                  spacing={2}
                  sx={{
                    px: { xs: 2, md: 4, width: "100%" },
                  }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid container spacing={2} columns={12} sx={{ flexGrow: 1 }}>
                    {metadataList?.map((metadata) => (
                      <Grid key={metadata._id} size={{ xs: 12, sm: 6, md: 3 }}>
                        <InfoCard
                          cardtype={metadata["resource-type"] + "s"}
                          pageid={metadata._id}
                          title={metadata.title}
                          authors={metadata.authors}
                          tags={metadata.tags}
                          contents={metadata.contents}
                          thumbnailImage={metadata["thumbnail-image"]}
                          showElementType={showElementType}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{
                  px: { xs: 2, md: 4, width: "100%" },
                  pt: 2,
                  minHeight: 0,
                }}
              >
                <Pagination
                  count={numberOfPages}
                  color="primary"
                  page={currentPage}
                  onChange={handlePageClick}
                />
              </Stack>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
