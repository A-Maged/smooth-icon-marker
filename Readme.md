# Install

```bash
  npm install smooth-icon-marker
```

or using yarn

```bash
  yarn add smooth-icon-marker
```

# Add google maps SDK and Geometry library before your script

```html
<script src="https://maps.googleapis.com/maps/api/js?&libraries=geometry"></script>

<script src="your-app.js"></script>
```

# Demo

```bash
git clone git@github.com:A-Maged/smooth-icon-marker.git
cd smooth-icon-marker/src/demo
yarn && yarn start
```

# Usage

### Import

```js
import SmoothMarker from "smooth-icon-marker";
```

### `animatedSetPosition()`

Use this instead of the default `SetPosition` method to get the animation effect.

```js
import SmoothMarker from "smooth-icon-marker";

let marker = new SmoothMarker({
  map,
  position: startPosition,
});

marker.animatedSetPosition(newPosition);
```

# Options

This library extends google maps marker. It inherits all of it's options and methods and it adds to them:

### `durationMs`

Animation duration in milliseconds.

Default is `100ms`.

```js
let marker = new SmoothMarker({
  map,
  position: startPosition,
  durationMs: 100, // Tweak for your own use case
});
```

### `hasTrailLine`

Show a Polyline behind the Marker.

Default is `true`.

```js
let marker = new SmoothMarker({
  map,
  position: startPosition,
  hasTrailLine: false,
});
```
