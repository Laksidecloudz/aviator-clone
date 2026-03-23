export class BackgroundRenderer {
  constructor() {
    this._canvas = null;
    this._ctx = null;
    this._width = 0;
    this._height = 0;
  }

  resize(width, height) {
    if (this._width === width && this._height === height) return;
    this._width = width;
    this._height = height;

    if (!this._canvas) {
      this._canvas = document.createElement('canvas');
    }
    this._canvas.width = width;
    this._canvas.height = height;
    this._ctx = this._canvas.getContext('2d');

    this._drawStatic(this._ctx, width, height);
  }

  _drawStatic(ctx, w, h) {
    const grad = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, h * 1.2);
    grad.addColorStop(0, '#1a1a3e');
    grad.addColorStop(1, '#0a0a1a');
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
  }

  render(ctx) {
    if (this._canvas) {
      ctx.drawImage(this._canvas, 0, 0);
    }
  }
}
