export const gmaps = google.maps;

export const gInterpolate = google.maps.geometry.spherical.interpolate;
export const gComputeDistanceBetween =
  google.maps.geometry.spherical.computeDistanceBetween;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
