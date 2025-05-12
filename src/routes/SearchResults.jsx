import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

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
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Badge from "@mui/joy/Badge";

import TuneIcon from "@mui/icons-material/Tune";

import AdvancedSearch from "../components/AdvancedSearch";
import InfoCard from "../components/InfoCard";
import { DataSearcher } from "../utils/DataRetrieval";
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

  const [ranking, setRanking] = useState({
    sortBy: "_score",
    order: "desc",
  });

  const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false);

  const [adtlFieldsQuery, setAdtlFieldsQuery] = useState("");
  const [numberOfActiveFields, setNumberOfActiveFields] = useState(0);

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

  function encodeQueryArray(queryString) {
    const items = queryString
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const jsonArray = JSON.stringify(items);
    return encodeURIComponent(jsonArray);
  }

  const handleChangeAdtlFields = useCallback(
    (fields) => {
      let query = "";
      let numberOfFields = 0;
      fields.map((field) => {
        if (Object.keys(field.type).length !== 0 && field.query !== "") {
          if (field.type?.type === "array") {
            query += `&${field.type.name}=${encodeQueryArray(field.query)}`;
          } else {
            query += `&${field.type.name}=${field.query}`;
          }
          numberOfFields += 1;
        }
      });
      setAdtlFieldsQuery(query);
      setNumberOfActiveFields(numberOfFields);
    },
    [setAdtlFieldsQuery, setNumberOfActiveFields]
  );

  useEffect(() => {
    const filters = JSON.parse(sessionStorage.getItem("advanced_search"));
    if (filters && Object.keys(filters).length !== 0) {
      setRanking({
        sortBy: filters.sortBy,
        order: filters.orderBy,
      });
      handleChangeAdtlFields(filters.adtlFields);
    }
  }, [handleChangeAdtlFields]);

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
          ranking.sortBy,
          ranking.order,
          currentStartingIdx,
          itemsPerPage,
          adtlFieldsQuery
        );

        const returnElements = returnResults.elements
          ? returnResults.elements
          : [];
        const returnElementsCount = returnResults["total_count"]
          ? returnResults["total_count"]
          : 0;

        const returnResultsCount = returnResults.total_count_by_types;
        setSearchCategoryCount(returnResultsCount);

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
  }, [
    currentStartingIdx,
    searchTerm,
    searchCategory,
    ranking,
    adtlFieldsQuery,
  ]);

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

  function handleSortingChange(event, newValue) {
    switch (newValue) {
      case "_score":
        setRanking({
          sortBy: "_score",
          order: "desc",
        });
        break;
      case "authors":
        setRanking({
          sortBy: "authors",
          order: "asc",
        });
        break;
      case "authors-desc":
        setRanking({
          sortBy: "authors",
          order: "desc",
        });
        break;
      case "title":
        setRanking({
          sortBy: "title",
          order: "asc",
        });
        break;
      case "title-desc":
        setRanking({
          sortBy: "title",
          order: "desc",
        });
        break;
      default:
        TEST_MODE && console.log(`Unknown sorting mechanism: ${newValue}`);
    }
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
                  <>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Typography>
                        Searched "{searchTerm}"
                        {searchCategory !== "any" &&
                          ' under "' +
                            RESOURCE_TYPE_NAMES[searchCategory] +
                            '"'}
                        ,{" "}
                        {adtlFieldsQuery && (
                          <Typography fontWeight="bold">
                            with additional filter(s),{" "}
                          </Typography>
                        )}
                        {numberOfTotalItems > 0
                          ? `returned ${currentStartingIdx + 1}-${
                              currentStartingIdx + arrayLength(searchResults)
                            } of ${numberOfTotalItems}`
                          : `no items matched your criteria`}
                        .
                      </Typography>
                      <Stack
                        sx={{
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography level="body-xs">Sort by</Typography>
                        <Select
                          defaultValue="_score"
                          onChange={handleSortingChange}
                          sx={{ width: 150 }}
                        >
                          <Option value="_score">Popular</Option>
                          <Option value="authors">Author</Option>
                          <Option value="authors-desc">Author (Z-A)</Option>
                          <Option value="title">Title</Option>
                          <Option value="title-desc">Title (Z-A)</Option>
                        </Select>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <Badge
                        badgeContent={numberOfActiveFields}
                        invisible={!numberOfActiveFields}
                        color="success"
                      >
                        <Button
                          key="advanced-search"
                          size="sm"
                          color={adtlFieldsQuery ? "success" : "primary"}
                          variant={adtlFieldsQuery ? "solid" : "plain"}
                          startDecorator={<TuneIcon />}
                          onClick={() =>
                            setOpenAdvancedSearch(!openAdvancedSearch)
                          }
                        >
                          Filters
                        </Button>
                      </Badge>
                    </Stack>
                    <AdvancedSearch
                      open={openAdvancedSearch}
                      onClose={() => setOpenAdvancedSearch(false)}
                      handleChangeAdtlFields={handleChangeAdtlFields}
                    />
                  </>
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
                        cardtype={result["resource-type"]}
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
