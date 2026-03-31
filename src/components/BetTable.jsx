import { useState, useMemo } from 'react';

const MOCK_NAMES = ['m***8', 's***3', 'b***n', '2***1', 'k***5', 'j***0', 'r***7', 'a***2', 'p***9', 'd***4'];
const AVATAR_COLORS = ['#8855ff', '#ff8800', '#00ff88', '#ff3366', '#ffcc00', '#00bcd4', '#e91e63', '#4caf50'];

function generateBets() {
  const count = 15 + Math.floor(Math.random() * 20);
  return Array.from({ length: count }, (_, i) => {
    const cashed = Math.random() > 0.4;
    const mult = cashed ? (1 + Math.random() * 15).toFixed(2) : null;
    const amount = [10, 20, 50, 100, 200, 500][Math.floor(Math.random() * 6)];
    const roundMax = mult ? (parseFloat(mult) + Math.random() * 5).toFixed(2) : null;
    return {
      id: i,
      maskedName: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      amount,
      multiplier: mult,
      winAmount: mult ? (amount * parseFloat(mult)).toFixed(2) : '\u2014',
      status: cashed ? 'cashed' : 'crashed',
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      date: '23.03.26',
      resultMultiplier: mult ? parseFloat(mult) : 1.00,
      roundMax: roundMax ? parseFloat(roundMax) : parseFloat(mult || '1'),
      currency: 'USD',
    };
  });
}

function TopPlayerCard({ player }) {
  return (
    <div className="top-player-card">
      <div className="top-player-header">
        <div className="player-avatar-sm" style={{ background: player.avatarColor }} />
        <span className="player-name">{player.maskedName}</span>
        <span className="player-date">{player.date}</span>
      </div>
      <div className="top-player-stats">
        <div className="stat-row">
          <span className="stat-label">Bet {player.currency}</span>
          <span className="stat-value">{player.amount.toFixed(2)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Result</span>
          <span className="stat-value highlight">{player.resultMultiplier.toFixed(2)}x</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Win {player.currency}</span>
          <span className="stat-value highlight">{player.winAmount}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Round max</span>
          <span className="stat-value highlight">{player.roundMax.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  );
}

export function BetTable() {
  const [tab, setTab] = useState('all');
  const [bets] = useState(() => generateBets());
  const totalBets = 618;

  const filteredBets = useMemo(() => {
    if (tab === 'previous') {
      return bets.filter((b) => b.status === 'cashed');
    }
    if (tab === 'top') {
      return [...bets]
        .filter((b) => b.winAmount !== '\u2014')
        .sort((a, b) => parseFloat(b.winAmount) - parseFloat(a.winAmount))
        .slice(0, 10);
    }
    return bets;
  }, [bets, tab]);

  return (
    <div className="bet-table">
      <div className="player-count-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="player-count-icon">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        <span className="player-count-text">{bets.length}/{totalBets} Bets</span>
      </div>

      <div className="bet-table-tabs">
        <button className={`bet-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All Bets</button>
        <button className={`bet-tab ${tab === 'previous' ? 'active' : ''}`} onClick={() => setTab('previous')}>Previous</button>
        <button className={`bet-tab ${tab === 'top' ? 'active' : ''}`} onClick={() => setTab('top')}>Top</button>
      </div>

      {tab === 'top' ? (
        <div className="bet-table-body">
          {filteredBets.map((bet) => (
            <TopPlayerCard key={bet.id} player={bet} />
          ))}
        </div>
      ) : (
        <>
          <div className="bet-table-header">
            <span></span><span>BETS</span><span>PAYOUT</span><span>CASHED OUT</span>
          </div>
          <div className="bet-table-body">
            {filteredBets.map((bet) => (
              <div className={`bet-row ${bet.status}`} key={bet.id}>
                <span className="player-cell">
                  <span className="player-avatar-sm" style={{ background: bet.avatarColor, width: '24px', height: '24px' }} />
                  {bet.maskedName}
                </span>
                <span>{bet.amount.toFixed(2)} USD</span>
                <span className="multiplier-cell">{bet.multiplier ? `${bet.multiplier}x` : '\u2014'}</span>
                <span className="win-cell">{bet.multiplier ? `${bet.winAmount} USD` : '\u2014'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
