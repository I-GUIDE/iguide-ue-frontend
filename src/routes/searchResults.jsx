import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/joy/Typography";
import Pagination from "@mui/material/Pagination";
import Chip from "@mui/joy/Chip";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";

import InfoCard from "../components/InfoCard";
import { DataSearcher } from "../utils/DataRetrieval";
import { arrayLength } from "../helpers/helper";
import {
  SEARCH_RESULTS_BODY_HEIGHT,
  RESOURCE_TYPE_NAMES,
} from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";

export default function SearchResults() {
  // define search data
  const [data, setData] = useState({
    content: "",
    status: "initial",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // the term that will be immediately passed to the database for search
  const [searchTerm, setSearchTerm] = useState("");
  // the term that users just typed. It will be assigned to searchTerm soon
  const [nextSearchTerm, setNextSearchTerm] = useState("");
  // the search will only return results from given category if it's not 'any'
  const [searchCategory, setSearchCategory] = useState("any");
  // A list of elements returned for the current page
  const [searchResults, setSearchResults] = useState([]);
  // Has a valid searchParam
  const [hasSearchParam, setHasSearchParam] = useState(false);
  // Starting item index for the current page
  const [currentStartingIdx, setCurrentStartingIdx] = useState(0);
  // Number of pages for pagination
  const [numberOfPages, setNumberOfPages] = useState(0);
  // Current page index in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Number of total elements matching the search
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);
  // Number of elements displayed per page
  const itemsPerPage = 10;

  const keywordParam = searchParams.get("keyword");
  const typeParam = searchParams.get("type") ? searchParams.get("type") : "any";

  usePageTitle(keywordParam);

  // When there is a new search param, update the search term and element type
  useEffect(() => {
    if (keywordParam) {
      setHasSearchParam(true);
    } else {
      setHasSearchParam(false);
    }
    setSearchTerm(keywordParam);
    setSearchCategory(typeParam);
    setNextSearchTerm(keywordParam);
  }, [keywordParam, typeParam]);

  // When there is an update on searchTerm (new search) or current starting
  //   index (when users click another page), retrieve the search results
  //   based on the current starting index.
  useEffect(() => {
    async function retrieveSearchData() {
      setData((current) => ({ ...current, status: "loading" }));
      try {
        const returnResults = await DataSearcher(
          searchTerm,
          searchCategory,
          "prioritize_title_author",
          "desc",
          currentStartingIdx,
          itemsPerPage
        );

        const returnElements = returnResults.elements
          ? returnResults.elements
          : [];
        const returnElementsCount = returnResults["total_count"]
          ? returnResults["total_count"]
          : 0;

        setNumberOfTotalItems(returnElementsCount);
        setNumberOfPages(Math.ceil(returnElementsCount / itemsPerPage));
        setSearchResults(returnElements);

        // Replace timeout with real backend operation
        setTimeout(() => {
          setData((current) => ({ ...current, status: "sent" }));
        }, 100);
      } catch (error) {
        setData((current) => ({ ...current, status: "failure" }));
      }
    }
    if (searchTerm && searchTerm !== "") {
      retrieveSearchData();
    }
  }, [currentStartingIdx, searchTerm, searchCategory]);

  // When users click the pagination, update current starting index
  function handlePageClick(event, value) {
    const newStartingIdx = (value - 1) * itemsPerPage;
    console.log(
      `User requested page number ${value}, which is offset ${newStartingIdx}`
    );
    setCurrentStartingIdx(newStartingIdx);
    setCurrentPage(value);
  }

  // When user select a different category in the search bar
  function handleSelectChange(event, value) {
    setSearchCategory(value);
    setCurrentPage(1);
    setCurrentStartingIdx(0);
  }

  // Handle reset search
  function handleReset(event) {
    setHasSearchParam(false);
    setNextSearchTerm("");
    setSearchTerm("");
    setSearchCategory("any");
    setNumberOfTotalItems(0);
    setNumberOfPages(0);
    setSearchResults([]);

    setSearchParams({ keyword: "", type: "any" });
    navigate(`/search-results`);
  }

  // Function that handles submit events. This function will update the search term.
  async function handleSubmit(event) {
    // Use preventDefault here to prevent the submit event from happening
    //   because we need to set some states below.
    event.preventDefault();
    // If there is a new search, change the starting index back to 0
    if (nextSearchTerm !== searchTerm) {
      setCurrentStartingIdx(0);
    }
    setSearchTerm(nextSearchTerm);
    setSearchParams({ keyword: nextSearchTerm, type: searchCategory });
    navigate(
      `/search-results?keyword=${encodeURIComponent(
        nextSearchTerm
      )}&type=${searchCategory}`
    );
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Box
          sx={{ display: "flex", flexWrap: "wrap", p: 0, m: 0, height: 170 }}
        >
          <Card
            component="li"
            sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}
          >
            <CardCover>
              <img
                src="/images/yellow-blue.png"
                srcSet="/images/yellow-blue.png 2x"
                loading="lazy"
                alt=""
              />
            </CardCover>
            <CardContent
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Container maxWidth="md">
                <Typography
                  level="h1"
                  textColor={"#fff"}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    py: 1.5,
                  }}
                  endDecorator={
                    <Chip component="span" size="sm">
                      BETA
                    </Chip>
                  }
                  justifyContent="center"
                >
                  I-GUIDE Platform
                </Typography>
                <form onSubmit={handleSubmit} id="demo">
                  <Input
                    key="search"
                    variant="plain"
                    sx={{ "--Input-decoratorChildHeight": "45px" }}
                    placeholder="Search..."
                    type="text"
                    required
                    value={nextSearchTerm}
                    onChange={(event) => {
                      setData({
                        content: event.target.value,
                        status: "initial",
                      });
                      setNextSearchTerm(event.target.value);
                    }}
                    error={data.status === "failure"}
                    endDecorator={
                      <IconButton
                        size="lg"
                        variant="plain"
                        loading={data.status === "loading"}
                        type="submit"
                        sx={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    }
                  />
                  <FormControl>
                    {data.status === "failure" && (
                      <FormHelperText
                        sx={(theme) => ({
                          color: theme.vars.palette.danger[400],
                        })}
                      >
                        Oops! Something went wrong, please try again later.
                      </FormHelperText>
                    )}
                  </FormControl>
                </form>
              </Container>
            </CardContent>
          </Card>
        </Box>
        <Container maxWidth="xl">
          <Box
            component="main"
            sx={{
              minHeight: SEARCH_RESULTS_BODY_HEIGHT,
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
                  spacing={2}
                  sx={{
                    px: { xs: 2, md: 4, width: "100%" },
                    pt: 2,
                    minHeight: 0,
                  }}
                >
                  {/* Tabs for filtering element types */}
                  <Tabs
                    aria-label="Search-filter-by-types"
                    defaultValue="any"
                    value={searchCategory}
                    onChange={handleSelectChange}
                    sx={{ width: "100%" }}
                  >
                    <TabList
                      sx={{
                        overflow: "auto",
                        scrollSnapType: "x mandatory",
                        "&::-webkit-scrollbar": { display: "none" },
                      }}
                    >
                      <Tab
                        value="any"
                        sx={{ flex: "none", scrollSnapAlign: "start" }}
                      >
                        All
                      </Tab>
                      <Tab
                        value="dataset"
                        sx={{ flex: "none", scrollSnapAlign: "start" }}
                      >
                        Datasets
                      </Tab>
                      <Tab
                        value="notebook"
                        sx={{ flex: "none", scrollSnapAlign: "start" }}
                      >
                        Notebooks
                      </Tab>
                      <Tab
                        value="publication"
                        sx={{ flex: "none", scrollSnapAlign: "start" }}
                      >
                        Publications
                      </Tab>
                      <Tab
                        value="oer"
                        sx={{ flex: "none", scrollSnapAlign: "start" }}
                      >
                        Educational Resources
                      </Tab>
                    </TabList>
                  </Tabs>

                  {/* Search result summary and "clear search button" */}
                  {hasSearchParam && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      {numberOfTotalItems > 0 ? (
                        <Typography>
                          Searched "{searchTerm}"
                          {searchCategory !== "any" &&
                            ' under "' +
                              RESOURCE_TYPE_NAMES[searchCategory] +
                              '"'}
                          , returned {currentStartingIdx + 1}-
                          {currentStartingIdx + arrayLength(searchResults)} of{" "}
                          {numberOfTotalItems}
                        </Typography>
                      ) : (
                        <Typography>
                          Searched "{searchTerm}"
                          {searchCategory !== "any" &&
                            ' under "' +
                              RESOURCE_TYPE_NAMES[searchCategory] +
                              '"'}
                          , no items matched your criteria.
                        </Typography>
                      )}
                      <Button
                        key="clear-search"
                        size="sm"
                        variant="outlined"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </Stack>
                  )}
                  <Stack
                    spacing={2}
                    sx={{
                      px: { xs: 2, md: 4, width: "100%" },
                    }}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid
                      container
                      spacing={2}
                      columns={12}
                      sx={{ flexGrow: 1 }}
                    >
                      {searchResults?.map((result) => (
                        <Grid key={result.id} size={{ xs: 12, sm: 6, md: 3 }}>
                          <InfoCard
                            key={result._id}
                            cardtype={result["resource-type"] + "s"}
                            pageid={result._id}
                            title={result.title}
                            authors={result.authors}
                            tags={result.tags}
                            contents={result.contents}
                            thumbnailImage={result["thumbnail-image"]}
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
                  {numberOfPages > 0 && (
                    <Pagination
                      count={numberOfPages}
                      color="primary"
                      page={currentPage}
                      onChange={handlePageClick}
                    />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
