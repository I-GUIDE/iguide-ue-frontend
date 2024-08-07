import React from "react";

import ElementList from "../components/ElementList";
import usePageTitle from "../hooks/usePageTitle";

export default function Datasets() {
  usePageTitle("Datasets");

  return (
    <ElementList
      dataType={["dataset"]}
      title="Datasets"
      subtitle="Find your datasets here"
    />
  );
}
