import Denque from "denque";
import { icon, gInterpolate, gComputeDistanceBetween, gmaps } from "./utils";
import { MarkerOptions, LatLng } from "./types";

export default class Marker extends gmaps.Marker implements MarkerOptions {
  currentDestination: LatLng | null;
  durationMs: number;
  hasTrailLine?: boolean;
  trailLine: google.maps.Polyline | null;

  private bigSteps: Denque;
  private increamentByFraction: number;
  private loopIndex: number;

  constructor({
    durationMs = 100,
    hasTrailLine = true,
    ...options
  }: MarkerOptions) {
    options.icon = icon;
    super(options);

    this.currentDestination = null;
    this.durationMs = durationMs;
    this.hasTrailLine = hasTrailLine;
    this.trailLine = this.initTrailLine();

    this.bigSteps = new Denque();
    this.increamentByFraction = 0;
    this.loopIndex = this.loopIndexInitState() as number;
  }

  animatedSetPosition(nextStep: LatLng) {
    this.bigSteps.push(nextStep);

    this.animate();
  }

  animate() {
    this.currentDestination = this.currentDestination ?? this.bigSteps.shift();
    let start = this.getPosition() as LatLng;
    let end = this.currentDestination as LatLng;
    // let distance = gComputeDistanceBetween(start, end);
    this.loopIndex -= 1;

    if (this.loopIndex <= 0) {
      /* resel */
      this.currentDestination = this.bigSteps.shift();
      this.increamentByFraction = 0;
      this.loopIndex = this.loopIndexInitState();
    } else {
      /* move a small step */
      this.increamentByFraction += 100 / (this.durationMs * 6000);
      const smallStep = gInterpolate(start, end, this.increamentByFraction);

      this.move(smallStep);

      requestAnimationFrame(this.animate.bind(this));
    }
  }

  move(position: LatLng) {
    if (this.currentDestination) this.changeDirection(this.currentDestination);

    this.setPosition(position);
    this.drawPath(position);
  }

  changeDirection(newPosition: LatLng) {
    let currentPosition = this.getPosition();

    if (!currentPosition) return;

    let icon = this.getIcon() as google.maps.Symbol;

    icon.rotation = gmaps.geometry.spherical.computeHeading(
      currentPosition,
      newPosition
    );

    this.setIcon(icon);
  }

  private drawPath(newPosition: LatLng) {
    if (!this.hasTrailLine || !this.trailLine) return;

    let newPath = this.trailLine.getPath();

    newPath.push(newPosition);

    this.trailLine.setPath(newPath);
  }

  private initTrailLine() {
    return this.hasTrailLine
      ? new gmaps.Polyline({
          // strokeOpacity: 0, // hide line
          path: [],
          map: this.getMap() as google.maps.Map,
        })
      : null;
  }

  private loopIndexInitState() {
    return this.durationMs;
  }
}
