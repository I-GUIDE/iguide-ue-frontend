import { useState } from "react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { retrieveElementsBySpatialMetadata } from "../../utils/DataRetrieval";
import ElementsMapEventHandler from "./ElementsMapEventHandler";
import SimpleInfoCard from "../../components/SimpleInfoCard";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ElementsMapContainer(props) {
  const startingCenter = props.startingCenter || [39.8283, -98.5795];
  const startingZoom = props.startingZoom || 5;
  const maxBounds = props.maxBounds;
  const maxBoundsViscosity = props.maxBoundsViscosity;
  const minZoom = props.minZoom;

  const [elements, setElements] = useState([]);

  async function handleFetchElements(viewboxCoords) {
    const returnedElements = await retrieveElementsBySpatialMetadata(
      viewboxCoords.minLon,
      viewboxCoords.maxLon,
      viewboxCoords.minLat,
      viewboxCoords.maxLat
    );
    // Process elements to create a Leaflet-friendly position
    const processedReturnedElements = returnedElements.map(
      (returnedElement) => ({
        ...returnedElement,
        // This is important because the centroid returned uses [lat, lon], but react-leaflet uses [lon, lat]
        centroidLeaflet: [
          returnedElement.centroid[1],
          returnedElement.centroid[0],
        ],
      })
    );
    TEST_MODE &&
      console.log(
        "Elements returned for Elements Map",
        processedReturnedElements
      );
    setElements(processedReturnedElements);
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
      {elements.map((elementMetadata) => (
        <Marker
          key={elementMetadata.id}
          position={elementMetadata.centroidLeaflet}
        >
          <Popup>
            <SimpleInfoCard
              cardtype={elementMetadata["resource-type"]}
              pageId={elementMetadata.id}
              title={elementMetadata.title}
              thumbnailImage={elementMetadata["thumbnail-image"]}
              minHeight="100%"
              width="100%"
              openInNewTab
              showElementType
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
