export function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

export class ScreenShake {
  constructor() {
    this.intensity = 0;
    this.durationMs = 0;
    this.elapsedMs = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this._active = false;
  }

  trigger(intensity, durationMs) {
    this.intensity = intensity;
    this.durationMs = durationMs;
    this.elapsedMs = 0;
    this._active = true;
  }

  update(dtMs) {
    if (!this._active) return;

    this.elapsedMs += dtMs;
    const progress = this.elapsedMs / this.durationMs;

    if (progress >= 1) {
      this._active = false;
      this.offsetX = 0;
      this.offsetY = 0;
      return;
    }

    const decay = 1 - progress;
    const currentIntensity = this.intensity * decay;
    this.offsetX = (Math.random() * 2 - 1) * currentIntensity;
    this.offsetY = (Math.random() * 2 - 1) * currentIntensity;
  }

  isActive() {
    return this._active;
  }
}

function interpolateColor(colorA, colorB, t) {
  const aR = parseInt(colorA.slice(1, 3), 16);
  const aG = parseInt(colorA.slice(3, 5), 16);
  const aB = parseInt(colorA.slice(5, 7), 16);
  const bR = parseInt(colorB.slice(1, 3), 16);
  const bG = parseInt(colorB.slice(3, 5), 16);
  const bB = parseInt(colorB.slice(5, 7), 16);

  const r = Math.round(lerp(aR, bR, t));
  const g = Math.round(lerp(aG, bG, t));
  const b = Math.round(lerp(aB, bB, t));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function getCurveColor(multiplier) {
  if (multiplier < 2) {
    return interpolateColor('#00ff88', '#ffcc00', multiplier / 2);
  }
  if (multiplier < 10) {
    return interpolateColor('#ffcc00', '#ff3366', (multiplier - 2) / 8);
  }
  return '#ff3366';
}
