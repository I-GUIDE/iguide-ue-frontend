import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar(props) {
  const onSearch = props.onSearch;
  const showSmartSearch = props.showSmartSearch;
  const placeholder = props.placeholder;

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
      `/search?keyword=${encodeURIComponent(searchTerm)}&type=${searchCategory}`
    );
  }

  return (
    <form onSubmit={handleSubmit} id="iguide-search-form">
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
          <Tooltip
            title="Conversational search coming early next year"
            placement="top"
          >
            <Avatar
              alt="Smart search button"
              src="/images/smart-search-button.png"
            />
          </Tooltip>
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
