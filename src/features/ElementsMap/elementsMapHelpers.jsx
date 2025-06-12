// Switch the order of lat, lon
export function processPoint(point) {
  if (!point || !Array.isArray(point)) {
    console.warn("Processing point: Not an array.");
    return null;
  }

  if (point.length !== 2) {
    console.warn("Processing point: Point has more than 2 items.");
    return null;
  }

  return [point[1], point[0]];
}

// Switch the lat, lon for each point in the polygon
export function processPolygon(polygon) {
  if (!Array.isArray(polygon)) {
    console.warn("Processing polygon: Not an array.");
    return null;
  }

  const polygonCopy = JSON.parse(JSON.stringify(polygon));

  // Iterate through the first dimension of the array
  for (let i = 0; i < polygonCopy.length; i++) {
    // Ensure the current element is an array (second dimension)
    if (!Array.isArray(polygonCopy[i])) {
      console.warn(
        `Processing polygon: Element at index ${i} is not an array.`
      );
      return null;
    }

    for (let j = 0; j < polygonCopy[i].length; j++) {
      const singlePoint = polygonCopy[i][j];

      // Ensure the current element is an array (inner-most dimension)
      if (!Array.isArray(singlePoint)) {
        console.warn(
          `Processing polygon: Element at index [${i}][${j}] is not an array.`
        );
        return null;
      }

      // Check the length of the inner-most array
      if (singlePoint.length > 2) {
        console.warn(
          `Processing polygon: Point at [${i}][${j}] has more than 2 items.`
        );
        return null;
      }

      singlePoint.reverse();
    }
  }
  return polygonCopy;
}

// Generate deterministic noises to a point
export function addNoiseToPoint(
  point,
  hashId,
  enabled = false,
  offsetScale = 1
) {
  if (!enabled) {
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
