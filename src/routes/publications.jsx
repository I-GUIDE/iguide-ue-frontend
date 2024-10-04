import React from "react";

import ArticleIcon from "@mui/icons-material/Article";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

export default function Publications() {
  usePageTitle("Publications");

  return (
    <ElementGridLayout
      elementType="publication"
      title="Publications"
      subtitle="Discover connected knowledge from peer-reviewed papers that showcase cutting-edge research and insights in geospatial and related fields."
      icon={<ArticleIcon />}
      contribution={{
        text: "Contribute a new publication",
        link: "/contribution/publication",
      }}
    />
  );
}
