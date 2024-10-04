import React from "react";

import SchoolIcon from "@mui/icons-material/School";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

export default function OERs() {
  usePageTitle("Educational Resources");

  return (
    // We don't include the new educational resource link, because we won't make this type of contribution publically available
    <ElementGridLayout
      elementType="oer"
      title="Educational Resources"
      subtitle="Harness data-intensive teaching and learning materials with a focus on geospatial data science."
      icon={<SchoolIcon />}
    />
  );
}
