import React from "react";

import ElementList from "../components/ElementList";
import usePageTitle from "../hooks/usePageTitle";

export default function Notebooks() {
  usePageTitle("Notebook");

  return (
    <ElementList
      dataType={["notebook"]}
      title="Notebooks"
      subtitle="Find your notebooks here"
    />
  );
}
