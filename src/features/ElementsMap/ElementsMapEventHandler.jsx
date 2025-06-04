import { useEffect, useRef } from "react";

import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const MOVEMENT_THRESHOLD = import.meta.env.VITE_MOVEMENT_THRESHOLD || 0.3;
const ZOOM_THRESHOLD = import.meta.env.VITE_ZOOM_THRESHOLD || 1;
const DEBOUNCE_IN_MS = import.meta.env.VITE_DEBOUNCE_IN_MS || 1500;

// Return true when map movements on X and/or Y direction exceeds the threshold
function hasMovedOverThreshold(prevBounds, newBounds) {
  // When previous bounds don't exist, treat it as moved significantly
  if (!prevBounds) {
    return true;
  }

  const prevWidth = prevBounds.getEast() - prevBounds.getWest();
  const prevHeight = prevBounds.getNorth() - prevBounds.getSouth();

  const dx = Math.abs(prevBounds.getWest() - newBounds.getWest());
  const dy = Math.abs(prevBounds.getSouth() - newBounds.getSouth());

  const movedOverThresholdOnX = dx > prevWidth * MOVEMENT_THRESHOLD;
  const movedOverThresholdOnY = dy > prevHeight * MOVEMENT_THRESHOLD;

  TEST_MODE &&
    console.log(
      "Check movement: Previous width and height (x, y)",
      prevWidth,
      prevHeight,
      "Movement (x, y)",
      dx,
      dy,
      "moved over threshold? (x, y)",
      movedOverThresholdOnX,
      movedOverThresholdOnY
    );

  return movedOverThresholdOnX || movedOverThresholdOnY;
}

function hasZoomedOverThreshold(prevZoom, newZoom) {
  // When previous bounds don't exist, treat it as moved significantly
  if (!prevZoom) {
    return true;
  }

  const zoomChange = newZoom - (prevZoom ?? newZoom);
  const zoomedOverThreshold = Math.abs(zoomChange) >= ZOOM_THRESHOLD;

  TEST_MODE &&
    console.log(
      "Check zooming: Previous zoom",
      prevZoom,
      "New zoom",
      newZoom,
      "Zoom changed",
      zoomChange,
      "Zoomed over threshold?",
      zoomedOverThreshold
    );

  return zoomedOverThreshold;
}

export default function ElementsMapEventHandler(props) {
  const onFetchElements = props.onFetchElements;
  const onMapClick = props.onMapClick;
  const onPopupClose = props.onPopupClose;

  const elementsMap = useMapEvents({});
  const lastBoundsRef = useRef(null);
  const lastZoomRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const didInitialFetch = useRef(false);

  useEffect(() => {
    if (!didInitialFetch.current && elementsMap) {
      const initialBounds = elementsMap.getBounds();
      const initialZoom = elementsMap.getZoom();

      lastBoundsRef.current = initialBounds;
      lastZoomRef.current = initialZoom;

      const northEast = initialBounds.getNorthEast();
      const southWest = initialBounds.getSouthWest();

      TEST_MODE && console.log(`Initial viewbox:`);
      TEST_MODE && console.log("NE:", northEast.lat, northEast.lng);
      TEST_MODE && console.log("SW:", southWest.lat, southWest.lng);

      onFetchElements({
        minLon: southWest.lng,
        maxLon: northEast.lng,
        minLat: southWest.lat,
        maxLat: northEast.lat,
      });
      didInitialFetch.current = true;
    }
  }, [elementsMap, onFetchElements]); // Runs once after map is ready

  useMapEvents({
    click: () => {
      onMapClick();
    },
    popupclose: () => {
      onPopupClose();
    },
    moveend: () => {
      // Clear any existing debounce timer
      clearTimeout(debounceTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        const currentBounds = elementsMap.getBounds();
        const currentZoom = elementsMap.getZoom();

        const validMoved = hasMovedOverThreshold(
          lastBoundsRef.current,
          currentBounds
        );
        const validZoomed = hasZoomedOverThreshold(
          lastZoomRef.current,
          currentZoom
        );

        if (validMoved || validZoomed) {
          // Only update when fetching
          lastBoundsRef.current = currentBounds;
          lastZoomRef.current = currentZoom;

          const northEast = currentBounds.getNorthEast();
          const southWest = currentBounds.getSouthWest();

          TEST_MODE && console.log(`Viewbox after ${DEBOUNCE_IN_MS}ms idle:`);
          TEST_MODE && console.log("NE:", northEast.lat, northEast.lng);
          TEST_MODE && console.log("SW:", southWest.lat, southWest.lng);

          onFetchElements({
            minLon: southWest.lng,
            maxLon: northEast.lng,
            minLat: southWest.lat,
            maxLat: northEast.lat,
          });
        }
      }, DEBOUNCE_IN_MS);
    },
  });
}
