import React from "react";

import SchoolIcon from "@mui/icons-material/School";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

export default function OERs() {
  usePageTitle("Educational Resources");

  return (
    <ElementGridLayout
      elementType="oer"
      title="Educational Resources"
      subtitle="Discover educational resources tailored for teaching and learning in geospatial data science, designed for students and professionals alike."
      icon={<SchoolIcon />}
    />
  );
}
