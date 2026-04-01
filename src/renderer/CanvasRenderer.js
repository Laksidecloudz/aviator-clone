import { GameState } from '../engine/GameStates.js';
import { BackgroundRenderer } from './BackgroundRenderer.js';
import { CurveRenderer } from './CurveRenderer.js';
import { ParticlePool } from './ParticlePool.js';
import { ScreenShake } from './effects.js';
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
    this._crashTimestamp = null;
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
      this._crashTimestamp = null;
    }
    if (this._prevState !== state.currentState && state.currentState === GameState.CRASHED) {
      this._crashTimestamp = timestamp;
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
        this._background.render(ctx, w, h, 0, GameState.LOBBY);
        this._renderLobby(ctx, w, h);
        break;
      case GameState.BETTING:
        this._background.render(ctx, w, h, 0, GameState.BETTING);
        this._renderBetting(ctx, w, h, state);
        break;
      case GameState.FLYING:
        this._background.render(ctx, w, h, state.multiplier, GameState.FLYING);
        this._renderFlying(ctx, w, h, state, dtMs);
        break;
      case GameState.CRASHED:
        this._background.render(ctx, w, h, state.crashMultiplier, GameState.CRASHED);
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

  _renderCurve(ctx, state, drawMultiplier) {
    this._curve.updatePath(
      this._flightPath,
      state.currentFlightTimeMs,
      state.crashMultiplier
    );
    this._curve.drawFill(ctx);
    this._curve.draw(ctx, drawMultiplier);
  }

  _renderFlying(ctx, w, h, state, dtMs) {
    this._renderCurve(ctx, state, state.multiplier);

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
    this._renderCurve(ctx, state, state.crashMultiplier);

    // Fly-away animation
    if (this._crashTimestamp !== null) {
      const flyAwayMs = performance.now() - this._crashTimestamp;
      const flyAwayT = Math.min(flyAwayMs / 1200, 1.0);

      const basePos = this._flightPath.getPlanePosition(
        state.currentFlightTimeMs,
        state.crashMultiplier
      );

      const flyAwayY = basePos.y - flyAwayT * 250;
      const flyAwayX = basePos.x + flyAwayT * 30;
      const flyAwayAngle = basePos.angle - flyAwayT * 0.6;
      const flyAwayAlpha = 1 - flyAwayT * flyAwayT;

      ctx.globalAlpha = Math.max(0, flyAwayAlpha);
      this._drawPlane(ctx, flyAwayX, flyAwayY, flyAwayAngle);
      ctx.globalAlpha = 1;

      // Trail during fly-away
      if (flyAwayT < 0.5) {
        if (this._frameCount % 2 === 0) {
          this._particles.spawnTrail(flyAwayX - 12, flyAwayY);
        }
      }
    }

    this._particles.update(dtMs);
    this._particles.draw(ctx);

    this._frameCount++;
  }

  _drawPlane(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const t = this._timestamp / 1000;
    const bobOffset = Math.sin(t * 4) * 1.2;
    ctx.translate(0, bobOffset);

    const s = 0.9;
    ctx.scale(s, s);

    ctx.fillStyle = '#ff1744';

    ctx.beginPath();
    ctx.moveTo(24, 0);
    ctx.quadraticCurveTo(20, -6, 8, -5);
    ctx.lineTo(-4, -4);
    ctx.quadraticCurveTo(-12, -3, -16, -1);
    ctx.lineTo(-20, 0);
    ctx.lineTo(-16, 1);
    ctx.quadraticCurveTo(-12, 3, -4, 4);
    ctx.lineTo(8, 5);
    ctx.quadraticCurveTo(20, 6, 24, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#cc0033';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(6, -2.5);
    ctx.lineTo(10, 2.5);
    ctx.moveTo(10, -2.5);
    ctx.lineTo(6, 2.5);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 120, 150, 0.45)';
    ctx.beginPath();
    ctx.ellipse(12, -1.5, 5, 2.5, 0, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.moveTo(8, -5);
    ctx.lineTo(6, -16);
    ctx.lineTo(-2, -16);
    ctx.lineTo(-4, -5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8, 5);
    ctx.lineTo(6, 16);
    ctx.lineTo(-2, 16);
    ctx.lineTo(-4, 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-14, -1);
    ctx.lineTo(-18, -10);
    ctx.lineTo(-20, -1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-14, -0.5);
    ctx.lineTo(-20, -4);
    ctx.lineTo(-22, -0.5);
    ctx.lineTo(-20, 3);
    ctx.closePath();
    ctx.fill();

    const propAngle = t * 28;
    ctx.save();
    ctx.translate(24, 0);
    ctx.rotate(propAngle);
    ctx.fillStyle = '#cc0033';
    ctx.beginPath();
    ctx.ellipse(0, -9, 1.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 9, 1.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.shadowColor = 'rgba(255, 23, 68, 0.35)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(255, 23, 68, 0.06)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
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
