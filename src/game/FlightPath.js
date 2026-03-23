import { getMultiplierAtTime } from './CrashAlgorithm.js';

const TARGET_SCREEN_FRACTION = 0.65;
const LERP_SPEED = 3.0;

export class FlightPath {
  constructor(width, height) {
    this._cameraOffset = 0;
    this._fixedViewMax = 10;
    this.resize(width, height);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.paddingLeft = 60;
    this.paddingBottom = 50;
    this.paddingTop = 30;
    this.paddingRight = 20;
    this.plotWidth = width - this.paddingLeft - this.paddingRight;
    this.plotHeight = height - this.paddingTop - this.paddingBottom;
  }

  setFixedViewMax(crashMultiplier) {
    this._fixedViewMax = Math.max(10, crashMultiplier * 1.15);
  }

  updateCamera(flightTimeMs, dtMs) {
    const seconds = flightTimeMs / 1000;
    const viewSeconds = 20;
    if (seconds <= viewSeconds * TARGET_SCREEN_FRACTION) {
      this._cameraOffset += (0 - this._cameraOffset) * Math.min(1, LERP_SPEED * (dtMs / 1000));
      return;
    }
    const targetX = seconds * (this.plotWidth / viewSeconds);
    const visibleFraction = TARGET_SCREEN_FRACTION * this.plotWidth;
    const targetOffset = targetX - visibleFraction;
    this._cameraOffset += (targetOffset - this._cameraOffset) * Math.min(1, LERP_SPEED * (dtMs / 1000));
  }

  getCameraOffset() {
    return this._cameraOffset;
  }

  resetCamera() {
    this._cameraOffset = 0;
  }

  timeToX(flightTimeMs) {
    const seconds = flightTimeMs / 1000;
    const viewSeconds = 20;
    const rawX = (seconds / viewSeconds) * this.plotWidth;
    return this.paddingLeft + rawX - this._cameraOffset;
  }

  multiplierToY(multiplier) {
    const viewMax = this._fixedViewMax;
    const logMax = Math.log(viewMax);
    const logVal = Math.log(Math.max(1, multiplier));
    const fraction = logMax > 0 ? logVal / logMax : 0;
    return this.paddingTop + this.plotHeight - fraction * this.plotHeight;
  }

  getPlanePosition(flightTimeMs, crashMultiplier) {
    const multiplier = getMultiplierAtTime(flightTimeMs, crashMultiplier);
    const prevMultiplier = getMultiplierAtTime(Math.max(0, flightTimeMs - 200), crashMultiplier);
    return {
      x: this.timeToX(flightTimeMs),
      y: this.multiplierToY(multiplier),
      angle: Math.atan2(
        this.multiplierToY(multiplier) - this.multiplierToY(prevMultiplier),
        this.timeToX(flightTimeMs) - this.timeToX(Math.max(0, flightTimeMs - 200))
      ),
    };
  }

  getGridLines(cameraOffset) {
    const hLines = [];
    const vLines = [];

    const yValues = [1, 2, 5, 10, 20, 50, 100];
    for (const val of yValues) {
      hLines.push({ y: this.multiplierToY(val), label: val + 'x' });
    }

    const secondsPerTick = 5;
    const viewSeconds = 20;
    const rawStartSec = Math.floor((cameraOffset / this.plotWidth) * viewSeconds / secondsPerTick) * secondsPerTick;
    const rawEndSec = ((cameraOffset + this.plotWidth) / this.plotWidth) * viewSeconds;
    for (let sec = rawStartSec; sec <= rawEndSec + secondsPerTick; sec += secondsPerTick) {
      if (sec < 0) continue;
      const rawX = (sec / viewSeconds) * this.plotWidth;
      const x = this.paddingLeft + rawX - cameraOffset;
      vLines.push({ x, label: sec + 's' });
    }

    return { hLines, vLines };
  }
}
