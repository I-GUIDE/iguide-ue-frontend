import React from "react";

import MapIcon from "@mui/icons-material/Map";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

import { TAGLINES } from "../configs/Texts";

export default function Maps() {
  usePageTitle("Maps");

  return (
    // We don't include the new map link, because we won't make this type of contribution publically available
    <ElementGridLayout
      elementType="map"
      title="Maps"
      subtitle={TAGLINES.map}
      icon={<MapIcon />}
    />
  );
}
