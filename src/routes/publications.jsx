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
      icon={<ArticleIcon />}
    />
  );
}
