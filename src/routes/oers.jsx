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
      icon={<SchoolIcon />}
    />
  );
}
