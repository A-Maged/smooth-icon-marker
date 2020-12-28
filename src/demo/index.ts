import SmoothMarker from "smooth-icon-marker";
import { sleep } from "../utils";
import fakeMapPoints from "./fakeData.json";

const startPosition = new google.maps.LatLng(
  fakeMapPoints[0].lat,
  fakeMapPoints[0].lng
);

/* init map */
const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
  center: startPosition,
  zoom: 18,
});

/* Our Marker */
let marker = new SmoothMarker({
  map,
  position: startPosition,
  durationMs: 80,
});

(async function simulateMovingDevice(marker: SmoothMarker) {
  for (const nextPoint of fakeMapPoints) {
    const newPosition = new google.maps.LatLng(nextPoint.lat, nextPoint.lng);

    marker.animatedSetPosition(newPosition);

    /* simulate device send interval and network latency */
    await sleep(100);
  }
})(marker);
