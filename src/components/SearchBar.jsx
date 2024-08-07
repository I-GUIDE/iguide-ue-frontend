import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar(props) {
  const onSearch = props.onSearch;
  // define search data
  const [data, setData] = useState({
    content: "",
    status: "initial",
  });

  const navigate = useNavigate();

  // the term that will be immediately passed to the database for search
  const [searchTerm, setSearchTerm] = useState("");
  const searchCategory = "any";

  // Function that handles submit events. This function will update the search
  //   term and set hasSearched to true.
  async function handleSubmit(event) {
    // Use preventDefault here to prevent the submit event from happening
    //   because we need to set some states below.
    event.preventDefault();
    setSearchTerm("");
    navigate(
      `/search-results?keyword=${encodeURIComponent(
        searchTerm
      )}&type=${searchCategory}`
    );
  }

  return (
    <form onSubmit={handleSubmit} id="iguide-search-form">
      <Input
        key="iguide-search"
        required
        variant="outlined"
        sx={{ "--Input-decoratorChildHeight": "50px" }}
        placeholder="Search all..."
        type="text"
        value={searchTerm}
        onChange={(event) => {
          setData({ content: event.target.value, status: "initial" });
          setSearchTerm(event.target.value);
        }}
        error={data.status === "failure"}
        endDecorator={
          <IconButton
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
