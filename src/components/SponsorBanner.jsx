import { PropellerIcon } from './PropellerIcon.jsx';

export function SponsorBanner({ visible }) {
  if (!visible) return null;
  return (
    <div className="sponsor-banner">
      <div className="sponsor-content">
        <h1 className="sponsor-title">
          <span className="sponsor-logo">
            <PropellerIcon width={48} height={48} />
            <span className="sponsor-main">aviator</span>
          </span>
        </h1>
        <p className="sponsor-subtitle">WORLDSTAR BETTING IS OFFICIAL PARTNER</p>
      </div>
    </div>
  );
}
