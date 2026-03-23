import { useState } from 'react';

const SOUND_ICON = '\uD83D\uDD0A';
const MUSIC_ICON = '\uD83C\uDFB5';
const SPARKLE_ICON = '\u2728';
const STAR_ICON = '\u2B50';
const CLIPBOARD_ICON = '\uD83D\uDCCB';
const MONEY_ICON = '\uD83D\uDCB0';
const QUESTION_ICON = '\u2753';
const SCROLL_ICON = '\uD83D\uDCDC';
const SHIELD_ICON = '\uD83D\uDEE1\uFE0F';
const HOME_ICON = '\uD83C\uDFE0';

export function SettingsMenu({ isOpen, onClose, onOpenFair }) {
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [playerName] = useState(() => 'demo_' + Math.random().toString(36).slice(2, 7));

  if (!isOpen) return null;

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div className="settings-menu">
        <div className="menu-header">
          <div className="player-info">
            <div className="player-avatar" />
            <div className="player-details">
              <span className="player-name">{playerName}</span>
              <button className="change-avatar-btn">Change Avatar</button>
            </div>
          </div>
        </div>

        <div className="menu-items">
          <div className="toggle-row">
            <span className="toggle-label">{SOUND_ICON} Sound</span>
            <button className={`toggle-switch ${sound ? 'on' : ''}`} onClick={() => setSound(!sound)}>
              <div className="toggle-knob" />
            </button>
          </div>
          <div className="toggle-row">
            <span className="toggle-label">{MUSIC_ICON} Music</span>
            <button className={`toggle-switch ${music ? 'on' : ''}`} onClick={() => setMusic(!music)}>
              <div className="toggle-knob" />
            </button>
          </div>
          <div className="toggle-row">
            <span className="toggle-label">{SPARKLE_ICON} Animation</span>
            <button className={`toggle-switch ${animation ? 'on' : ''}`} onClick={() => setAnimation(!animation)}>
              <div className="toggle-knob" />
            </button>
          </div>

          <div className="menu-divider" />

          <div className="menu-item">
            <span className="menu-icon">{STAR_ICON}</span>
            <span>Free Bets</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">{CLIPBOARD_ICON}</span>
            <span>My Bet History</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">{MONEY_ICON}</span>
            <span>Game Limits</span>
          </div>

          <div className="menu-divider" />

          <div className="menu-item">
            <span className="menu-icon">{QUESTION_ICON}</span>
            <span>How To Play</span>
          </div>
          <div className="menu-item">
            <span className="menu-icon">{SCROLL_ICON}</span>
            <span>Game Rules</span>
          </div>
          <div className="menu-item" onClick={onOpenFair}>
            <span className="menu-icon">{SHIELD_ICON}</span>
            <span>Provably Fair Settings</span>
          </div>

          <div className="menu-divider" />

          <div className="menu-item">
            <span className="menu-icon">{HOME_ICON}</span>
            <span>Home</span>
          </div>
        </div>
      </div>
    </>
  );
}
