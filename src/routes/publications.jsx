import React from "react";

import ElementList from "../components/ElementList";

export default function Publications() {
  return (
    <ElementList
      dataType={["publication"]}
      title="Publications"
      subtitle="Find your publications here"
    />
  );
}
