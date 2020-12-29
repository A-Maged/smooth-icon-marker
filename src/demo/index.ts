import SmoothMarker from "../index";
import fakeMapPoints from "./fakeData.json";

const carSymbol = {
  path:
    "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
  scale: 1,
  fillColor: "red",
  fillOpacity: 1,
  strokeWeight: 1,
  strokeOpacity: 1,
  anchor: new google.maps.Point(22, 35),
};

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
  icon: carSymbol,
  map,
  position: startPosition,
  durationMs: 90,
  cbAfterMove: drawPath,
});

const trailLine = new google.maps.Polyline({
  path: [],
  map,
});

(async function simulateMovingDevice(marker: SmoothMarker) {
  for (const nextPoint of fakeMapPoints) {
    const newPosition = new google.maps.LatLng(nextPoint.lat, nextPoint.lng);

    marker.animatedSetPosition(newPosition);

    /* simulate device send interval and network latency */
    await sleep(100);
  }
})(marker);

function drawPath(newPosition: google.maps.LatLng) {
  trailLine.getPath().push(newPosition);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
