import { useState, useEffect, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  retrieveElementsBySpatialMetadata,
  fetchSingleElementDetails,
} from "../../utils/DataRetrieval";
import ElementsMapEventHandler from "./ElementsMapEventHandler";
import SimpleInfoCard from "../../components/SimpleInfoCard";
import {
  processPoint,
  processPolygon,
  addNoiseToPoint,
} from "./elementsMapHelpers";
import SmartZoomBounds from "./SmartZoomBounds";

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
  const disabledScrollWheelZoom = props.disabledScrollWheelZoom;
  const addNoiseToCentroid = props.addNoiseToCentroid;

  // If this is true, only display a single element spatial metadata.
  const elementPageMode = props.elementPageMode;
  const elementCentroid = props.elementCentroid;
  const elementBoundingBox = props.elementBoundingBox;
  const elementGeometry = props.elementGeometry;

  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState();

  const [showInstruction, setShowInstruction] = useState(false);
  const instructionTimeoutRef = useRef(null);

  const mapAttribution = `
    I-GUIDE Platform  
    <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a> apply. 
    &copy; <a href="https://osm.org/copyright" target="_blank" rel="noopener noreferrer">
    OpenStreetMap</a> contributors.
  `;

  function handleShowInstruction() {
    if (instructionTimeoutRef.current) {
      clearTimeout(instructionTimeoutRef.current);
    }
    setShowInstruction(true);
    // Display the instruction for 2 sec
    instructionTimeoutRef.current = setTimeout(() => {
      setShowInstruction(false);
    }, 2000);
  }

  async function handleFetchElements(viewboxCoords) {
    const returnedElements = await retrieveElementsBySpatialMetadata(
      viewboxCoords.minLon,
      viewboxCoords.maxLon,
      viewboxCoords.minLat,
      viewboxCoords.maxLat
    );
    // Process elements to create a Leaflet-friendly position
    const processedReturnedElements = returnedElements
      // Filter out elements without centroid
      .filter((returnedElement) => returnedElement.centroid)
      .map((returnedElement) => ({
        ...returnedElement,
        // This is important because the centroid returned uses [lat, lon], but react-leaflet uses [lon, lat]
        centroidLeaflet: addNoiseToPoint(
          processPoint(returnedElement.centroid),
          returnedElement.id,
          addNoiseToCentroid
        ),
      }));
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
      const geometryForLeaflet = processPolygon(geometry);

      const boundingBoxForLeaflet = processPolygon(
        selectedElementMetadata["bounding-box"]
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

  function ScrollZoomHandler(props) {
    const onShowInstruction = props.onShowInstruction;

    const map = useMap();
    const mapRef = useRef(map);

    useEffect(() => {
      function handleWheel(e) {
        if (e.ctrlKey || e.metaKey) {
          mapRef.current.scrollWheelZoom.enable();
        } else {
          mapRef.current.scrollWheelZoom.disable();
          onShowInstruction();
          e.preventDefault();
        }
      }

      const container = mapRef.current.getContainer();
      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, [onShowInstruction]);

    return null;
  }

  // In element page mode, display the map in a small frame. Disable scrolling unless pressing ctrl or cmd
  if (elementPageMode) {
    return (
      <>
        <MapContainer
          center={startingCenter}
          zoom={startingZoom}
          zoomControl={false} // Disable the default zoom control
          maxBounds={maxBounds}
          maxBoundsViscosity={maxBoundsViscosity}
          minZoom={minZoom}
          style={style}
          scrollWheelZoom={!disabledScrollWheelZoom}
        >
          <TileLayer
            attribution={mapAttribution}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Automatically zoom the map based on the component location or covered area */}
          <SmartZoomBounds
            marker={elementCentroid}
            polygon={elementGeometry}
            boundingBox={elementBoundingBox}
            fallbackCenter={startingCenter}
            fallbackZoom={startingZoom}
          />
          {elementCentroid && <Marker position={elementCentroid} />}
          {elementGeometry && <Polygon positions={elementGeometry} />}
          {/* Display bounding box when polygon area is not available */}
          {!elementGeometry && elementBoundingBox && (
            <Polygon positions={elementBoundingBox} />
          )}
          <ScrollZoomHandler onShowInstruction={handleShowInstruction} />
          <ZoomControl position="bottomright" />
        </MapContainer>
        {showInstruction && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "8px 14px",
              borderRadius: "4px",
              fontSize: "14px",
              zIndex: 1000,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            Hold <strong>Ctrl</strong> (or <strong>⌘</strong> on Mac) to zoom
            the map
          </div>
        )}
      </>
    );
  }

  return (
    <MapContainer
      center={startingCenter}
      zoom={startingZoom}
      zoomControl={false} // Disable the default zoom control
      maxBounds={maxBounds}
      maxBoundsViscosity={maxBoundsViscosity}
      minZoom={minZoom}
      style={style}
      scrollWheelZoom={!disabledScrollWheelZoom}
    >
      <TileLayer
        attribution={mapAttribution}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}
