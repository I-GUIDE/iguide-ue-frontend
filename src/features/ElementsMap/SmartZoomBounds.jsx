import { useEffect } from "react";

import { useMap } from "react-leaflet";
import L from "leaflet";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function SmartZoomBounds(props) {
  const marker = props.marker;
  const polygon = props.polygon;
  const boundingBox = props.boundingBox;
  const fallbackCenter = props.fallbackCenter;
  const fallbackZoom = props.fallbackZoom;

  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([]);

    if (marker) {
      bounds.extend(marker);
    }

    if (polygon && polygon.length) {
      bounds.extend(polygon);
    }

    if (!polygon && boundingBox && boundingBox.length) {
      bounds.extend(boundingBox);
    }

    if (bounds.isValid()) {
      TEST_MODE && console.log("Processed smart zoom bounds", bounds);
      map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 12,
      });
    } else {
      // Fallback when there's nothing to fit
      map.setView(fallbackCenter || [37.8, -96], fallbackZoom || 5);
    }
  }, [map, marker, polygon, boundingBox, fallbackCenter, fallbackZoom]);

  return null;
}
