import { useState } from "react";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
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
  const [selectedElement, setSelectedElement] = useState();

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

  function handleMarkerClick(selectedElementMetadata) {
    // When click a new element, select the new element.
    if (
      selectedElementMetadata &&
      selectedElement?.id !== selectedElementMetadata.id
    ) {
      TEST_MODE &&
        console.log(
          "Selected element",
          selectedElementMetadata,
          "Deselected",
          selectedElement
        );

      const boundingBoxPolygon =
        selectedElementMetadata["bounding-box"].coordinates[0];
      const boundingBoxPolygonForLeaflet = boundingBoxPolygon.map((point) => [
        point[1],
        point[0],
      ]);
      const processedSelectedElementMetadata = {
        ...selectedElementMetadata,
        boundingBoxForLeaflet: boundingBoxPolygonForLeaflet,
      };

      setSelectedElement(processedSelectedElementMetadata);
      // Otherwise, deselect the old one
    } else {
      TEST_MODE && console.log("Deselected element", selectedElementMetadata);
      setSelectedElement(null);
    }
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
          eventHandlers={{
            click: () => handleMarkerClick(elementMetadata),
          }}
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
      {selectedElement && (
        <Polygon positions={selectedElement.boundingBoxForLeaflet} />
      )}
    </MapContainer>
  );
}
