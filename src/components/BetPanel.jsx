import { useState, useCallback, useMemo } from 'react';
import { GameState } from '../engine/GameStates.js';
import { formatMultiplier } from '../game/CrashAlgorithm.js';

const QUICK_AMOUNTS = [1, 5, 10, 25, 50];

export function BetPanel({ slot, gameState, placeBet, cashout, playClick }) {
  const [betAmount, setBetAmount] = useState(10);
  const [mode, setMode] = useState('bet');
  const [autoCashoutTarget, setAutoCashoutTarget] = useState(2.00);
  const [autoBetEnabled, setAutoBetEnabled] = useState(false);

  const isSlot2 = slot === 2;
  const hasBet = isSlot2 ? gameState.hasBet2 : gameState.hasBet;
  const isCashedOut = isSlot2 ? gameState.isCashedOut2 : gameState.isCashedOut;
  const activeBet = isSlot2 ? gameState.betAmount2 : gameState.betAmount;

  const { currentState, balance, multiplier } = gameState;

  const canBet = currentState === GameState.BETTING && !hasBet;
  const canCashout = currentState === GameState.FLYING && hasBet && !isCashedOut;
  const isWaiting = currentState === GameState.FLYING && hasBet && isCashedOut;

  const cashoutValue = useMemo(() => {
    if (canCashout) return formatMultiplier(multiplier);
    return null;
  }, [canCashout, multiplier]);

  const handleBet = useCallback(() => {
    if (canBet && betAmount > 0 && betAmount <= balance) {
      playClick?.();
      placeBet(betAmount, slot);
    }
  }, [canBet, betAmount, balance, placeBet, slot, playClick]);

  const handleCashout = useCallback(() => {
    if (canCashout) {
      playClick?.();
      cashout(slot);
    }
  }, [canCashout, cashout, slot, playClick]);

  const handleAutoBetToggle = useCallback(() => {
    playClick?.();
    setAutoBetEnabled((prev) => !prev);
  }, [playClick]);

  const handleQuickAmount = (amount) => {
    playClick?.();
    setBetAmount(amount);
  };

  const handleAmountChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) setBetAmount(val);
  };

  const handleAutoCashoutChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 1) setAutoCashoutTarget(val);
  };

  return (
    <div className="bet-panel">
      <div className="bet-panel-tabs">
        <button
          className={`bet-panel-tab ${mode === 'bet' ? 'active' : ''}`}
          onClick={() => { playClick?.(); setMode('bet'); }}
        >
          Bet
        </button>
        <button
          className={`bet-panel-tab ${mode === 'auto' ? 'active' : ''}`}
          onClick={() => { playClick?.(); setMode('auto'); }}
        >
          Auto
        </button>
      </div>

      <div className="bet-panel-body">
        {mode === 'auto' && (
          <div className="auto-cashout-row">
            <label className="auto-label">Cash out at</label>
            <input
              type="number"
              className="auto-cashout-input"
              value={autoCashoutTarget}
              onChange={handleAutoCashoutChange}
              min={1.01}
              step={0.1}
            />
            <span className="auto-suffix">x</span>
            <button
              className={`auto-bet-toggle ${autoBetEnabled ? 'active' : ''}`}
              onClick={handleAutoBetToggle}
            >
              {autoBetEnabled ? 'Auto ON' : 'Auto OFF'}
            </button>
          </div>
        )}

        <div className="bet-amount-group">
          <div className="bet-amount-stepper">
            <button
              className="stepper-btn"
              onClick={() => { playClick?.(); setBetAmount(Math.max(0, betAmount - 1)); }}
              disabled={!canBet && currentState !== GameState.LOBBY}
            >
              -
            </button>
            <input
              type="number"
              className="bet-amount-input"
              value={betAmount}
              onChange={handleAmountChange}
              min={0}
              max={balance}
              step={1}
              disabled={!canBet && currentState !== GameState.LOBBY}
            />
            <button
              className="stepper-btn"
              onClick={() => { playClick?.(); setBetAmount(betAmount + 1); }}
              disabled={!canBet && currentState !== GameState.LOBBY}
            >
              +
            </button>
          </div>
          <div className="bet-quick-btns">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                className={`bet-quick-btn ${betAmount === amt ? 'active' : ''}`}
                onClick={() => handleQuickAmount(amt)}
                disabled={!canBet && currentState !== GameState.LOBBY}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {canCashout ? (
          <button className="bet-action-btn cashout" onClick={handleCashout}>
            CASHOUT
            {cashoutValue && <span className="cashout-value">${(activeBet * multiplier).toFixed(2)}</span>}
          </button>
        ) : isWaiting ? (
          <button className="bet-action-btn waiting" disabled>
            CASHED OUT
          </button>
        ) : (
          <button
            className="bet-action-btn bet"
            onClick={handleBet}
            disabled={!canBet || betAmount <= 0 || betAmount > balance}
          >
            BET ${betAmount}
          </button>
        )}
      </div>
    </div>
  );
}
