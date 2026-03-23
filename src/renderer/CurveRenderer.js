import { getMultiplierAtTime } from '../game/CrashAlgorithm.js';
import { getCurveColor } from './effects.js';

const MAX_PATH_POINTS = 500;

export class CurveRenderer {
  constructor() {
    this._pathX = new Float32Array(MAX_PATH_POINTS);
    this._pathY = new Float32Array(MAX_PATH_POINTS);
    this._pointCount = 0;
    this._bottomY = 0;
  }

  updatePath(flightPath, flightTimeMs, crashMultiplier) {
    const steps = Math.min(MAX_PATH_POINTS, Math.ceil(flightTimeMs / 20));
    if (steps < 2) {
      this._pointCount = 0;
      return;
    }

    this._bottomY = flightPath.paddingTop + flightPath.plotHeight;
    const stepMs = flightTimeMs / steps;
    this._pointCount = steps + 1;

    for (let i = 0; i <= steps; i++) {
      const t = i * stepMs;
      const mult = getMultiplierAtTime(t, crashMultiplier);
      this._pathX[i] = flightPath.timeToX(t);
      this._pathY[i] = flightPath.multiplierToY(mult);
    }
  }

  drawFill(ctx) {
    if (this._pointCount < 2) return;
    ctx.save();

    const bottomY = this._bottomY;
    const grad = ctx.createLinearGradient(0, this._pathY[0], 0, bottomY);
    grad.addColorStop(0, 'rgba(255, 51, 102, 0.35)');
    grad.addColorStop(0.5, 'rgba(255, 51, 102, 0.15)');
    grad.addColorStop(1, 'rgba(255, 51, 102, 0.02)');

    ctx.beginPath();
    ctx.moveTo(this._pathX[0], this._pathY[0]);
    for (let i = 1; i < this._pointCount; i++) {
      ctx.lineTo(this._pathX[i], this._pathY[i]);
    }
    ctx.lineTo(this._pathX[this._pointCount - 1], bottomY);
    ctx.lineTo(this._pathX[0], bottomY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  draw(ctx, currentMultiplier) {
    if (this._pointCount < 2) return;

    const color = getCurveColor(currentMultiplier);

    ctx.save();

    ctx.strokeStyle = color;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.08;
    this._tracePath(ctx);
    ctx.stroke();

    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.2;
    this._tracePath(ctx);
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 1;
    this._tracePath(ctx);
    ctx.stroke();

    ctx.restore();
  }

  _tracePath(ctx) {
    ctx.beginPath();
    ctx.moveTo(this._pathX[0], this._pathY[0]);
    for (let i = 1; i < this._pointCount; i++) {
      ctx.lineTo(this._pathX[i], this._pathY[i]);
    }
  }
}
