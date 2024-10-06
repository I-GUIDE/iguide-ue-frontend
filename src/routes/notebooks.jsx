import React from "react";

import CodeIcon from "@mui/icons-material/Code";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

import { TAGLINES } from "../configs/Texts";

export default function Notebooks() {
  usePageTitle("Notebooks");

  return (
    <ElementGridLayout
      elementType="notebook"
      title="Notebooks"
      subtitle={TAGLINES.notebook}
      icon={<CodeIcon />}
      contribution={{
        text: "Contribute a new notebook",
        link: "/contribution/notebook",
      }}
    />
  );
}
