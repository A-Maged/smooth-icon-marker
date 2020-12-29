import Denque from "denque";
import { gInterpolate, gMaps } from "./utils";
import { MarkerOptions, LatLng } from "./types";

const DEFAULT_DURATION_MS = 100;
const ANIMATION_LOOP_CHANGE_BY = 1;
const ANIMATION_LOOP_RESET_AT = 0;

export default class Marker extends gMaps.Marker {
  currentDestination: LatLng | null;
  durationMs: number;
  hasTrailLine?: boolean;
  trailLine: google.maps.Polyline | null;
  private bigSteps: Denque;
  private offsetPositionBy: number;
  private animationCounter: number;

  constructor(args: MarkerOptions) {
    let {
      durationMs = DEFAULT_DURATION_MS,
      hasTrailLine = true,
      ...options
    } = args;

    super(options);

    this.currentDestination = null;
    this.durationMs = durationMs;
    this.hasTrailLine = hasTrailLine;
    this.trailLine = this.initTrailLine();
    /* private */
    this.bigSteps = new Denque();
    this.offsetPositionBy = 0;
    this.animationCounter = this.animationCounterInitState() as number;
  }

  animatedSetPosition(nextStep: LatLng) {
    this.bigSteps.push(nextStep);
    this.animate();
  }

  animate() {
    this.animationCounter -= ANIMATION_LOOP_CHANGE_BY;

    if (this.animationCounter <= ANIMATION_LOOP_RESET_AT) {
      this.resetAnimation();
    } else {
      this.move(); /* move a small step towards current destination */

      requestAnimationFrame(this.animate.bind(this));
    }
  }

  private resetAnimation() {
    this.currentDestination = this.bigSteps.shift();
    this.offsetPositionBy = 0;
    this.animationCounter = this.animationCounterInitState();
  }

  move() {
    this.currentDestination = this.currentDestination ?? this.bigSteps.shift();
    const startPosition = this.getPosition() as LatLng;
    const endPosition = this.currentDestination as LatLng;
    this.offsetPositionBy += 100 / (this.durationMs * 6000);

    const smallStep = gInterpolate(
      startPosition,
      endPosition,
      this.offsetPositionBy
    );

    if (this.currentDestination) this.changeDirection(this.currentDestination);
    this.setPosition(smallStep);
    this.drawPath(smallStep);
  }

  changeDirection(newPosition: LatLng) {
    let currentPosition = this.getPosition();
    if (!currentPosition) return;

    let icon = this.getIcon() as google.maps.Symbol;
    if (typeof icon !== "object") return;

    icon.rotation = gMaps.geometry.spherical.computeHeading(
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
      ? new gMaps.Polyline({
          // strokeOpacity: 0, // hide line
          path: [],
          map: this.getMap() as google.maps.Map,
        })
      : null;
  }

  private animationCounterInitState() {
    return this.durationMs;
  }
}
