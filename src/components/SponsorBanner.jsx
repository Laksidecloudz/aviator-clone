export function SponsorBanner({ visible }) {
  if (!visible) return null;
  return (
    <div className="sponsor-banner">
      <div className="sponsor-content">
        <h1 className="sponsor-title">
          <span className="sponsor-main">WorldStar Betting</span>
          <span className="sponsor-divider">|</span>
          <span className="sponsor-game">Aviator</span>
        </h1>
        <p className="sponsor-subtitle">OFFICIAL PARTNER</p>
        <div className="sponsor-badge">
          <span className="badge-text">WSB</span>
          <span className="badge-label">Official Game</span>
          <span className="badge-year">Since 2026</span>
        </div>
      </div>
    </div>
  );
}
