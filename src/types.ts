export interface MarkerOptions extends google.maps.ReadonlyMarkerOptions {
  durationMs?: number;
  hasTrailLine?: boolean;
  cbBeforeMove?: Function;
  cbAfterMove?: Function;
}

export type LatLng = google.maps.LatLng;
