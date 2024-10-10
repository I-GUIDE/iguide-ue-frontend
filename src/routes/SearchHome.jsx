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
import IconButton from "@mui/joy/IconButton";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

import { DataSearcher } from "../utils/DataRetrieval";
import { NO_HEADER_BODY_HEIGHT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function SearchHome() {
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
  // Starting item index for the current page
  const [currentStartingIdx, setCurrentStartingIdx] = useState(0);
  // Number of elements displayed per page
  const itemsPerPage = 12;

  const keywordParam = searchParams.get("keyword");
  const typeParam = searchParams.get("type") ? searchParams.get("type") : "any";

  // When the search keyword is not empty, use the keyword as page title
  if (keywordParam) {
    usePageTitle(keywordParam);
  } else {
    usePageTitle("Search");
  }

  // When there is a new search param, update the search term and element type
  useEffect(() => {
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
    let uriPrefix = `/search`;

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
            height: NO_HEADER_BODY_HEIGHT,
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
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
