import React from "react";

import ElementList from "../components/ElementList";
import usePageTitle from "../hooks/usePageTitle";

export default function Notebooks() {
  usePageTitle("Notebooks");

  return (
    <ElementList
      dataType={["notebook"]}
      title="Notebooks"
      subtitle="Find your notebooks here"
    />
  );
}
