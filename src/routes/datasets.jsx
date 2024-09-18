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
      subtitle="Access a wide variety of geospatial datasets curated for research, analysis, and educational purposes across different domains."
      icon={<DatasetIcon />}
      contribution={{
        text: "Contribute a new dataset",
        link: "/contribution/dataset",
      }}
    />
  );
}
