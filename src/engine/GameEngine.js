import { GameState, canTransition, StateDurations } from './GameStates.js';
import { generateCrashPoint, getMultiplierAtTime } from '../game/CrashAlgorithm.js';

export class GameEngine {
  constructor(config = {}) {
    this._config = {
      betPhaseDurationMs: config.betPhaseDurationMs ?? StateDurations.BETTING_PHASE_MS,
      crashedPhaseDurationMs: config.crashedPhaseDurationMs ?? StateDurations.CRASHED_PHASE_MS,
      houseEdge: config.houseEdge ?? 0.01,
      startingBalance: config.startingBalance ?? 1000,
    };

    this._state = {
      currentState: GameState.LOBBY,
      multiplier: 1.00,
      currentFlightTimeMs: 0,
      crashMultiplier: 1.00,
      countdownRemainingMs: this._config.betPhaseDurationMs,
      balance: this._config.startingBalance,

      betAmount: 0,
      hasBet: false,
      isCashedOut: false,
      cashoutMultiplier: 0,
      cashoutAmount: 0,

      betAmount2: 0,
      hasBet2: false,
      isCashedOut2: false,
      cashoutMultiplier2: 0,
      cashoutAmount2: 0,

      autoCashoutEnabled: false,
      autoCashoutTarget: 2.00,
      autoCashoutEnabled2: false,
      autoCashoutTarget2: 2.00,

      lastWinAmount: 0,
      crashHistory: [],
      roundNumber: 0,
    };

    this._listeners = new Map();
    this._lastTimestamp = 0;
    this._isRunning = false;
    this._loopBound = this._loop.bind(this);

    this._tickPayload = { state: this._state, deltaTimeMs: 0 };
    this._multiplierPayload = { multiplier: 1, flightTimeMs: 0 };
  }

  getState() {
    return this._state;
  }

  getConfig() {
    return this._config;
  }

  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    this._listeners.get(event)?.delete(callback);
  }

  _emit(event, data) {
    const callbacks = this._listeners.get(event);
    if (callbacks) {
      for (const cb of callbacks) {
        cb(data);
      }
    }
  }

  _transition(to) {
    const from = this._state.currentState;
    if (!canTransition(from, to)) {
      console.warn(`Invalid transition: ${from} -> ${to}`);
      return false;
    }
    this._state.currentState = to;
    this._emit('stateChange', { from, to, state: this._state });
    return true;
  }

  start() {
    if (this._isRunning) return;
    this._isRunning = true;
    this._lastTimestamp = performance.now();
    this._transitionToBetting();
    requestAnimationFrame(this._loopBound);
  }

  stop() {
    this._isRunning = false;
  }

  placeBet(amount, slot) {
    if (this._state.currentState !== GameState.BETTING) return false;
    if (amount <= 0 || amount > this._state.balance) return false;

    if (slot === 2) {
      if (this._state.hasBet2) return false;
      this._state.hasBet2 = true;
      this._state.betAmount2 = amount;
      this._state.balance -= amount;
      this._state.isCashedOut2 = false;
      this._state.cashoutMultiplier2 = 0;
      this._state.cashoutAmount2 = 0;
    } else {
      if (this._state.hasBet) return false;
      this._state.hasBet = true;
      this._state.betAmount = amount;
      this._state.balance -= amount;
      this._state.isCashedOut = false;
      this._state.cashoutMultiplier = 0;
      this._state.cashoutAmount = 0;
    }

    this._emit('betPlaced', { amount, slot, balance: this._state.balance });
    this._emit('balanceUpdate', { balance: this._state.balance });
    return true;
  }

  cashout(slot) {
    if (this._state.currentState !== GameState.FLYING) return false;

    if (slot === 2) {
      if (!this._state.hasBet2 || this._state.isCashedOut2) return false;
      const winAmount = this._state.betAmount2 * this._state.multiplier;
      this._state.isCashedOut2 = true;
      this._state.cashoutMultiplier2 = this._state.multiplier;
      this._state.cashoutAmount2 = winAmount;
      this._state.balance += winAmount;
      this._state.lastWinAmount = winAmount;
      this._emit('cashout', { multiplier: this._state.cashoutMultiplier2, amount: winAmount, slot: 2, balance: this._state.balance });
    } else {
      if (!this._state.hasBet || this._state.isCashedOut) return false;
      const winAmount = this._state.betAmount * this._state.multiplier;
      this._state.isCashedOut = true;
      this._state.cashoutMultiplier = this._state.multiplier;
      this._state.cashoutAmount = winAmount;
      this._state.balance += winAmount;
      this._state.lastWinAmount = winAmount;
      this._emit('cashout', { multiplier: this._state.cashoutMultiplier, amount: winAmount, slot: 1, balance: this._state.balance });
    }

    this._emit('balanceUpdate', { balance: this._state.balance });
    return true;
  }

  setAutoCashout(enabled, target, slot) {
    if (slot === 2) {
      this._state.autoCashoutEnabled2 = enabled;
      this._state.autoCashoutTarget2 = target;
    } else {
      this._state.autoCashoutEnabled = enabled;
      this._state.autoCashoutTarget = target;
    }
  }

  _loop(timestamp) {
    if (!this._isRunning) return;

    let deltaTimeMs = timestamp - this._lastTimestamp;
    if (deltaTimeMs > 50) deltaTimeMs = 50;
    this._lastTimestamp = timestamp;

    switch (this._state.currentState) {
      case GameState.BETTING:
        this._updateBetting(deltaTimeMs);
        break;
      case GameState.FLYING:
        this._updateFlying(deltaTimeMs);
        break;
      case GameState.CRASHED:
        this._updateCrashed(deltaTimeMs);
        break;
      case GameState.LOBBY:
        this._updateLobby();
        break;
    }

    this._tickPayload.deltaTimeMs = deltaTimeMs;
    this._emit('tick', this._tickPayload);
    requestAnimationFrame(this._loopBound);
  }

  _updateBetting(dt) {
    this._state.countdownRemainingMs -= dt;
    if (this._state.countdownRemainingMs <= 0) {
      this._state.countdownRemainingMs = 0;
      this._startFlight();
    }
  }

  _updateFlying(dt) {
    this._state.currentFlightTimeMs += dt;
    this._state.multiplier = getMultiplierAtTime(
      this._state.currentFlightTimeMs,
      this._state.crashMultiplier
    );

    if (this._state.multiplier >= this._state.crashMultiplier * 0.995) {
      this._state.multiplier = this._state.crashMultiplier;
      this._crash();
      return;
    }

    if (this._state.hasBet && !this._state.isCashedOut && this._state.autoCashoutEnabled && this._state.multiplier >= this._state.autoCashoutTarget) {
      this.cashout(1);
    }
    if (this._state.hasBet2 && !this._state.isCashedOut2 && this._state.autoCashoutEnabled2 && this._state.multiplier >= this._state.autoCashoutTarget2) {
      this.cashout(2);
    }

    this._multiplierPayload.multiplier = this._state.multiplier;
    this._multiplierPayload.flightTimeMs = this._state.currentFlightTimeMs;
    this._emit('multiplierUpdate', this._multiplierPayload);
  }

  _updateCrashed(dt) {
    this._state.countdownRemainingMs -= dt;
    if (this._state.countdownRemainingMs <= 0) {
      this._transitionToLobby();
    }
  }

  _updateLobby() {
    this._transitionToBetting();
  }

  _startFlight() {
    this._state.crashMultiplier = generateCrashPoint();
    this._state.currentFlightTimeMs = 0;
    this._state.multiplier = 1.00;
    this._state.roundNumber++;

    this._transition(GameState.FLYING);
    this._emit('flightStart', {
      crashMultiplier: this._state.crashMultiplier,
      roundNumber: this._state.roundNumber,
    });
  }

  _crash() {
    this._state.crashHistory.unshift(this._state.crashMultiplier);
    if (this._state.crashHistory.length > 20) {
      this._state.crashHistory.length = 20;
    }

    if (this._state.hasBet && !this._state.isCashedOut) {
      this._state.lastWinAmount = 0;
    }
    if (this._state.hasBet2 && !this._state.isCashedOut2) {
      this._state.lastWinAmount = 0;
    }

    this._state.countdownRemainingMs = this._config.crashedPhaseDurationMs;

    this._transition(GameState.CRASHED);
    this._emit('crash', {
      crashMultiplier: this._state.crashMultiplier,
      winAmount: (this._state.isCashedOut ? this._state.cashoutAmount : 0) + (this._state.isCashedOut2 ? this._state.cashoutAmount2 : 0),
    });
  }

  _transitionToLobby() {
    this._state.hasBet = false;
    this._state.betAmount = 0;
    this._state.isCashedOut = false;
    this._state.cashoutMultiplier = 0;
    this._state.cashoutAmount = 0;
    this._state.hasBet2 = false;
    this._state.betAmount2 = 0;
    this._state.isCashedOut2 = false;
    this._state.cashoutMultiplier2 = 0;
    this._state.cashoutAmount2 = 0;

    this._transition(GameState.LOBBY);
  }

  _transitionToBetting() {
    this._state.countdownRemainingMs = this._config.betPhaseDurationMs;
    this._state.multiplier = 1.00;
    this._state.currentFlightTimeMs = 0;

    this._transition(GameState.BETTING);
  }
}
