import React from "react";

import ElementList from "../components/ElementList";
import usePageTitle from "../hooks/usePageTitle";

import ArticleIcon from "@mui/icons-material/Article";

export default function Publications() {
  usePageTitle("Publications");

  return (
    <ElementList
      dataType={["publication"]}
      title="Publications"
      subtitle="Find your publications here"
      icon={<ArticleIcon />}
    />
  );
}
