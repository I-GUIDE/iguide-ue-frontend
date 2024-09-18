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
      subtitle="Discover educational resources tailored for teaching and learning in geospatial data science, designed for students and professionals alike."
      icon={<SchoolIcon />}
    />
  );
}
