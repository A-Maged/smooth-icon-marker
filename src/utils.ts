export const gMaps = google.maps;

export const gInterpolate = google.maps.geometry.spherical.interpolate;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
