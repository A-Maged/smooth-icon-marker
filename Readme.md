# smooth-icon-marker

Animate Google Maps marker movement from it's position to a destination.

# Install

```bash
npm install smooth-icon-marker
```

##### or using yarn

```bash
yarn add smooth-icon-marker
```

# Add google maps SDK and Geometry library before your script

```html
<script src="https://maps.googleapis.com/maps/api/js?&libraries=geometry"></script>

<script src="your-app.js"></script>
```

# Usage

### Import

```js
import SmoothMarker from "smooth-icon-marker";
```

### `animatedSetPosition(destination: google.maps.LatLng)`

Use this instead of the default `SetPosition` method to get the animation effect.

```js
const startPosition = new google.maps.LatLng(
  35.9588769088931,
  -115.12207388877869
);
const endPosition = new google.maps.LatLng(
  35.95950326404771,
  -115.12020304799081
);

let marker = new SmoothMarker({
  map,
  position: startPosition,
});

marker.animatedSetPosition(endPosition);
```

# Options

This library extends google maps marker. It inherits all of it's options and methods and it adds to them:

- `durationMs` (number) - Animation duration in milliseconds - Default is `100ms`.

- `hasTrailLine` (bool) - Show a Polyline behind the Marker - Default is `true`.

```js
let marker = new SmoothMarker({
  durationMs: 80, // Tweak for your own use case
  hasTrailLine: false,
  map,
  position: startPosition,
});
```

# Demo

Click on the image to see a live demo.

<a href="https://a-maged.github.io/smooth-icon-marker/" target="_blank">
    <img src="https://github.com/A-Maged/smooth-icon-marker/blob/main/src/demo/Screenshot.png?raw=true" width="600" alt="demo screenshot">
</a>

```bash
git clone git@github.com:A-Maged/smooth-icon-marker.git
cd smooth-icon-marker/src/demo
yarn && yarn start
```
