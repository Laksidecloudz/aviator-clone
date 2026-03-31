# Aviator Clone

A single-page clone of the Spribe Aviator crash game built with React 19, Vite, and HTML5 Canvas.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
npx knip          # Find unused deps/exports
npx jscpd src/    # Detect code duplication
sg -p 'pattern' src/  # AST-aware search
```

## Architecture

```
src/
├── audio/              # Procedural sound synthesis (Web Audio API)
│   └── SoundEngine.js  # Tick, flight, cashout, crash sounds
├── components/         # React UI components
│   ├── App.jsx         # Root: sidebar layout + game container
│   ├── BalanceDisplay.jsx
│   ├── BetPanel.jsx    # Dual bet panel (1 or 2 slots)
│   ├── BetTable.jsx    # All Bets / Previous / Top leaderboard
│   ├── CashoutOverlay.jsx
│   ├── FairModal.jsx   # Seed verification modal
│   ├── GameCanvas.jsx  # Canvas mount, engine tick subscription
│   ├── GameHistory.jsx # Crash history pills (top bar)
│   ├── MultiplierDisplay.jsx
│   ├── ProvablyFairModal.jsx
│   ├── SettingsMenu.jsx # Hamburger settings panel
│   └── SponsorBanner.jsx
├── engine/             # Game logic layer
│   ├── GameEngine.js   # FSM (LOBBY→BETTING→FLYING→CRASHED), event bus
│   └── GameStates.js   # State enum, transition validation
├── game/               # Core algorithms
│   ├── CrashAlgorithm.js  # Provably-fair crash point + multiplier curve
│   ├── FlightPath.js      # Camera system, coordinate mapping
│   └── ProvablyFair.js    # Seed generation utilities
├── hooks/              # React hooks
│   ├── useEngineSync.js   # Engine events → React state bridge
│   ├── useGameEngine.js   # Singleton engine via useState
│   └── useSoundEngine.js  # Sound events subscription
├── renderer/           # Canvas rendering (60fps, decoupled from React)
│   ├── BackgroundRenderer.js  # Gradient + sunburst rays
│   ├── CanvasRenderer.js      # Orchestrator: grid → curve → plane → particles
│   ├── CurveRenderer.js       # Glow curve + gradient fill
│   ├── ParticlePool.js        # Fixed 200-particle pool (zero GC)
│   └── effects.js             # Easing, screen shake, color utils
├── App.jsx             # Root component
├── index.css           # All styles (consolidated)
└── main.jsx            # Entry point
```

## Core Game Logic

### Crash Formula

```
crashPoint = 0.99 / (1 - h)
```

Where `h` is a pseudo-random value in `[0, 1)`. The `0.99` factor encodes a 1% house edge.

- **1% of rounds** crash instantly at `1.00x` (insta-crash)
- **~50% of rounds** crash below `2x`
- **~90% of rounds** crash below `10x`

### Multiplier Curve

```
multiplier(t) = 1 + (crashMultiplier - 1) * (1 - e^(-k * t))
```

Rate constant: `k = ln(crashMultiplier) / 12`

### State Machine

```
LOBBY → BETTING (5s) → FLYING (variable) → CRASHED (2s) → LOBBY
```

### Provably Fair

Client seed + server seed → SHA512 hash → crash point. Server seed hash is published before each round. The `FairModal` component demonstrates verification using `generateCrashPointFromHash()`.

## Rendering Architecture

Canvas rendering is **decoupled from React**. The `GameCanvas` component subscribes directly to the engine's `tick` event and renders at 60fps independently. React UI (buttons, labels) updates are throttled to 10fps.

Key optimizations:
- **Offscreen canvas** for gradient background (cached on resize)
- **Float32Array** path buffer for curve (zero GC)
- **Fixed particle pool** (200 particles, no allocation after init)
- **Pre-allocated emit payloads** for tick/multiplier events

## Features

| Feature | Description |
|---------|-------------|
| Dual bet panels | Two independent bet slots with separate cash-outs |
| Auto-cashout | Set target multiplier, auto-cash at that point |
| Auto-bet | Automatically places bet on next round |
| Camera follow | Plane stays at 65% screen width during long flights |
| Provably fair | SHA-256 seed commitment + verification modal |
| Crash history | Color-coded pills: red (<2x), yellow (2-10x), green (>10x) |
| Bet leaderboard | All Bets / Previous / Top with player cards |
| Sound design | Procedural Web Audio API (tick, flight, cashout, crash) |
| Settings menu | Sound/music/animation toggles, links |
| Sponsor banner | WorldStar Betting LOBBY overlay |
| Mute toggle | Audio on/off |
| Responsive | Desktop sidebar layout, mobile stacking, 44px touch targets |

## Code Quality Tools

| Tool | Purpose | Command |
|------|---------|---------|
| ESLint | Lint + React 19 purity rules | `npm run lint` |
| jscpd | Code duplication detection | `npx jscpd src/` |
| ast-grep | AST-aware code search | `sg -p 'pattern' src/` |
| Knip | Unused deps/exports | `npx knip` |

## Research

The `Research/` directory contains analysis documents covering:
- Game mechanics and crash formula derivation
- Behavioral psychology (illusion of control, variable ratio reinforcement, loss aversion)
- Color psychology (purple/blue trust, red arousal, green success)
- Sound design architecture
- Mobile-first design patterns
- Provably fair cryptographic systems

Implementation decisions are cross-referenced against these findings.

## License

MIT
