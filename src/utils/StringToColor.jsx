export function stringToHSLColor(
  str,
  lightness = 85,
  saturation = 50,
  contrast = 55
) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  const hue = (hash >>> 0) % 360;
  return {
    bgColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    fontColor: `hsl(${hue}, ${saturation}%, ${Math.max(
      0,
      lightness - contrast
    )}%)`,
  };
}
