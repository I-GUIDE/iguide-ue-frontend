// Switch the order of lat, lon
export function processPoint(point) {
  if (!point || !Array.isArray(point)) {
    return null;
  }

  if (point.length !== 2) {
    return null;
  }

  return [point[1], point[0]];
}

// Switch the lat, lon for each point in the polygon
export function processPolygon(polygon) {
  if (!polygon || !Array.isArray(polygon)) {
    return null;
  }

  const processedPolygon = polygon
    .filter((point) => point.length === 2)
    .map((point) => [...point].reverse());

  return processedPolygon;
}
