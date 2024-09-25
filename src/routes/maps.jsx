import React from "react";

import MapIcon from "@mui/icons-material/Map";

import usePageTitle from "../hooks/usePageTitle";
import ElementGridLayout from "../layouts/ElementGridLayout";

export default function Maps() {
  usePageTitle("Maps");

  return (
    <ElementGridLayout
      elementType="map"
      title="Maps"
      subtitle="Unlock new insights with map research—where data meets geography to reveal hidden connections."
      icon={<MapIcon />}
    />
  );
}
