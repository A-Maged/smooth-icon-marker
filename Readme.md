# Install

```bash
  npm install smooth-icon-marker
```

or using yarn

```bash
  yarn add smooth-icon-marker
```

# Add google maps SDK and Geometry library

```html
<script src="https://maps.googleapis.com/maps/api/js?&libraries=geometry"></script>
```

# Demo

```bash
cd src/demo
yarn && yarn start
```

# Options

This library extends google maps marker. It inherits all of it's options and methods and it adds to them:

### `animatedSetPosition()`

```js
import SmoothMarker from "smooth-icon-marker";

let marker = new SmoothMarker({
  duration: 20, // In millisecond. Tweak for your own use case
  map,
  position: startPosition,
});

marker.animatedSetPosition(newPosition);
```
