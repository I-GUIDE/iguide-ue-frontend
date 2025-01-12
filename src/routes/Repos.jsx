import React from "react";

import GitHubIcon from "@mui/icons-material/GitHub";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../features/ElementGrid/ElementGridLayout";

import { TAGLINES } from "../configs/Texts";

export default function Repos() {
  usePageTitle("Repositories");

  return (
    // We don't include the new map link, because we won't make this type of contribution publically available
    <ElementGridLayout
      elementType="repo"
      title="Repositories"
      subtitle={TAGLINES.repo}
      icon={<GitHubIcon />}
    />
  );
}
