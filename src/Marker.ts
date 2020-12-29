import Denque from "denque";
import { gInterpolate, gMaps } from "./utils";
import { MarkerOptions, LatLng } from "./types";

const DEFAULT_DURATION_MS = 100;
const ANIMATION_LOOP_CHANGE_BY = 1;
const ANIMATION_LOOP_RESET_AT = 0;

export default class Marker extends gMaps.Marker {
  currentDestination: LatLng | null;
  durationMs: number;
  cbBeforeMove?: Function;
  cbAfterMove?: Function;
  private bigSteps: Denque;
  private offsetPositionBy: number;
  private animationCounter: number;

  constructor(args: MarkerOptions) {
    let {
      durationMs = DEFAULT_DURATION_MS,
      cbBeforeMove,
      cbAfterMove,
      ...options
    } = args;

    super(options);

    this.currentDestination = null;
    this.durationMs = durationMs;
    this.cbBeforeMove = cbBeforeMove;
    this.cbAfterMove = cbAfterMove;
    /* private */
    this.bigSteps = new Denque();
    this.offsetPositionBy = 0;
    this.animationCounter = this.animationCounterInitState();
  }

  animatedSetPosition(nextStep: LatLng) {
    this.bigSteps.push(nextStep);
    this.animate();
  }

  private animate() {
    this.animationCounter -= ANIMATION_LOOP_CHANGE_BY;

    if (this.animationCounter <= ANIMATION_LOOP_RESET_AT) {
      this.resetAnimation();
    } else {
      if (typeof this.cbBeforeMove === "function")
        this.cbBeforeMove(this.getPosition());

      const nextPosition = this.move(); /* move a small step towards current destination */

      if (typeof this.cbAfterMove === "function")
        this.cbAfterMove(nextPosition);

      requestAnimationFrame(this.animate.bind(this));
    }
  }

  private resetAnimation() {
    this.currentDestination = this.bigSteps.shift();
    this.offsetPositionBy = 0;
    this.animationCounter = this.animationCounterInitState();
  }

  private move(): LatLng {
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

    return smallStep;
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

  private animationCounterInitState() {
    return this.durationMs;
  }
}
