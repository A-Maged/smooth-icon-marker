export interface MarkerOptions extends google.maps.ReadonlyMarkerOptions {
  durationMs: number;
  hasTrailLine?: boolean;
}

export type LatLng = google.maps.LatLng;
