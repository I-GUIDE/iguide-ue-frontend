import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { retrieveElementsBySpatialMetadata } from "../../utils/DataRetrieval";
import ElementsMapEventHandler from "./ElementsMapEventHandler";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ElementsMapContainer(props) {
  const startingCenter = props.startingCenter || [39.8283, -98.5795];
  const startingZoom = props.startingZoom || 5;
  const maxBounds = props.maxBounds;
  const maxBoundsViscosity = props.maxBoundsViscosity;
  const minZoom = props.minZoom;

  async function handleFetchElements(viewboxCoords) {
    const elements = await retrieveElementsBySpatialMetadata(
      viewboxCoords.minLon,
      viewboxCoords.maxLon,
      viewboxCoords.minLat,
      viewboxCoords.maxLat
    );
    TEST_MODE && console.log("Elements returned for Elements Map", elements);
  }

  return (
    <MapContainer
      center={startingCenter}
      zoom={startingZoom}
      maxBounds={maxBounds}
      maxBoundsViscosity={maxBoundsViscosity}
      minZoom={minZoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ElementsMapEventHandler onFetchElements={handleFetchElements} />
    </MapContainer>
  );
}
