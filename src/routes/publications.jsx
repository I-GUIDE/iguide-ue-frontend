import React from "react";

import ArticleIcon from "@mui/icons-material/Article";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../features/ElementGrid/ElementGridLayout";

import { TAGLINES } from "../configs/Texts";

export default function Publications() {
  usePageTitle("Publications");

  return (
    <ElementGridLayout
      elementType="publication"
      title="Publications"
      subtitle={TAGLINES.publication}
      icon={<ArticleIcon />}
      contribution={{
        text: "Contribute a new publication",
        link: "/contribution/publication",
      }}
    />
  );
}
