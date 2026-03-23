export function ProvablyFairModal({ isOpen, onClose, serverSeedHash, clientSeed }) {
  if (!isOpen) return null;

  return (
    <div className="pf-modal-backdrop" onClick={onClose}>
      <div className="pf-modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="pf-modal-title">PROVABLY FAIR SETTINGS</h2>
        <p className="pf-modal-desc">
          This game uses Provably Fair technology to determine game result.
          The game result is calculated with the combination of server seed and 3 client seeds.
        </p>

        <div className="pf-section">
          <h3 className="pf-section-title">Client (your) seed:</h3>
          <div className="pf-seed-row">
            <span className="pf-seed-label">Random on every new game</span>
            <code className="pf-seed-value">{clientSeed}</code>
          </div>
        </div>

        <div className="pf-section">
          <h3 className="pf-section-title">Server seed SHA256:</h3>
          <code className="pf-seed-hash">{serverSeedHash}</code>
        </div>

        <div className="pf-info-box">
          <h4>How it works</h4>
          <ol className="pf-steps">
            <li>Server generates a random seed and shows its SHA256 hash</li>
            <li>Your client seed is combined with the server seed</li>
            <li>SHA512 hash of the combined seeds determines the game result</li>
            <li>After the round, the server seed is revealed for verification</li>
          </ol>
        </div>

        <button className="pf-modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
