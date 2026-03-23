import { useState, useEffect } from 'react';
import { GameEngine } from '../engine/GameEngine.js';

export function useGameEngine(config) {
  const [engine] = useState(() => new GameEngine(config));

  useEffect(() => {
    engine.start();
    return () => engine.stop();
  }, [engine]);

  return engine;
}
