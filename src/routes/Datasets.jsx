import React from "react";

import DatasetIcon from "@mui/icons-material/Dataset";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../features/ElementGrid/ElementGridLayout";

import { TAGLINES } from "../configs/Texts";

export default function Datasets() {
  usePageTitle("Datasets");

  return (
    <ElementGridLayout
      elementType="dataset"
      title="Datasets"
      subtitle={TAGLINES.dataset}
      icon={<DatasetIcon />}
      contribution={{
        text: "Contribute a new dataset",
        link: "/contribution/dataset",
      }}
    />
  );
}
