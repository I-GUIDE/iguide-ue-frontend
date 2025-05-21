import React, { useEffect, useRef, useState } from "react";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { retrieveElementsBySpatialMetadata } from "../../utils/DataRetrieval";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

// Update elements when the map changes
function ViewboxUpdater(props) {
  const setViewboxCoords = props.setViewboxCoords;

  const elementsMap = useMap();
  const timeoutRef = useRef(null);
  const debounceInMs = 1500;

  useEffect(() => {
    const bounds = elementsMap.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    TEST_MODE && console.log("Initial viewbox:");
    TEST_MODE && console.log("NE:", northEast.lat, northEast.lng);
    TEST_MODE && console.log("SW:", southWest.lat, southWest.lng);
    setViewboxCoords({
      minLon: southWest.lng,
      maxLon: northEast.lng,
      minLat: southWest.lat,
      maxLat: northEast.lat,
    });
  }, [elementsMap, setViewboxCoords]); // Runs once after map is ready

  useEffect(() => {
    async function handleMapChange() {
      // Clear previous timeout if the user is still moving the elementsMap
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // set new timeout for the set debounce
      timeoutRef.current = setTimeout(() => {
        const bounds = elementsMap.getBounds();
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        TEST_MODE && console.log(`Viewbox after ${debounceInMs}ms idle:`);
        TEST_MODE && console.log("NE:", northEast.lat, northEast.lng);
        TEST_MODE && console.log("SW:", southWest.lat, southWest.lng);
        setViewboxCoords({
          minLon: southWest.lng,
          maxLon: northEast.lng,
          minLat: southWest.lat,
          maxLat: northEast.lat,
        });
      }, debounceInMs);
    }

    elementsMap.on("move", handleMapChange); // triggered on pan or zoom
    elementsMap.on("zoom", handleMapChange); // optional: include zoom

    // Cleanup on unmount
    return () => {
      elementsMap.off("move", handleMapChange);
      elementsMap.off("zoom", handleMapChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [elementsMap, setViewboxCoords]);
}

export default function ElementsMapContainer(props) {
  const startingCenter = props.startingCenter || [39.8283, -98.5795];
  const startingZoom = props.startingZoom || 5;

  const [viewboxCoords, setViewboxCoords] = useState();

  useEffect(() => {
    async function handleMapChange() {
      const elements = await retrieveElementsBySpatialMetadata(
        viewboxCoords.minLon,
        viewboxCoords.maxLon,
        viewboxCoords.minLat,
        viewboxCoords.maxLat
      );
      TEST_MODE && console.log("Elements returned for Elements Map", elements);
    }

    if (viewboxCoords) {
      handleMapChange();
    }
  }, [viewboxCoords]);

  return (
    <MapContainer
      center={startingCenter}
      zoom={startingZoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ViewboxUpdater setViewboxCoords={setViewboxCoords} />
    </MapContainer>
  );
}
