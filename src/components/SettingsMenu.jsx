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
const X_ICON = '\u2715';
const DROP_ICON = '\uD83D\uDCA7';
const TROPHY_ICON = '\uD83C\uDFC6';

// Mock bet history data
const MOCK_BET_HISTORY = [
  { id: 1, round: 156, bet: 10.00, multiplier: 2.45, win: 24.50, status: 'cashed', date: '14:32:15' },
  { id: 2, round: 155, bet: 25.00, multiplier: 1.00, win: 0, status: 'crashed', date: '14:31:42' },
  { id: 3, round: 154, bet: 5.00, multiplier: 5.82, win: 29.10, status: 'cashed', date: '14:30:18' },
  { id: 4, round: 153, bet: 50.00, multiplier: 1.23, win: 61.50, status: 'cashed', date: '14:28:55' },
  { id: 5, round: 152, bet: 10.00, multiplier: 1.00, win: 0, status: 'crashed', date: '14:27:30' },
  { id: 6, round: 151, bet: 20.00, multiplier: 3.15, win: 63.00, status: 'cashed', date: '14:26:05' },
  { id: 7, round: 150, bet: 15.00, multiplier: 1.87, win: 28.05, status: 'cashed', date: '14:24:42' },
  { id: 8, round: 149, bet: 100.00, multiplier: 1.12, win: 112.00, status: 'cashed', date: '14:23:18' },
  { id: 9, round: 148, bet: 10.00, multiplier: 7.45, win: 74.50, status: 'cashed', date: '14:21:55' },
  { id: 10, round: 147, bet: 5.00, multiplier: 1.00, win: 0, status: 'crashed', date: '14:20:30' },
];

// Mock free bets / rain data
const MOCK_FREE_BETS = [
  { id: 1, amount: 2.50, expires: '5 min', claimable: true },
  { id: 2, amount: 1.00, expires: '12 min', claimable: true },
  { id: 3, amount: 5.00, expires: '25 min', claimable: true },
  { id: 4, amount: 0.50, expires: '45 min', claimable: false },
];

// Mock top winners
const MOCK_TOP_WINNERS = [
  { id: 1, name: 'p***7', win: 15420.00, multiplier: '128.50x', date: 'Today' },
  { id: 2, name: 'm***2', win: 8750.00, multiplier: '87.50x', date: 'Today' },
  { id: 3, name: 'k***9', win: 5230.50, multiplier: '52.31x', date: 'Yesterday' },
  { id: 4, name: 's***4', win: 3150.00, multiplier: '45.00x', date: 'Yesterday' },
  { id: 5, name: 'd***1', win: 2840.00, multiplier: '28.40x', date: '2 days ago' },
];

export function SettingsMenu({ isOpen, onClose, onOpenFair }) {
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [playerName] = useState(() => 'demo_' + Math.random().toString(36).slice(2, 7));
  const [activeModal, setActiveModal] = useState(null);
  const [freeBets, setFreeBets] = useState(MOCK_FREE_BETS);
  const [avatarColor] = useState(() => {
    const colors = ['#8855ff', '#ff8800', '#00ff88', '#ff3366', '#00bcd4'];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  const claimFreeBet = (id) => {
    setFreeBets(prev => prev.map(bet => 
      bet.id === id ? { ...bet, claimable: false, amount: 0 } : bet
    ));
  };

  const closeModal = () => setActiveModal(null);

  if (!isOpen) return null;

  const renderModal = () => {
    switch (activeModal) {
      case 'history':
        return (
          <div className="modal-content">
            <div className="modal-header">
              <h3>My Bet History</h3>
              <button className="modal-close" onClick={closeModal}>{X_ICON}</button>
            </div>
            <div className="modal-body">
              <div className="history-stats">
                <div className="stat-box">
                  <span className="stat-label">Total Bets</span>
                  <span className="stat-value">{MOCK_BET_HISTORY.length}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Total Wagered</span>
                  <span className="stat-value">${MOCK_BET_HISTORY.reduce((sum, b) => sum + b.bet, 0).toFixed(2)}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Total Won</span>
                  <span className="stat-value profit">${MOCK_BET_HISTORY.reduce((sum, b) => sum + b.win, 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="history-list">
                {MOCK_BET_HISTORY.map(bet => (
                  <div key={bet.id} className={`history-row ${bet.status}`}>
                    <span className="round-num">#{bet.round}</span>
                    <span className="bet-amount">${bet.bet.toFixed(2)}</span>
                    <span className={`multiplier ${bet.status}`}>{bet.multiplier.toFixed(2)}x</span>
                    <span className={`win-amount ${bet.status}`}>{bet.win > 0 ? `+$${bet.win.toFixed(2)}` : '-'}</span>
                    <span className="time">{bet.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'freebets':
        return (
          <div className="modal-content">
            <div className="modal-header">
              <h3>Free Bets & Rain</h3>
              <button className="modal-close" onClick={closeModal}>{X_ICON}</button>
            </div>
            <div className="modal-body">
              <div className="freebets-intro">
                <p>{DROP_ICON} Collect free bets from chat rain or promotional drops!</p>
              </div>
              <div className="freebets-list">
                {freeBets.map(bet => (
                  <div key={bet.id} className={`freebet-row ${bet.claimable ? '' : 'claimed'}`}>
                    <div className="freebet-info">
                      <span className="freebet-amount">${bet.amount.toFixed(2)}</span>
                      <span className="freebet-expire">Expires in {bet.expires}</span>
                    </div>
                    <button 
                      className={`claim-btn ${bet.claimable ? '' : 'disabled'}`}
                      onClick={() => bet.claimable && claimFreeBet(bet.id)}
                      disabled={!bet.claimable}
                    >
                      {bet.claimable ? 'Claim' : 'Claimed'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="freebets-footer">
                <p>Free bets are randomly dropped in chat. Stay active to catch them!</p>
              </div>
            </div>
          </div>
        );

      case 'limits':
        return (
          <div className="modal-content">
            <div className="modal-header">
              <h3>Game Limits</h3>
              <button className="modal-close" onClick={closeModal}>{X_ICON}</button>
            </div>
            <div className="modal-body">
              <div className="limits-section">
                <h4>Bet Limits</h4>
                <div className="limit-row">
                  <span>Minimum Bet</span>
                  <span className="limit-value">$1.00</span>
                </div>
                <div className="limit-row">
                  <span>Maximum Bet</span>
                  <span className="limit-value">$100.00</span>
                </div>
                <div className="limit-row">
                  <span>Maximum Win</span>
                  <span className="limit-value">$10,000.00</span>
                </div>
              </div>
              <div className="limits-section">
                <h4>Auto Cash Out Limits</h4>
                <div className="limit-row">
                  <span>Minimum Multiplier</span>
                  <span className="limit-value">1.01x</span>
                </div>
                <div className="limit-row">
                  <span>Maximum Multiplier</span>
                  <span className="limit-value">100.00x</span>
                </div>
              </div>
              <div className="limits-section">
                <h4>Responsible Gaming</h4>
                <div className="limit-row clickable">
                  <span>Set Deposit Limit</span>
                  <span className="link">Configure</span>
                </div>
                <div className="limit-row clickable">
                  <span>Set Loss Limit</span>
                  <span className="link">Configure</span>
                </div>
                <div className="limit-row clickable">
                  <span>Self-Exclusion</span>
                  <span className="link">Options</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'howtoplay':
        return (
          <div className="modal-content">
            <div className="modal-header">
              <h3>How To Play</h3>
              <button className="modal-close" onClick={closeModal}>{X_ICON}</button>
            </div>
            <div className="modal-body how-to-play">
              <div className="step">
                <div className="step-num">1</div>
                <div className="step-content">
                  <h4>Place Your Bet</h4>
                  <p>Enter your bet amount and click "BET" before the round starts. You can place up to 2 bets per round.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <div className="step-content">
                  <h4>Watch the Multiplier Rise</h4>
                  <p>The plane takes off and the multiplier increases. The higher it goes, the more you can win!</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <div className="step-content">
                  <h4>Cash Out Before It Flies Away</h4>
                  <p>Click "CASH OUT" anytime before the plane flies away to secure your winnings at the current multiplier.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-num">4</div>
                <div className="step-content">
                  <h4>Don't Wait Too Long!</h4>
                  <p>If the plane flies away before you cash out, you lose your bet. Timing is everything!</p>
                </div>
              </div>
              <div className="tip-box">
                <strong>Tip:</strong> You can set an auto cash out multiplier in the "Auto" tab to automatically cash out at your target!
              </div>
            </div>
          </div>
        );

      case 'rules':
        return (
          <div className="modal-content">
            <div className="modal-header">
              <h3>Game Rules</h3>
              <button className="modal-close" onClick={closeModal}>{X_ICON}</button>
            </div>
            <div className="modal-body rules">
              <section>
                <h4>Basic Rules</h4>
                <ul>
                  <li>Each round, a plane takes off with a multiplier starting at 1.00x</li>
                  <li>The multiplier increases until the plane randomly flies away</li>
                  <li>You must cash out before the plane flies away to win</li>
                  <li>If you don't cash out before the crash, you lose your bet</li>
                </ul>
              </section>
              <section>
                <h4>Multipliers</h4>
                <ul>
                  <li>Minimum multiplier: 1.00x (instant crash)</li>
                  <li>Maximum multiplier: 100,000x (theoretical)</li>
                  <li>Crash points are determined by a provably fair algorithm</li>
                </ul>
              </section>
              <section>
                <h4>Payouts</h4>
                <ul>
                  <li>Your winnings = Bet Amount x Cash Out Multiplier</li>
                  <li>Example: $10 bet at 2.50x = $25 win</li>
                  <li>House edge: 1% (99% RTP)</li>
                </ul>
              </section>
              <section>
                <h4>Auto Features</h4>
                <ul>
                  <li><strong>Auto Bet:</strong> Automatically place bets each round</li>
                  <li><strong>Auto Cash Out:</strong> Automatically cash out at your target multiplier</li>
                </ul>
              </section>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div className="settings-menu">
        <div className="menu-header">
          <div className="player-info">
            <div className="player-avatar" style={{ background: avatarColor }}>
              <span className="avatar-initial">{playerName[0].toUpperCase()}</span>
            </div>
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

          <div className="menu-item" onClick={() => setActiveModal('freebets')}>
            <span className="menu-icon">{STAR_ICON}</span>
            <span>Free Bets</span>
            <span className="menu-badge">{freeBets.filter(b => b.claimable).length}</span>
          </div>
          <div className="menu-item" onClick={() => setActiveModal('history')}>
            <span className="menu-icon">{CLIPBOARD_ICON}</span>
            <span>My Bet History</span>
          </div>
          <div className="menu-item" onClick={() => setActiveModal('limits')}>
            <span className="menu-icon">{MONEY_ICON}</span>
            <span>Game Limits</span>
          </div>

          <div className="menu-divider" />

          <div className="menu-item" onClick={() => setActiveModal('howtoplay')}>
            <span className="menu-icon">{QUESTION_ICON}</span>
            <span>How To Play</span>
          </div>
          <div className="menu-item" onClick={() => setActiveModal('rules')}>
            <span className="menu-icon">{SCROLL_ICON}</span>
            <span>Game Rules</span>
          </div>
          <div className="menu-item" onClick={onOpenFair}>
            <span className="menu-icon">{SHIELD_ICON}</span>
            <span>Provably Fair Settings</span>
          </div>

          <div className="menu-divider" />

          <div className="menu-item" onClick={onClose}>
            <span className="menu-icon">{HOME_ICON}</span>
            <span>Back to Game</span>
          </div>
        </div>

        <div className="menu-footer">
          <span>WorldStar Betting v1.0.0</span>
        </div>
      </div>

      {activeModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            {renderModal()}
          </div>
        </div>
      )}
    </>
  );
}
