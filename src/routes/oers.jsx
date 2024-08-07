import React from "react";

import ElementList from "../components/ElementList";
import usePageTitle from "../hooks/usePageTitle";

export default function OERS() {
  usePageTitle("Educational Resources");

  return (
    <ElementList
      dataType={["oer"]}
      title="Educational Resources"
      subtitle="Find your educational resources here"
    />
  );
}
