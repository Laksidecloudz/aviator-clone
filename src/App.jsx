import { useGameEngine } from './hooks/useGameEngine.js';
import { useEngineSync } from './hooks/useEngineSync.js';
import { useSoundEngine } from './hooks/useSoundEngine.js';
import { GameCanvas } from './components/GameCanvas.jsx';
import { MultiplierDisplay } from './components/MultiplierDisplay.jsx';
import { BetPanel } from './components/BetPanel.jsx';
import { BetTable } from './components/BetTable.jsx';
import { GameHistory } from './components/GameHistory.jsx';
import { BalanceDisplay } from './components/BalanceDisplay.jsx';
import { CashoutOverlay } from './components/CashoutOverlay.jsx';
import { SettingsMenu } from './components/SettingsMenu.jsx';
import { ProvablyFairModal } from './components/ProvablyFairModal.jsx';
import { SponsorBanner } from './components/SponsorBanner.jsx';
import { WelcomeModal } from './components/WelcomeModal.jsx';
import { RainPromo } from './components/RainPromo.jsx';
import { ChatPanel } from './components/ChatPanel.jsx';
import { useState, useEffect, useCallback } from 'react';
import { GameState } from './engine/GameStates.js';
import { generateClientSeed, generateServerSeedHash } from './game/ProvablyFair.js';

function App() {
  const engine = useGameEngine();
  const gameState = useEngineSync(engine);
  const { playClick, toggleMute, sound } = useSoundEngine(engine);
  const [playerCount, setPlayerCount] = useState(() => 300 + Math.floor(Math.random() * 500));
  const [showMenu, setShowMenu] = useState(false);
  const [showFair, setShowFair] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem('aviator_age_confirmed');
  });
  const [showRealityCheck, setShowRealityCheck] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [sessionStats, setSessionStats] = useState({ bets: 0, wagered: 0, profit: 0 });
  const [clientSeed] = useState(() => generateClientSeed());
  const [serverSeedHash] = useState(() => generateServerSeedHash());

  const isLobby = gameState.currentState === GameState.LOBBY;

  const formatSessionTime = useCallback(() => {
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, [sessionStartTime]);

  const dismissRealityCheck = useCallback(() => {
    setShowRealityCheck(false);
    setSessionStartTime(Date.now());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount((prev) => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(200, Math.min(900, prev + delta));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStartTime;
      if (elapsed >= 30 * 60 * 1000 && !showRealityCheck && !showWelcome) {
        setShowRealityCheck(true);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionStartTime, showRealityCheck, showWelcome]);

  return (
    <div className="app-shell">
      {showWelcome && <WelcomeModal onAccept={() => setShowWelcome(false)} />}
      <div className="game-layout">
        <aside className="left-sidebar">
          <BetTable key={gameState.roundNumber} />
        </aside>

        <main className="main-area">
          <GameHistory crashHistory={gameState.crashHistory} />
          <div className="game-canvas-wrapper">
            <GameCanvas engine={engine} gameState={gameState} />
            <div className="game-overlay">
              <MultiplierDisplay gameState={gameState} />
              <BalanceDisplay
                balance={gameState.balance}
                lastWinAmount={gameState.lastWinAmount}
              />
              <button className="mute-btn" onClick={toggleMute}>
                {sound?.isMuted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
              </button>
              <button className="menu-btn" onClick={() => setShowMenu(true)}>
                {'\u2630'}
              </button>
              <button className="chat-toggle-btn" onClick={() => setShowChat(true)}>
                💬
              </button>
              <SponsorBanner visible={isLobby} />
              {isLobby && <RainPromo />}
              <div className="player-count-overlay">
                <div className="avatar-cluster">
                  <div className="avatar" style={{ background: '#8855ff' }} />
                  <div className="avatar" style={{ background: '#ff8800' }} />
                  <div className="avatar" style={{ background: '#00ff88' }} />
                </div>
                <span className="player-count">{playerCount}</span>
              </div>
            </div>
          </div>
          <div className="bet-panels-row">
            <BetPanel
              slot={1}
              gameState={gameState}
              placeBet={gameState.placeBet}
              cashout={gameState.cashout}
              playClick={playClick}
            />
            <BetPanel
              slot={2}
              gameState={gameState}
              placeBet={gameState.placeBet}
              cashout={gameState.cashout}
              playClick={playClick}
            />
          </div>
          <div className="footer-badges">
            <div className="provably-fair-badge" onClick={() => setShowFair(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span>Provably Fair</span>
            </div>
            <div className="powered-by-badge">
              <span>Powered by</span>
              <strong>WorldStar Betting</strong>
            </div>
          </div>
        </main>
      </div>

      <CashoutOverlay cashoutData={gameState.lastCashout} />
      <SettingsMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onOpenFair={() => { setShowMenu(false); setShowFair(true); }}
      />
      {showFair && (
        <ProvablyFairModal
          isOpen={showFair}
          onClose={() => setShowFair(false)}
          clientSeed={clientSeed}
          serverSeedHash={serverSeedHash}
        />
      )}
      <ChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />

      {showRealityCheck && (
        <div className="reality-check-backdrop">
          <div className="reality-check-modal">
            <div className="reality-check-icon">⏰</div>
            <div className="reality-check-title">Reality Check</div>
            <div className="reality-check-time">{formatSessionTime()}</div>
            <div className="reality-check-label">Session Duration</div>
            <div className="reality-check-stats">
              <div className="reality-stat">
                <div className="reality-stat-label">Total Bets</div>
                <div className="reality-stat-value">{sessionStats.bets}</div>
              </div>
              <div className="reality-stat">
                <div className="reality-stat-label">Total Wagered</div>
                <div className="reality-stat-value">${sessionStats.wagered.toFixed(2)}</div>
              </div>
              <div className="reality-stat">
                <div className="reality-stat-label">Net Profit</div>
                <div className={`reality-stat-value ${sessionStats.profit >= 0 ? 'profit' : 'loss'}`}>
                  ${sessionStats.profit >= 0 ? '+' : ''}{sessionStats.profit.toFixed(2)}
                </div>
              </div>
              <div className="reality-stat">
                <div className="reality-stat-label">Balance</div>
                <div className="reality-stat-value">${gameState.balance.toFixed(2)}</div>
              </div>
            </div>
            <div className="reality-check-message">
              You've been playing for {formatSessionTime()}. Take a moment to consider your gaming session. Remember to play responsibly.
            </div>
            <div className="reality-check-actions">
              <button className="reality-continue-btn" onClick={dismissRealityCheck}>
                Continue Playing
              </button>
              <button className="reality-break-btn" onClick={dismissRealityCheck}>
                Take a Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
