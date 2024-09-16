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
      subtitle="Browse peer-reviewed publications that showcase cutting-edge research and insights in geospatial science and related fields."
      icon={<ArticleIcon />}
    />
  );
}
