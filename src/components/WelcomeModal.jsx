import { useState } from 'react';
import { PropellerIcon } from './PropellerIcon.jsx';

const WARNING_ICON = '\u26A0\uFE0F';
const SHIELD_ICON = '\uD83D\uDEE1\uFE0F';
const EIGHTEEN_ICON = '18+';

export function WelcomeModal({ onAccept }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      sessionStorage.setItem('aviator_age_confirmed', 'true');
      onAccept();
    }
  };

  return (
    <div className="welcome-backdrop">
      <div className="welcome-modal">
        <div className="welcome-logo">
          <PropellerIcon width={64} height={64} className="welcome-propeller" />
          <h1 className="welcome-title">aviator</h1>
        </div>

        <div className="welcome-warning">
          <span className="warning-icon">{WARNING_ICON}</span>
          <h2>Important Notice</h2>
        </div>

        <div className="welcome-content">
          <div className="warning-box">
            <p><strong>{WARNING_ICON} Gambling Warning</strong></p>
            <p>This game involves real money gambling. You may lose money. Only gamble what you can afford to lose.</p>
          </div>

          <div className="responsible-box">
            <p><strong>{SHIELD_ICON} Play Responsibly</strong></p>
            <ul>
              <li>Set limits before you play</li>
              <li>Don't chase your losses</li>
              <li>Gambling should be entertainment, not a way to make money</li>
              <li>Take regular breaks</li>
            </ul>
          </div>

          <div className="help-links">
            <p>Need help? Visit <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer">BeGambleAware.org</a></p>
          </div>
        </div>

        <div className="age-confirmation">
          <label className={`checkbox-label ${isChecked ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <span className="checkbox-custom" />
            <span className="checkbox-text">
              <span className="age-badge">{EIGHTEEN_ICON}</span>
              I confirm that I am 18 years of age or older
            </span>
          </label>
        </div>

        <button
          className={`welcome-confirm-btn ${isChecked ? '' : 'disabled'}`}
          onClick={handleConfirm}
          disabled={!isChecked}
        >
          Enter Game
        </button>

        <div className="welcome-footer">
          <span>WorldStar Betting</span>
          <span className="footer-dot">·</span>
          <span>Play Safe</span>
        </div>
      </div>
    </div>
  );
}
