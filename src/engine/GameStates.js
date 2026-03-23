export const GameState = Object.freeze({
  LOBBY: 'LOBBY',
  BETTING: 'BETTING',
  FLYING: 'FLYING',
  CRASHED: 'CRASHED',
});

const VALID_TRANSITIONS = {
  [GameState.LOBBY]: [GameState.BETTING],
  [GameState.BETTING]: [GameState.FLYING],
  [GameState.FLYING]: [GameState.CRASHED],
  [GameState.CRASHED]: [GameState.LOBBY],
};

export function canTransition(from, to) {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export const StateDurations = {
  BETTING_PHASE_MS: 5000,
  CRASHED_PHASE_MS: 2000,
};
