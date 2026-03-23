import { useMemo } from 'react';
import { GameState } from '../engine/GameStates.js';
import { formatMultiplier } from '../game/CrashAlgorithm.js';

export function MultiplierDisplay({ gameState }) {
  const { currentState, multiplier, crashMultiplier } = gameState;

  const displayText = useMemo(() => {
    if (currentState === GameState.CRASHED) {
      return formatMultiplier(crashMultiplier);
    }
    if (currentState === GameState.FLYING) {
      return formatMultiplier(multiplier);
    }
    return null;
  }, [currentState, multiplier, crashMultiplier]);

  const stateLabel = useMemo(() => {
    switch (currentState) {
      case GameState.LOBBY: return '';
      case GameState.BETTING: {
        const secs = Math.ceil(gameState.countdownRemainingMs / 1000);
        return `Place your bets... ${secs}s`;
      }
      case GameState.FLYING: return '';
      default: return '';
    }
  }, [currentState, gameState.countdownRemainingMs]);

  const isHidden = currentState === GameState.LOBBY;
  const showFlewAway = currentState === GameState.CRASHED;

  return (
    <div className={`multiplier-display ${isHidden ? 'hidden' : ''}`}>
      {showFlewAway && <div className="flew-away-text">FLEW AWAY!</div>}
      {displayText && (
        <div className={`multiplier-value ${currentState === GameState.CRASHED ? 'crashed' : ''}`}>
          {displayText}
        </div>
      )}
      {stateLabel && currentState === GameState.BETTING && (
        <div className="state-label betting">
          {stateLabel}
        </div>
      )}
    </div>
  );
}
