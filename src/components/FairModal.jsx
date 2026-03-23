import { useState } from 'react';
import { generateCrashPointFromHash } from '../game/CrashAlgorithm.js';

export function FairModal({ onClose }) {
  const [seed, setSeed] = useState('');
  const [result, setResult] = useState(null);

  const handleVerify = () => {
    const hashVal = parseInt(seed, 16) || seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const crash = generateCrashPointFromHash(hashVal);
    setResult(crash);
  };

  return (
    <div className="fair-modal-overlay" onClick={onClose}>
      <div className="fair-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="fair-modal-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          <span>Provably Fair Verification</span>
        </div>
        <p className="fair-modal-desc">
          Each round is determined by a server seed hash combined with a client seed.
          Enter any seed value below to verify the crash point calculation.
        </p>
        <div className="fair-modal-input-group">
          <input
            type="text"
            className="fair-modal-input"
            placeholder="Enter seed (hex or text)"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
          <button className="fair-modal-btn" onClick={handleVerify}>
            Verify
          </button>
        </div>
        {result !== null && (
          <div className="fair-modal-result">
            <span className="fair-result-label">Crash Point</span>
            <span className="fair-result-value">{result.toFixed(2)}x</span>
          </div>
        )}
        <button className="fair-modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
