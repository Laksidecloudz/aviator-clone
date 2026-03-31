import { GameState } from '../engine/GameStates.js';

export class BackgroundRenderer {
  constructor() {
    this._width = 0;
    this._height = 0;
  }

  resize(width, height) {
    this._width = width;
    this._height = height;
  }

  _getGradientColors(multiplier, state) {
    if (state === GameState.LOBBY || state === GameState.BETTING) {
      return {
        inner: '#3a1a1a',
        mid: '#2a0a0a',
        outer: '#1a0505'
      };
    }

    if (multiplier <= 1) {
      return {
        inner: '#1a3a6a',
        mid: '#102850',
        outer: '#0a1a3a'
      };
    }

    if (multiplier <= 2) {
      const t = (multiplier - 1) / 1;
      return {
        inner: this._lerpColor('#1a3a6a', '#2a3a6a', t),
        mid: this._lerpColor('#102850', '#1a285a', t),
        outer: this._lerpColor('#0a1a3a', '#101840', t)
      };
    }

    if (multiplier <= 5) {
      const t = (multiplier - 2) / 3;
      return {
        inner: this._lerpColor('#2a3a6a', '#4a2a6a', t),
        mid: this._lerpColor('#1a285a', '#3a1a5a', t),
        outer: this._lerpColor('#101840', '#201040', t)
      };
    }

    if (multiplier <= 10) {
      const t = (multiplier - 5) / 5;
      return {
        inner: this._lerpColor('#4a2a6a', '#6a2a5a', t),
        mid: this._lerpColor('#3a1a5a', '#5a1a4a', t),
        outer: this._lerpColor('#201040', '#301030', t)
      };
    }

    const t = Math.min(1, (multiplier - 10) / 10);
    return {
      inner: this._lerpColor('#6a2a5a', '#7a2a5a', t),
      mid: this._lerpColor('#5a1a4a', '#6a1a4a', t),
      outer: this._lerpColor('#301030', '#401020', t)
    };
  }

  _lerpColor(a, b, t) {
    const ar = parseInt(a.slice(1, 3), 16);
    const ag = parseInt(a.slice(3, 5), 16);
    const ab = parseInt(a.slice(5, 7), 16);
    const br = parseInt(b.slice(1, 3), 16);
    const bg = parseInt(b.slice(3, 5), 16);
    const bb = parseInt(b.slice(5, 7), 16);
    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const bl = Math.round(ab + (bb - ab) * t);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
  }

  render(ctx, w, h, multiplier = 1, state = GameState.LOBBY) {
    const colors = this._getGradientColors(multiplier, state);

    const grad = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, h * 1.2);
    grad.addColorStop(0, colors.inner);
    grad.addColorStop(0.6, colors.mid);
    grad.addColorStop(1, colors.outer);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h + 50;
    const rayCount = 40;
    const spread = Math.PI * 0.85;
    const length = Math.max(w, h) * 1.5;

    for (let i = 0; i < rayCount; i++) {
      const angle = -Math.PI / 2 - spread / 2 + (spread / rayCount) * i;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle - 0.015) * length, cy + Math.sin(angle - 0.015) * length);
      ctx.lineTo(cx + Math.cos(angle + 0.015) * length, cy + Math.sin(angle + 0.015) * length);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'rgba(255, 255, 255, 0.005)';
      ctx.fill();
    }

    if (state === GameState.CRASHED) {
      const grad = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, h * 1.2);
      grad.addColorStop(0, 'rgba(60, 10, 70, 0.7)');
      grad.addColorStop(0.5, 'rgba(40, 5, 50, 0.8)');
      grad.addColorStop(1, 'rgba(20, 0, 30, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }
}
