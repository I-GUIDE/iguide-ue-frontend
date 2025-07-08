function swapPoint(point, path) {
  if (!Array.isArray(point)) {
    console.warn(`Invalid point at ${path}: Not an array. Got:`, point);
    return null;
  }
  if (
    point.length !== 2 ||
    typeof point[0] !== "number" ||
    typeof point[1] !== "number"
  ) {
    console.warn(
      `Invalid point at ${path}: Must contain exactly 2 numbers. Got:`,
      point
    );
    return null;
  }
  return [point[1], point[0]]; // reverse [lon, lat] -> [lat, lon]
}

// Switch the order of lat, lon
export function processPoint(pointObject) {
  if (!pointObject) {
    return;
  }
  const point = pointObject.coordinates;
  const type = pointObject.type;

  if (type !== "Point") {
    console.warn("Expected a point.");
    return;
  }

  return swapPoint(point, `${point[0]}, ${point[1]}`);
}

// Switch the lat, lon for each point in the polygon
export function processPolygon(polygonObject) {
  if (!polygonObject) {
    return;
  }

  const polygon = polygonObject.coordinates;
  const type = polygonObject.type;

  if (!Array.isArray(polygon)) {
    console.warn("Invalid input: Expected an array (Polygon or MultiPolygon).");
    return null;
  }

  const isMultiPolygon = Array.isArray(polygon[0]?.[0]?.[0]);

  if (isMultiPolygon !== (type === "MultiPolygon")) {
    console.warn(
      `Polygon types are mismatched. Detected isMultiPolygon ${isMultiPolygon}, type returned as ${type}`
    );
  }

  try {
    if (isMultiPolygon) {
      const processedMultipolygon = polygon.map((poly, i) => {
        if (!Array.isArray(poly)) {
          console.warn(`Invalid polygon at [${i}]: Not an array.`);
          throw new Error(`Invalid polygon at [${i}]`);
        }

        return poly.map((ring, j) => {
          if (!Array.isArray(ring)) {
            console.warn(`Invalid ring at [${i}][${j}]: Not an array.`);
            throw new Error(`Invalid ring at [${i}][${j}]`);
          }

          return ring.map((point, k) => {
            const result = swapPoint(point, `[${i}][${j}][${k}]`);
            if (result === null)
              throw new Error(`Invalid point at [${i}][${j}][${k}]`);
            return result;
          });
        });
      });

      return processedMultipolygon;
    } else {
      const processedPolygon = polygon.map((ring, j) => {
        if (!Array.isArray(ring)) {
          console.warn(`Invalid ring at [${j}]: Not an array.`);
          throw new Error(`Invalid ring at [${j}]`);
        }

        return ring.map((point, k) => {
          const result = swapPoint(point, `[${j}][${k}]`);
          if (result === null) throw new Error(`Invalid point at [${j}][${k}]`);
          return result;
        });
      });

      return processedPolygon;
    }
  } catch (err) {
    console.warn("Error processing polygon:", err.message);
    return null;
  }
}

// Generate deterministic noises to a point
export function addNoiseToPoint(
  point,
  hashId,
  enabled = false,
  offsetScale = 1
) {
  if (!point) {
    return null;
  }
  if (!enabled || !hashId) {
    return point;
  }
  let hash = 0;
  for (let i = 0; i < hashId.length; i++) {
    hash += hashId.charCodeAt(i);
  }

  const randX = Math.sin(hash) % 1;
  const randY = Math.sin(hash + 1) % 1;
  // about 1,000 feet * scale
  const offset = 0.003 * offsetScale;

  return [
    point[0] + (randY - 0.5) * 2 * offset,
    point[1] + (randX - 0.5) * 2 * offset,
  ];
}
