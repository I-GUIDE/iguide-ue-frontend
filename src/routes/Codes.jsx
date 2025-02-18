import React from "react";

import GitHubIcon from "@mui/icons-material/GitHub";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../features/ElementGrid/ElementGridLayout";

import { TAGLINES } from "../configs/Texts";

export default function Codes() {
  usePageTitle("Code");

  return (
    // We don't include the new map link, because we won't make this type of contribution publically available
    <ElementGridLayout
      elementType="code"
      title="Code"
      subtitle={TAGLINES.code}
      icon={<GitHubIcon />}
    />
  );
}
