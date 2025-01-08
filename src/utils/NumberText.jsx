/**
 * Get a text with smart number annotation (e.g. 1.1k, 5.7m)
 * @param {number} num The number
 * @return {string} text
 */
export function NumberText(num) {
  if (num < 0) return "0";

  if (num >= 1000000) {
    return (Math.round(num / 100000) / 10).toString() + "m";
  } else if (num >= 1000) {
    return (Math.round(num / 100) / 10).toString() + "k";
  } else {
    return num.toFixed(0).toString();
  }
}
