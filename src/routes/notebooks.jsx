import React from "react";

import CodeIcon from "@mui/icons-material/Code";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

export default function Notebooks() {
  usePageTitle("Notebooks");

  return (
    <ElementGridLayout
      elementType="notebook"
      title="Notebooks"
      icon={<CodeIcon />}
    />
  );
}
