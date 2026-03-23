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
            <span>Player</span><span>Bet</span><span>X</span><span>Win</span>
          </div>
          <div className="bet-table-body">
            {filteredBets.map((bet) => (
              <div className={`bet-row ${bet.status}`} key={bet.id}>
                <span className="player-cell">{bet.maskedName}</span>
                <span>{bet.amount.toFixed(2)}</span>
                <span className="multiplier-cell">{bet.multiplier ? `${bet.multiplier}x` : '\u2014'}</span>
                <span className="win-cell">{bet.winAmount}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
