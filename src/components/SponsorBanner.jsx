export function SponsorBanner({ visible }) {
  if (!visible) return null;
  return (
    <div className="sponsor-banner">
      <div className="sponsor-content">
        <h1 className="sponsor-title">
          <span className="sponsor-logo">
            <svg className="propeller-icon" viewBox="0 0 64 64" width="48" height="48">
              <ellipse cx="32" cy="32" rx="28" ry="8" fill="currentColor" opacity="0.3" transform="rotate(-30 32 32)" />
              <ellipse cx="32" cy="32" rx="28" ry="8" fill="currentColor" opacity="0.3" transform="rotate(30 32 32)" />
              <ellipse cx="32" cy="32" rx="28" ry="8" fill="currentColor" opacity="0.3" />
              <circle cx="32" cy="32" r="6" fill="currentColor" />
            </svg>
            <span className="sponsor-main">aviator</span>
          </span>
        </h1>
        <p className="sponsor-subtitle">WORLDSTAR BETTING IS OFFICIAL PARTNER</p>
      </div>
    </div>
  );
}
