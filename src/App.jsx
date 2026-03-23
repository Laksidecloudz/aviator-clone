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
import { useState, useEffect } from 'react';
import { GameState } from './engine/GameStates.js';
import { generateClientSeed, generateServerSeedHash } from './game/ProvablyFair.js';

function App() {
  const engine = useGameEngine();
  const gameState = useEngineSync(engine);
  const { playClick, toggleMute, sound } = useSoundEngine(engine);
  const [playerCount, setPlayerCount] = useState(() => 300 + Math.floor(Math.random() * 500));
  const [showMenu, setShowMenu] = useState(false);
  const [showFair, setShowFair] = useState(false);
  const [clientSeed] = useState(() => generateClientSeed());
  const [serverSeedHash] = useState(() => generateServerSeedHash());

  const isLobby = gameState.currentState === GameState.LOBBY;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount((prev) => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(200, Math.min(900, prev + delta));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-shell">
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
              <SponsorBanner visible={isLobby} />
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
    </div>
  );
}

export default App;
