import React from "react";

import ElementList from "../components/ElementList";
import usePageTitle from "../hooks/usePageTitle";

import CodeIcon from "@mui/icons-material/Code";

export default function Notebooks() {
  usePageTitle("Notebooks");

  return (
    <ElementList
      dataType={["notebook"]}
      title="Notebooks"
      subtitle="Find your notebooks here"
      icon={<CodeIcon />}
    />
  );
}
