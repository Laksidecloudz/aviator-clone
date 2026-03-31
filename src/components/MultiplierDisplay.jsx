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

  const isHidden = currentState === GameState.LOBBY || currentState === GameState.BETTING;
  const showFlewAway = currentState === GameState.CRASHED;

  return (
    <div className={`multiplier-display ${isHidden ? 'hidden' : ''}`}>
      {showFlewAway && <div className="flew-away-text">FLEW AWAY!</div>}
      {displayText && (
        <div className={`multiplier-value ${showFlewAway ? 'crashed' : ''}`}>
          {displayText}
        </div>
      )}
    </div>
  );
}
