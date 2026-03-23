import { useRef, useEffect } from 'react';
import { CanvasRenderer } from '../renderer/CanvasRenderer.js';

export function GameCanvas({ engine }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new CanvasRenderer(canvas);
    rendererRef.current = renderer;

    const container = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          renderer.resize(width, height);
        }
      }
    });
    observer.observe(container);

    const unsubscribeTick = engine.on('tick', ({ state, deltaTimeMs }) => {
      renderer.render(state, deltaTimeMs);
    });

    const unsubscribeCrash = engine.on('crash', ({ crashMultiplier }) => {
      const state = engine.getState();
      const pos = renderer.getFlightPath().getPlanePosition(
        state.currentFlightTimeMs,
        crashMultiplier
      );
      renderer.triggerCrashEffect(pos.x, pos.y);
    });

    return () => {
      unsubscribeTick();
      unsubscribeCrash();
      observer.disconnect();
    };
  }, [engine]);

  return (
    <div ref={containerRef} className="game-canvas-wrapper">
      <canvas ref={canvasRef} />
    </div>
  );
}
