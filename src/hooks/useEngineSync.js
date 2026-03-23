import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../engine/GameStates.js';

export function useEngineSync(engine) {
  const [gameState, setGameState] = useState(() => engine.getState());
  const [lastCashout, setLastCashout] = useState(null);
  const lastUIUpdateRef = useRef(0);
  const cashoutTimerRef = useRef(null);

  useEffect(() => {
    const unsubscribers = [];

    unsubscribers.push(engine.on('stateChange', () => {
      setGameState({ ...engine.getState() });
    }));

    unsubscribers.push(engine.on('crash', () => {
      setGameState({ ...engine.getState() });
    }));

    unsubscribers.push(engine.on('betPlaced', () => {
      setGameState({ ...engine.getState() });
    }));

    unsubscribers.push(engine.on('cashout', (data) => {
      setGameState({ ...engine.getState() });
      const overlay = { multiplier: data.multiplier, amount: data.amount, slot: data.slot };
      setLastCashout(overlay);
      clearTimeout(cashoutTimerRef.current);
      cashoutTimerRef.current = setTimeout(() => {
        setLastCashout(prev => prev === overlay ? null : prev);
      }, 3000);
    }));

    unsubscribers.push(engine.on('tick', () => {
      const now = performance.now();
      if (now - lastUIUpdateRef.current < 100) return;
      lastUIUpdateRef.current = now;

      const s = engine.getState();
      setGameState(prev => {
        if (prev.currentState === GameState.FLYING || prev.currentState === GameState.BETTING) {
          return {
            ...prev,
            multiplier: s.multiplier,
            currentFlightTimeMs: s.currentFlightTimeMs,
            countdownRemainingMs: s.countdownRemainingMs,
            hasBet: s.hasBet,
            hasBet2: s.hasBet2,
            isCashedOut: s.isCashedOut,
            isCashedOut2: s.isCashedOut2,
            betAmount: s.betAmount,
            betAmount2: s.betAmount2,
            cashoutMultiplier: s.cashoutMultiplier,
            cashoutMultiplier2: s.cashoutMultiplier2,
            cashoutAmount: s.cashoutAmount,
            cashoutAmount2: s.cashoutAmount2,
            balance: s.balance,
            lastWinAmount: s.lastWinAmount,
          };
        }
        if (prev.currentState === GameState.CRASHED) {
          return {
            ...prev,
            countdownRemainingMs: s.countdownRemainingMs,
          };
        }
        return prev;
      });
    }));

    return () => {
      for (const unsub of unsubscribers) unsub();
    };
  }, [engine]);

  const placeBet = useCallback((amount, slot) => {
    engine.placeBet(amount, slot);
  }, [engine]);

  const cashout = useCallback((slot) => {
    engine.cashout(slot);
  }, [engine]);

  const setAutoCashout = useCallback((enabled, target, slot) => {
    engine.setAutoCashout(enabled, target, slot);
  }, [engine]);

  return {
    ...gameState,
    placeBet,
    cashout,
    setAutoCashout,
    lastCashout,
    clearCashoutOverlay: () => setLastCashout(null),
  };
}
