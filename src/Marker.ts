import Denque from "denque";
import { icon, gInterpolate, gComputeDistanceBetween, gmaps } from "./utils";
import { MarkerOptions, LatLng } from "./types";

export default class Marker extends gmaps.Marker implements MarkerOptions {
  animationStepsQueue: Denque;
  duration: number;
  hasTrailLine?: boolean;
  isProcessingQueue: boolean;
  trailLine: google.maps.Polyline | null;

  constructor({ duration, hasTrailLine = true, ...options }: MarkerOptions) {
    options.icon = icon;

    super(options);

    this.duration = duration;
    this.isProcessingQueue = false;
    this.animationStepsQueue = new Denque();
    this.hasTrailLine = hasTrailLine;
    this.trailLine = hasTrailLine
      ? new gmaps.Polyline({
          // strokeOpacity: 0, // hide line
          path: [],
          map: this.getMap() as google.maps.Map,
        })
      : null;
  }

  animatedSetPosition(newPosition: LatLng) {
    this.changeDirection(newPosition);

    /* queue while busy */
    if (this.isProcessingQueue) {
      this.animationStepsQueue.push(newPosition);
    }

    /* reset and fill queue */
    this.isProcessingQueue = true;
    this.animationStepsQueue = this.getStepsBetween(
      this.getPosition(),
      newPosition
    );

    /* process queue */
    this.processAnimationQueue();
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

  private processAnimationQueue() {
    const step = this.animationStepsQueue.shift();

    /* move one step*/
    if (step) {
      this.setPosition(step);
      this.drawPath(step);
    }

    /* repeat until queue is empty */
    if (this.animationStepsQueue.length > 0) {
      requestAnimationFrame(this.processAnimationQueue.bind(this));
    } else {
      /* reset */
      this.isProcessingQueue = false;
    }
  }

  private drawPath(newPosition: LatLng) {
    if (!this.hasTrailLine || !this.trailLine) return;

    let newPath = this.trailLine.getPath();

    newPath.push(newPosition);

    this.trailLine.setPath(newPath);
  }

  private getStepsBetween(start: LatLng | null | undefined, end: LatLng) {
    if (!start || !end) return new Denque();

    let steps = new Denque();
    let increamentByFraction = 0;
    // let distanceDiff = gComputeDistanceBetween(start, end);

    for (let i = 0; i < this.duration * 60; i++) {
      increamentByFraction += 100 / (this.duration * 6000);
      const step = gInterpolate(start, end, increamentByFraction);
      steps.push(step);
    }

    return steps;
  }
}
