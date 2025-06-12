import { useState } from "react";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  retrieveElementsBySpatialMetadata,
  fetchSingleElementDetails,
} from "../../utils/DataRetrieval";
import ElementsMapEventHandler from "./ElementsMapEventHandler";
import SimpleInfoCard from "../../components/SimpleInfoCard";
import { processPoint, processPolygon } from "../../utils/SwitchLatLon";

// Get the leaflet icons including markers to work
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ElementsMapContainer(props) {
  const startingCenter = props.startingCenter || [39.8283, -98.5795];
  const startingZoom = props.startingZoom || 5;
  const maxBounds = props.maxBounds;
  const maxBoundsViscosity = props.maxBoundsViscosity;
  const minZoom = props.minZoom;
  const style = props.style || { height: "100%", width: "100%" };
  // Allow defining zooming behavior
  const scrollWheelZoom =
    props.scrollWheelZoom === undefined ? true : props.scrollWheelZoom;

  // If this is true, only display a single element spatial metadata.
  const elementPageMode = props.elementPageMode;
  const elementCentroid = props.elementCentroid;
  const elementBoundingBox = props.elementBoundingBox;
  const elementGeometry = props.elementGeometry;

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
        centroidLeaflet: processPoint(returnedElement.centroid?.coordinates),
      })
    );
    TEST_MODE &&
      console.log(
        "Elements returned for Element Map",
        processedReturnedElements
      );
    setElements(processedReturnedElements);
  }

  async function handleMarkerClick(selectedElementMetadata) {
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
      const elementDetails = await fetchSingleElementDetails(
        selectedElementMetadata.id
      );
      const geometry = elementDetails?.body["spatial-geometry"];
      const geometryForLeaflet = processPolygon(geometry?.coordinates);

      const boundingBoxForLeaflet = processPolygon(
        selectedElementMetadata["bounding-box"]?.coordinates
      );
      const processedSelectedElementMetadata = {
        ...selectedElementMetadata,
        geometryForLeaflet: geometryForLeaflet,
        boundingBoxForLeaflet: boundingBoxForLeaflet,
      };

      setSelectedElement(processedSelectedElementMetadata);
      // Otherwise, deselect the old one. This is likely due to clicking the active marker
    } else {
      TEST_MODE && console.log("Deselected element", selectedElementMetadata);
      setSelectedElement(null);
    }
  }

  function handleDeselectElements() {
    // Deselect any selected element when the map or popup close button is clicked.
    TEST_MODE &&
      console.log(
        "Deselect element via map click or popup close",
        selectedElement
      );
    setSelectedElement(null);
  }

  return (
    <MapContainer
      center={startingCenter}
      zoom={startingZoom}
      maxBounds={maxBounds}
      maxBoundsViscosity={maxBoundsViscosity}
      minZoom={minZoom}
      style={style}
      scrollWheelZoom={scrollWheelZoom}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {elementPageMode ? (
        <>
          {elementCentroid && <Marker position={elementCentroid} />}
          {elementGeometry && <Polygon positions={elementGeometry} />}
          {/* Display bounding box when polygon area is not available */}
          {!elementGeometry && elementBoundingBox && (
            <Polygon positions={elementBoundingBox} />
          )}
        </>
      ) : (
        <>
          <ElementsMapEventHandler
            onFetchElements={handleFetchElements}
            onMapClick={handleDeselectElements}
            onPopupClose={handleDeselectElements}
          />
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
          {selectedElement &&
            (selectedElement.geometryForLeaflet ? (
              <Polygon positions={selectedElement.geometryForLeaflet} />
            ) : (
              <Polygon positions={selectedElement.boundingBoxForLeaflet} />
            ))}
        </>
      )}
    </MapContainer>
  );
}
