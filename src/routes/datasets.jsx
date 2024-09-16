import React from "react";

import DatasetIcon from "@mui/icons-material/Dataset";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

export default function Datasets() {
  usePageTitle("Datasets");

  return (
    <ElementGridLayout
      elementType="dataset"
      title="Datasets"
      icon={<DatasetIcon />}
    />
  );
}
