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

import Stack from "@mui/joy/Stack";
// Currently using mui Grid2 as Joy UI is still using legacy Grid
import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Pagination from "@mui/material/Pagination";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import InfoCard from "../InfoCard";
import UserElementCard from "../UserElementCard";

import {
  elementRetriever,
  retrievePrivateElementsByUserId,
} from "../../utils/DataRetrieval";
import { arrayLength } from "../../helpers/helper";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ElementGrid(props) {
  const navigate = useNavigate();
  const [pageParam, setPageParam] = useSearchParams();
  const itemsPerPage = 12;

  const fromPageParam =
    pageParam.get("page") >= 1 ? parseInt(pageParam.get("page")) : 1;

  const initialStartingIdx = (fromPageParam - 1) * itemsPerPage;

  const uriPrefix = props.uriPrefix;
  const headline = props.headline;
  const fieldName = props.fieldName;
  const matchValue = props.matchValue;
  const elementType = props.elementType;
  const noElementMsg = props.noElementMsg;
  const showElementType = props.showElementType;
  const isPrivateElement = props.isPrivateElement;
  const showUserElementCard = props.showUserElementCard;

  const [elementList, setMetadataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultLength, setResultLength] = useState(null);

  const [ranking, setRanking] = useState({
    sortBy: "creation_time",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(fromPageParam);
  const [currentStartingIdx, setCurrentStartingIdx] =
    useState(initialStartingIdx);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);

  // When users select a new page or when there is a change of total items,
  //   retrieve the data
  useEffect(() => {
    async function retrieveData(startingIdx) {
      try {
        const data = await elementRetriever(
          fieldName,
          matchValue,
          elementType,
          ranking.sortBy,
          ranking.order,
          startingIdx,
          itemsPerPage
        );

        TEST_MODE && console.log("Retrieve elements", data);

        setNumberOfTotalItems(data["total-count"]);
        setNumberOfPages(Math.ceil(data["total-count"] / itemsPerPage));
        setMetadataList(data.elements);
        setLoading(false);
        setResultLength(arrayLength(data.elements));
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    async function retrievePrivateData(startingIdx) {
      try {
        const data = await retrievePrivateElementsByUserId(
          matchValue,
          ranking.sortBy,
          ranking.order,
          startingIdx,
          itemsPerPage
        );

        TEST_MODE && console.log("Retrieve private elements", data);

        setNumberOfTotalItems(data["total-count"]);
        setNumberOfPages(Math.ceil(data["total-count"] / itemsPerPage));
        setMetadataList(data.elements);
        setLoading(false);
        setResultLength(arrayLength(data.elements));
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    if (isPrivateElement) {
      retrievePrivateData(currentStartingIdx);
    } else {
      retrieveData(currentStartingIdx);
    }
  }, [
    isPrivateElement,
    currentStartingIdx,
    elementType,
    ranking,
    fieldName,
    matchValue,
  ]);

  function handlePageClick(event, newPageNumber) {
    const newStartingIdx = (newPageNumber - 1) * itemsPerPage;
    setCurrentStartingIdx(newStartingIdx);
    setPageParam({ page: newPageNumber });
    TEST_MODE &&
      console.log("Navigating to", `${uriPrefix}?page=${newPageNumber}`);
    navigate(`${uriPrefix}?page=${newPageNumber}`, { replace: true });
    setCurrentPage(newPageNumber);
    window.scrollTo(0, 0);
  }

  function handleSortingChange(event, newValue) {
    switch (newValue) {
      case "newest":
        setRanking({
          sortBy: "creation_time",
          order: "desc",
        });
        break;
      case "most-popular":
        setRanking({
          sortBy: "click_count",
          order: "desc",
        });
        break;
      case "a-z":
        setRanking({
          sortBy: "title",
          order: "asc",
        });
        break;
      default:
        TEST_MODE && console.log(`Unknown sorting mechanism: ${newValue}`);
    }
  }

  if (loading) {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    );
  }

  if (!numberOfTotalItems) {
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Card
              variant="outlined"
              orientation="horizontal"
              sx={{
                width: "100%",
                "&:hover": {
                  boxShadow: "md",
                  borderColor: "neutral.outlinedHoverBorder",
                },
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                  >
                    <Typography level="title-lg">{noElementMsg}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    );
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <Stack spacing={2}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            width="100%"
          >
            <Typography level="h3">{headline}</Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              Showing {currentStartingIdx + 1}-
              {currentStartingIdx + resultLength} of {numberOfTotalItems}
            </Typography>
            <Select
              defaultValue="newest"
              onChange={handleSortingChange}
              sx={{ width: 150 }}
            >
              <Option value="newest">Newest</Option>
              <Option value="most-popular">Most Popular</Option>
              <Option value="a-z">A-Z</Option>
            </Select>
          </Stack>
          <Grid
            container
            spacing={3}
            columns={12}
            sx={{ flexGrow: 1 }}
            justifyContent="flex-start"
          >
            {elementList?.map((element) => (
              <Grid key={element.id} size={{ xs: 12, sm: 6, md: 4 }}>
                {showUserElementCard ? (
                  <UserElementCard
                    cardtype={element["resource-type"] + "s"}
                    elementId={element.id}
                    title={element.title}
                    authors={element.authors}
                    tags={element.tags}
                    contents={element.contents}
                    thumbnailImage={element["thumbnail-image"]}
                    contributor={element["contributor"]}
                    numberOfClicks={element["click-count"]}
                    showElementType={showElementType}
                    isPrivateElement={isPrivateElement}
                  />
                ) : (
                  <InfoCard
                    cardtype={element["resource-type"] + "s"}
                    elementId={element.id}
                    title={element.title}
                    authors={element.authors}
                    tags={element.tags}
                    contents={element.contents}
                    thumbnailImage={element["thumbnail-image"]}
                    contributor={element["contributor"]}
                    showElementType={showElementType}
                    isPrivateElement={isPrivateElement}
                  />
                )}
              </Grid>
            ))}
          </Grid>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{
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
        </Stack>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
