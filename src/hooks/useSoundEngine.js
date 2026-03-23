import { useState, useEffect, useCallback, useRef } from 'react';
import { SoundEngine } from '../audio/SoundEngine.js';
import { GameState } from '../engine/GameStates.js';

const TICK_INTERVAL_MS = 500;

export function useSoundEngine(engine) {
  const [sound] = useState(() => new SoundEngine());
  const lastTickTimeRef = useRef(0);

  useEffect(() => {
    const unsubs = [];

    unsubs.push(engine.on('tick', ({ state }) => {
      if (state.currentState === GameState.FLYING) {
        sound.updateMultiplier(state.multiplier);
      }
      if (state.currentState === GameState.BETTING) {
        const now = performance.now();
        if (now - lastTickTimeRef.current >= TICK_INTERVAL_MS) {
          lastTickTimeRef.current = now;
          sound.tick();
        }
      }
    }));

    unsubs.push(engine.on('flightStart', () => {
      sound.flightStart();
    }));

    unsubs.push(engine.on('cashout', () => {
      sound.cashout();
    }));

    unsubs.push(engine.on('crash', () => {
      sound.crash();
    }));

    return () => {
      for (const unsub of unsubs) unsub();
      sound.dispose();
    };
  }, [engine, sound]);

  const playClick = useCallback(() => {
    sound.buttonClick();
  }, [sound]);

  const toggleMute = useCallback(() => {
    return sound.toggleMute();
  }, [sound]);

  return { playClick, toggleMute, sound };
}
