import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import SearchIcon from "@mui/icons-material/Search";

import { retrieveTopSearchKeywords } from "../utils/DataRetrieval";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function SearchBar(props) {
  const onSearch = props.onSearch;
  const showSmartSearch = props.showSmartSearch;
  const showTrendingSearchKeywords = props.showTrendingSearchKeywords;
  const placeholder = props.placeholder;

  // define search data
  const [data, setData] = useState({
    content: "",
    status: "initial",
  });

  const navigate = useNavigate();

  // the term that will be immediately passed to the database for search
  const [searchTerm, setSearchTerm] = useState("");
  const [trendingSearchKeywords, setTrendingSearchKeywords] = useState([]);
  const searchCategory = "any";

  useEffect(() => {
    async function retrieveTrendingSearchKeywords() {
      const data = await retrieveTopSearchKeywords();
      TEST_MODE && console.log("Trending search keywords returned", data);

      if (data !== "ERROR") {
        const keywordList = data["top_keywords"].map((keyword) => {
          return keyword.keyword;
        });
        TEST_MODE && console.log("Trending search keywords list", keywordList);
        setTrendingSearchKeywords(keywordList);
      } else {
        setTrendingSearchKeywords([]);
      }
    }

    if (showTrendingSearchKeywords) {
      retrieveTrendingSearchKeywords();
    }
  }, [showTrendingSearchKeywords]);

  function handleClickTrendingKeyword(e, keyword) {
    setSearchTerm(keyword);
    handleSubmit(e, keyword);
  }

  // Click the keyword to search directly
  function ClickableKeywordList(props) {
    const keywordList = props.children;
    return (
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{ py: 1, flexWrap: "wrap" }}
      >
        <Typography>Trending search: </Typography>
        {keywordList?.map((keyword) => (
          <Chip
            key={keyword}
            onClick={(e) => handleClickTrendingKeyword(e, keyword)}
          >
            {keyword}
          </Chip>
        ))}
      </Stack>
    );
  }

  // Function that handles submit events. If there is a customKeyword passed in,
  //   it will use it otherwise use searchTerm
  async function handleSubmit(event, customKeyword) {
    // Use preventDefault here to prevent the submit event from happening
    //   because we need to set some states below.
    event.preventDefault();
    setSearchTerm("");
    navigate(
      `/search?keyword=${encodeURIComponent(
        customKeyword || searchTerm
      )}&type=${searchCategory}`
    );
  }

  return (
    <form onSubmit={handleSubmit} id="iguide-search-form">
      <Stack direction="column" spacing={1}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            gap: 2,
          }}
        >
          <Input
            key="iguide-search"
            required
            fullWidth
            variant="outlined"
            sx={{
              "--Input-decoratorChildHeight": "50px",
              "--Input-radius": "40px",
              "--Input-paddingInline": "20px",
            }}
            placeholder={placeholder}
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setData({ content: event.target.value, status: "initial" });
              setSearchTerm(event.target.value);
            }}
            error={data.status === "failure"}
            endDecorator={
              <IconButton
                aria-label="Search"
                size="lg"
                variant="plain"
                loading={data.status === "loading"}
                type="submit"
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                onClick={onSearch}
              >
                <SearchIcon />
              </IconButton>
            }
          />
          {showSmartSearch && (
            <Tooltip title="Conversational search coming soon" placement="top">
              <Avatar
                alt="Smart search button"
                src="/images/smart-search-button.png"
              />
            </Tooltip>
          )}
        </Stack>
        {showTrendingSearchKeywords && trendingSearchKeywords.length > 0 && (
          <ClickableKeywordList>{trendingSearchKeywords}</ClickableKeywordList>
        )}
      </Stack>

      <FormControl>
        {data.status === "failure" && (
          <FormHelperText
            sx={(theme) => ({ color: theme.vars.palette.danger[400] })}
          >
            Oops! Something went wrong, please try again later.
          </FormHelperText>
        )}
      </FormControl>
    </form>
  );
}
