import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
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
import Grid from "@mui/material/Grid2";
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
import { DataSearcher, DataSearcherCount } from "../utils/DataRetrieval";
import { arrayLength } from "../helpers/helper";
import {
  SEARCH_RESULTS_HEADER_HEIGHT,
  SEARCH_RESULTS_BODY_HEIGHT,
  RESOURCE_TYPE_NAMES,
} from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

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
  const [searchCategoryCount, setSearchCategoryCount] = useState([]);
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
  const itemsPerPage = 12;

  const keywordParam = searchParams.get("keyword");
  const typeParam = searchParams.get("type") ? searchParams.get("type") : "any";

  // When the search keyword is not empty, use the keyword as page title
  const searchPageTitle = keywordParam ? keywordParam : "Search";
  usePageTitle(searchPageTitle);

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
          "_score",
          "desc",
          currentStartingIdx,
          itemsPerPage
        );

        const returnResultsCount = await DataSearcherCount(searchTerm);
        setSearchCategoryCount(returnResultsCount);

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

  // Determine the search result page URL based on different variables
  function searchUriBuilder(keyword, type) {
    const encodedKeyword = encodeURIComponent(keyword);
    let keywordExist = false;
    let typeExist = false;
    const uriPrefix = `/search`;

    if (keyword && keyword !== "") {
      keywordExist = true;
    }
    if (type && type !== "") {
      typeExist = true;
    }

    if (keywordExist && typeExist) {
      return uriPrefix + `?keyword=${encodedKeyword}&type=${type}`;
    } else if (keywordExist && !typeExist) {
      return uriPrefix + `?keyword=${encodedKeyword}`;
    } else if (!keywordExist && typeExist) {
      return uriPrefix + `?type=${type}`;
    } else {
      return uriPrefix;
    }
  }

  // When users click the pagination, update current starting index
  function handlePageClick(event, value) {
    const newStartingIdx = (value - 1) * itemsPerPage;
    TEST_MODE &&
      console.log(
        `User requested page number ${value}, which is offset ${newStartingIdx}`
      );
    setCurrentStartingIdx(newStartingIdx);
    setCurrentPage(value);
    window.scrollTo(0, 0);
  }

  // When user select a different category in the search bar
  function handleSelectChange(event, value) {
    setSearchCategory(value);
    setCurrentPage(1);
    setCurrentStartingIdx(0);
    if (nextSearchTerm) {
      navigate(searchUriBuilder(nextSearchTerm, value), { replace: true });
    }
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
    navigate(`/search`);
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
    navigate(searchUriBuilder(nextSearchTerm, searchCategory));
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            height: SEARCH_RESULTS_HEADER_HEIGHT,
          }}
        >
          <Card
            variant="plain"
            component="li"
            sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}
          >
            <CardCover>
              <img src="/images/network-bg.png" loading="lazy" alt="" />
            </CardCover>
            <CardContent
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Container maxWidth="md">
                <Typography
                  level="h1"
                  textColor={"#000"}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    py: 1.5,
                  }}
                  endDecorator={
                    <Chip component="span" color="primary" size="sm">
                      BETA
                    </Chip>
                  }
                  justifyContent="center"
                >
                  <Stack
                    direction={{ sx: "column", sm: "row" }}
                    spacing={0}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="/images/iguide-word-color.png"
                      loading="lazy"
                      alt="I-GUIDE"
                    />
                    <img
                      src="/images/platform-word-gray.png"
                      loading="lazy"
                      alt="Platform"
                    />
                  </Stack>
                </Typography>
                <form onSubmit={handleSubmit} id="demo">
                  <Input
                    key="search"
                    variant="outlined"
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
                        aria-label="Search"
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
        <Container maxWidth="lg">
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
              <Stack
                spacing={2}
                sx={{
                  px: { xs: 2, md: 4, width: "100%" },
                  pt: 2,
                  minHeight: 0,
                }}
              >
                {/* Tabs for filtering element types */}
                {searchTerm && (
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
                      {searchCategoryCount?.map((item) => (
                        <Tab
                          key={item[0]}
                          value={item[0]}
                          sx={{ flex: "none", scrollSnapAlign: "start" }}
                        >
                          {`${RESOURCE_TYPE_NAMES[item[0]]} (${item[1]})`}
                        </Tab>
                      ))}
                    </TabList>
                  </Tabs>
                )}

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
                <Grid
                  container
                  spacing={3}
                  columns={12}
                  sx={{ flexGrow: 1 }}
                  justifyContent="flex-start"
                >
                  {searchResults?.map((result) => (
                    <Grid key={result._id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <InfoCard
                        cardtype={result["resource-type"] + "s"}
                        elementId={result._id}
                        title={result.title}
                        authors={result.authors}
                        tags={result.tags}
                        contents={result.contents}
                        thumbnailImage={result["thumbnail-image"]}
                        showElementType
                      />
                    </Grid>
                  ))}
                </Grid>
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
          </Box>
        </Container>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
