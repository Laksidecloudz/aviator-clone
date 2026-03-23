import { GameState } from '../engine/GameStates.js';
import { BackgroundRenderer } from './BackgroundRenderer.js';
import { CurveRenderer } from './CurveRenderer.js';
import { ParticlePool } from './ParticlePool.js';
import { ScreenShake, easeInOutQuad } from './effects.js';
import { FlightPath } from '../game/FlightPath.js';

export class CanvasRenderer {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._dpr = window.devicePixelRatio || 1;

    this._background = new BackgroundRenderer();
    this._curve = new CurveRenderer();
    this._particles = new ParticlePool();
    this._shake = new ScreenShake();
    this._flightPath = new FlightPath(0, 0);

    this._width = 0;
    this._height = 0;

    this._frameCount = 0;
    this._timestamp = 0;
    this._prevState = null;
  }

  resize(width, height) {
    this._width = width;
    this._height = height;
    this._canvas.width = width * this._dpr;
    this._canvas.height = height * this._dpr;
    this._canvas.style.width = width + 'px';
    this._canvas.style.height = height + 'px';
    this._ctx.scale(this._dpr, this._dpr);

    this._background.resize(width, height);
    this._flightPath.resize(width, height);
  }

  render(state, dtMs, timestamp) {
    const ctx = this._ctx;
    const w = this._width;
    const h = this._height;
    this._timestamp = timestamp;

    if (this._prevState !== state.currentState && state.currentState === GameState.FLYING) {
      this._flightPath.setFixedViewMax(state.crashMultiplier);
    }
    if (this._prevState !== state.currentState && state.currentState === GameState.BETTING) {
      this._flightPath.resetCamera();
    }
    this._prevState = state.currentState;

    if (state.currentState === GameState.FLYING || state.currentState === GameState.CRASHED) {
      this._flightPath.updateCamera(state.currentFlightTimeMs, dtMs);
    }

    ctx.save();

    if (state.currentState === GameState.CRASHED) {
      this._shake.update(dtMs);
      ctx.translate(this._shake.offsetX, this._shake.offsetY);
    }

    switch (state.currentState) {
      case GameState.LOBBY:
        this._background.render(ctx, w, h);
        this._renderLobby(ctx, w, h);
        break;
      case GameState.BETTING:
        this._background.render(ctx, w, h);
        this._renderBetting(ctx, w, h, state);
        break;
      case GameState.FLYING:
        this._background.render(ctx, w, h);
        this._renderFlying(ctx, w, h, state, dtMs);
        break;
      case GameState.CRASHED:
        this._background.render(ctx, w, h);
        this._renderCrashed(ctx, w, h, state, dtMs);
        break;
    }

    ctx.restore();
  }

  _renderLobby(ctx, w, h) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('', w / 2, h / 2 + 40);
  }

  _renderBetting(ctx, w, h, state) {
    const progress = 1 - (state.countdownRemainingMs / 5000);
    const radius = 20;
    const cx = w / 2;
    const cy = h - 100;

    ctx.strokeStyle = 'rgba(255, 204, 0, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();
  }

  _renderFlying(ctx, w, h, state, dtMs) {
    this._curve.updatePath(
      this._flightPath,
      state.currentFlightTimeMs,
      state.crashMultiplier
    );
    this._curve.drawFill(ctx);
    this._curve.draw(ctx, state.multiplier);

    const pos = this._flightPath.getPlanePosition(
      state.currentFlightTimeMs,
      state.crashMultiplier
    );

    this._drawPlane(ctx, pos.x, pos.y, pos.angle);

    if (this._frameCount % 2 === 0) {
      this._particles.spawnTrail(pos.x - 12, pos.y);
    }

    this._particles.update(dtMs);
    this._particles.draw(ctx);

    this._frameCount++;
  }

  _renderCrashed(ctx, w, h, state, dtMs) {
    this._curve.updatePath(
      this._flightPath,
      state.currentFlightTimeMs,
      state.crashMultiplier
    );
    this._curve.drawFill(ctx);
    this._curve.draw(ctx, state.crashMultiplier);

    this._particles.update(dtMs);
    this._particles.draw(ctx);

    if (this._shake.isActive()) {
      const pos = this._flightPath.getPlanePosition(
        state.currentFlightTimeMs,
        state.crashMultiplier
      );
      this._drawCrashEffect(ctx, pos.x, pos.y);
    }
  }

  _drawPlane(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const t = (Math.sin(this._timestamp / 300) + 1) / 2;
    const bobOffset = (easeInOutQuad(t) * 2 - 1) * 3;
    ctx.translate(0, bobOffset);

    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(0, -14);
    ctx.lineTo(-4, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(0, 14);
    ctx.lineTo(-4, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-8, -3);
    ctx.lineTo(-14, -10);
    ctx.lineTo(-10, -3);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = 'rgba(255, 23, 68, 0.6)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(255, 23, 68, 0.15)';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, 6.2832);
    ctx.fill();
    ctx.restore();
  }

  _drawCrashEffect(ctx) {
    const flashAlpha = 0.15;
    ctx.fillStyle = `rgba(255, 51, 102, ${flashAlpha})`;
    ctx.fillRect(0, 0, this._width, this._height);
  }

  triggerCrashEffect(planeX, planeY) {
    this._shake.trigger(12, 400);
    this._particles.spawnCrashBurst(planeX, planeY);
  }

  getFlightPath() {
    return this._flightPath;
  }
}
