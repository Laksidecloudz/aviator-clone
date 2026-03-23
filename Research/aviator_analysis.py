from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('Calibri', '/usr/share/fonts/truetype/english/calibri-regular.ttf'))

# Register font families to enable bold tags
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')
registerFontFamily('Calibri', normal='Calibri', bold='Calibri')

# Create document
output_path = "/home/z/my-project/download/Aviator_Game_Deep_Analysis.pdf"
doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    rightMargin=72,
    leftMargin=72,
    topMargin=72,
    bottomMargin=72,
    title="Aviator_Game_Deep_Analysis",
    author='Z.ai',
    creator='Z.ai',
    subject='Technical and Psychological Analysis of Aviator Crash Game'
)

# Define styles
styles = getSampleStyleSheet()

# Cover title style
cover_title_style = ParagraphStyle(
    name='CoverTitle',
    fontName='Times New Roman',
    fontSize=36,
    leading=44,
    alignment=TA_CENTER,
    spaceAfter=36
)

# Cover subtitle style
cover_subtitle_style = ParagraphStyle(
    name='CoverSubtitle',
    fontName='Times New Roman',
    fontSize=18,
    leading=24,
    alignment=TA_CENTER,
    spaceAfter=48
)

# Cover author style
cover_author_style = ParagraphStyle(
    name='CoverAuthor',
    fontName='Times New Roman',
    fontSize=14,
    leading=20,
    alignment=TA_CENTER,
    spaceAfter=18
)

# H1 style
h1_style = ParagraphStyle(
    name='H1Style',
    fontName='Times New Roman',
    fontSize=18,
    leading=24,
    alignment=TA_LEFT,
    spaceBefore=24,
    spaceAfter=12,
    textColor=colors.HexColor('#1a1a1a')
)

# H2 style
h2_style = ParagraphStyle(
    name='H2Style',
    fontName='Times New Roman',
    fontSize=14,
    leading=18,
    alignment=TA_LEFT,
    spaceBefore=18,
    spaceAfter=8,
    textColor=colors.HexColor('#2a2a2a')
)

# H3 style
h3_style = ParagraphStyle(
    name='H3Style',
    fontName='Times New Roman',
    fontSize=12,
    leading=16,
    alignment=TA_LEFT,
    spaceBefore=12,
    spaceAfter=6,
    textColor=colors.HexColor('#3a3a3a')
)

# Body style
body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceBefore=0,
    spaceAfter=8
)

# Bullet style
bullet_style = ParagraphStyle(
    name='BulletStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_LEFT,
    spaceBefore=2,
    spaceAfter=2,
    leftIndent=20,
    bulletIndent=10
)

# Table header style
header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=11,
    textColor=colors.white,
    alignment=TA_CENTER
)

# Table cell style
cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=10,
    textColor=colors.black,
    alignment=TA_LEFT
)

# Build story
story = []

# ============== COVER PAGE ==============
story.append(Spacer(1, 120))
story.append(Paragraph("<b>Aviator Crash Game</b>", cover_title_style))
story.append(Spacer(1, 24))
story.append(Paragraph("<b>Technical Architecture, Mathematical Framework,<br/>and Behavioral Psychology Analysis</b>", cover_subtitle_style))
story.append(Spacer(1, 48))
story.append(Paragraph("A Comprehensive Deep-Dive for Game Developers", cover_author_style))
story.append(Spacer(1, 24))
story.append(Paragraph("Prepared by: Senior iGaming Systems Architect<br/>&amp; Behavioral Game Design Expert", cover_author_style))
story.append(Spacer(1, 60))
story.append(Paragraph("March 2026", cover_author_style))
story.append(PageBreak())

# ============== TABLE OF CONTENTS ==============
story.append(Paragraph("<b>Table of Contents</b>", h1_style))
story.append(Spacer(1, 18))

toc_data = [
    ["1.", "Core Game Logic & Technical Design", "3"],
    ["", "1.1 The Game Loop: Round Phases", "3"],
    ["", "1.2 State Management & Synchronization", "4"],
    ["", "1.3 Performance & Rendering Techniques", "6"],
    ["2.", "Algorithms & The Math (Provably Fair RNG)", "7"],
    ["", "2.1 Provably Fair System Architecture", "7"],
    ["", "2.2 The Crash Formula", "9"],
    ["", "2.3 House Edge Implementation", "11"],
    ["3.", "Technical Tricks & Difficulty Mechanics", "12"],
    ["", "3.1 Exponential Growth vs. Human Reaction Time", "12"],
    ["", "3.2 Volatility & Variance Model", "14"],
    ["4.", "Behavioral Game Design & Psychology", "15"],
    ["", "4.1 Illusion of Control", "15"],
    ["", "4.2 Variable Ratio Reinforcement", "17"],
    ["", "4.3 FOMO & Social Proof", "18"],
    ["", "4.4 Loss Aversion & Near Misses", "19"],
    ["", "4.5 Dual Betting Psychology", "21"],
    ["5.", "Executive Summary", "22"],
]

for entry in toc_data:
    if entry[0]:
        story.append(Paragraph(f"<b>{entry[0]}</b>&nbsp;&nbsp;&nbsp;<b>{entry[1]}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{entry[2]}", body_style))
    else:
        story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{entry[1]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{entry[2]}", body_style))

story.append(PageBreak())

# ============== SECTION 1: CORE GAME LOGIC ==============
story.append(Paragraph("<b>1. Core Game Logic &amp; Technical Design</b>", h1_style))
story.append(Spacer(1, 12))

story.append(Paragraph(
    "The Aviator crash game represents a sophisticated example of real-time multiplayer gambling software architecture. "
    "Unlike traditional casino games that rely on pre-rendered animations and static outcomes, crash games demand a "
    "persistent, low-latency connection between server and client to deliver a seamless, simultaneous experience to "
    "thousands of concurrent players. Understanding the technical architecture is essential for any developer attempting "
    "to replicate the authentic feel of this game genre.",
    body_style
))

# Section 1.1
story.append(Paragraph("<b>1.1 The Game Loop: Round Phases</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The game loop in Aviator follows a deterministic state machine pattern with clearly defined phases. Each round "
    "progresses through four sequential states, and the server broadcasts state transitions to all connected clients "
    "simultaneously. This synchronization is critical for maintaining game integrity and ensuring all players observe "
    "the same multiplier progression regardless of their geographic location or device capability.",
    body_style
))

story.append(Paragraph("<b>Betting Phase (Duration: 5-10 seconds)</b>", h3_style))
story.append(Paragraph(
    "During this initial phase, players can place one or two simultaneous bets. The interface displays a countdown timer "
    "and accepts bet inputs with validation occurring client-side for immediate feedback and server-side for security. "
    "The betting phase serves several critical functions: it allows the server to aggregate all wagers for the upcoming "
    "round, provides a psychological 'commitment period' that builds anticipation, and creates a social dynamic where "
    "players can observe others joining the round through the live bet feed. The server locks in all bets at the exact "
    "millisecond the phase ends, rejecting any late submissions with a 'bet not accepted' notification.",
    body_style
))

story.append(Paragraph("<b>Takeoff/Multiplier Phase (Duration: Variable, 0-30+ seconds)</b>", h3_style))
story.append(Paragraph(
    "This is the core gameplay phase where the multiplier begins incrementing from 1.00x upward. The rate of increase "
    "is not linear but follows an exponential acceleration curve, creating the characteristic 'crash imminent' tension. "
    "The multiplier starts incrementing slowly (approximately 0.01x per 100-200ms at 1.00x) and accelerates dramatically "
    "at higher multipliers (potentially 0.50x+ per 100ms at 50x+). This exponential acceleration is not merely cosmetic; "
    "it serves a mathematical purpose in compressing high-multiplier gameplay into watchable durations while extending "
    "the tension of early-game decisions. The server broadcasts the current multiplier at regular intervals (typically "
    "50-100ms), and clients interpolate between these values for smooth visual rendering.",
    body_style
))

story.append(Paragraph("<b>Crash Phase (Instantaneous)</b>", h3_style))
story.append(Paragraph(
    "The crash occurs at the predetermined multiplier value that was calculated before the round began. The server "
    "broadcasts the crash event to all clients, which triggers the visual 'plane flies away' animation. Players who "
    "have not cashed out lose their entire bet; those who successfully cashed out receive their bet multiplied by the "
    "multiplier at their cash-out moment. The crash point is cryptographically predetermined and cannot be manipulated "
    "by the operator during gameplay, which is the foundation of the provably fair system.",
    body_style
))

story.append(Paragraph("<b>Cooldown/Result Phase (Duration: 3-5 seconds)</b>", h3_style))
story.append(Paragraph(
    "After the crash, the game enters a brief cooldown period where results are finalized, payouts are processed, and "
    "the round history is updated. This phase serves both technical and psychological purposes. Technically, it allows "
    "the server to process all cash-outs, update player balances, and prepare the hash for the next round. Psychologically, "
    "it provides a moment of reflection where players process their win or loss, observe the crash point, and prepare "
    "mentally for the next round. The 'previous rounds' history panel updates during this phase, displaying the crash "
    "multipliers of recent games.",
    body_style
))

# Section 1.2
story.append(Paragraph("<b>1.2 State Management &amp; Synchronization</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The synchronization architecture of a multiplayer crash game represents one of its most technically challenging "
    "aspects. With thousands of players potentially connected to a single game round, the server must ensure that every "
    "player observes the same multiplier progression and crash point, regardless of network latency or processing power "
    "differences. This is achieved through a combination of WebSocket technology, client-side interpolation, and "
    "sophisticated latency compensation algorithms.",
    body_style
))

story.append(Paragraph("<b>WebSocket Implementation</b>", h3_style))
story.append(Paragraph(
    "Aviator utilizes WebSocket protocol for all real-time game communications, establishing a persistent bidirectional "
    "connection between client and server. Unlike HTTP polling, WebSockets maintain an open connection that allows the "
    "server to push updates instantly without request overhead. The typical message flow includes: connection handshake, "
    "authentication, game state subscription, real-time multiplier updates, bet placement confirmations, cash-out "
    "requests/responses, and crash event broadcasts. The WebSocket server typically runs on a dedicated port (often "
    "wss:// for encrypted connections) and is designed to handle massive concurrent connection counts through horizontal "
    "scaling and load balancing.",
    body_style
))

story.append(Paragraph("<b>Latency Compensation Strategies</b>", h3_style))
story.append(Paragraph(
    "Network latency creates a fundamental challenge: a player's cash-out request must be validated against the server's "
    "actual multiplier at the time of receipt, not the multiplier the player observed when they clicked. Aviator and "
    "similar games employ several compensation strategies to address this. First, server authoritative timestamping: "
    "every client action is timestamped by the server upon receipt, and the server's multiplier at that exact moment "
    "determines the outcome. Second, client-side prediction with reconciliation: the client optimistically shows the "
    "cash-out at the observed multiplier, but the server's response contains the authoritative value. Third, ping-based "
    "latency display: some implementations show players their round-trip time (RTT), creating awareness that their "
    "observed multiplier may lag behind the server's actual value by the duration of their network latency.",
    body_style
))

# Latency compensation table
story.append(Spacer(1, 12))
latency_data = [
    [Paragraph("<b>Latency Scenario</b>", header_style), Paragraph("<b>Client Display</b>", header_style), Paragraph("<b>Server Reality</b>", header_style), Paragraph("<b>Outcome</b>", header_style)],
    [Paragraph("Player clicks at 2.00x, 100ms latency", cell_style), Paragraph("Multiplier shows ~2.05x when click registers", cell_style), Paragraph("Server receives at 2.08x", cell_style), Paragraph("Cash-out at 2.08x (server-authoritative)", cell_style)],
    [Paragraph("Player clicks at 1.98x, crash at 2.00x", cell_style), Paragraph("Multiplier shows 2.00x when click registers", cell_style), Paragraph("Crash already occurred server-side", cell_style), Paragraph("Bet lost (click arrived post-crash)", cell_style)],
    [Paragraph("Player on fast connection (20ms RTT)", cell_style), Paragraph("Near-synchronized view", cell_style), Paragraph("Minimal discrepancy", cell_style), Paragraph("Cash-out very close to observed value", cell_style)],
]

latency_table = Table(latency_data, colWidths=[2.2*cm, 3.5*cm, 3.5*cm, 4.5*cm])
latency_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(latency_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 1: Latency Compensation Scenarios in Crash Games</i>", ParagraphStyle(
    name='Caption', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 18))

story.append(Paragraph("<b>Connection Drop Handling</b>", h3_style))
story.append(Paragraph(
    "When a player's connection drops during an active round, the game must handle the disconnection gracefully. The "
    "industry-standard approach is server-side auto-cash-out protection. If a player has enabled auto-cash-out at a "
    "specific multiplier, this instruction is stored server-side before the round begins. If the connection drops and "
    "the multiplier reaches the auto-cash-out threshold, the server automatically executes the cash-out on behalf of "
    "the disconnected player. For players without auto-cash-out enabled, disconnection during a round typically results "
    "in the bet being lost if the crash occurs before reconnection. This policy is clearly stated in terms of service "
    "and serves as an incentive for players to use auto-cash-out features.",
    body_style
))

story.append(Paragraph("<b>State Recovery on Reconnection</b>", h3_style))
story.append(Paragraph(
    "Upon reconnection, the client must synchronize its state with the server through a series of API calls. The client "
    "requests the current game state (phase, multiplier if in progress, time remaining), recent round history for the "
    "sidebar display, player's current balance, and any pending bets or active game participation. This state recovery "
    "must be atomic and fast, typically completing within 200-500ms to prevent players from missing significant portions "
    "of active rounds. Modern implementations use a combination of REST API for initial state recovery and WebSocket "
    "resubscription for ongoing real-time updates.",
    body_style
))

# Section 1.3
story.append(Paragraph("<b>1.3 Performance &amp; Rendering Techniques</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The visual smoothness of the multiplier progression is critical to the game's feel and player trust. Jittery or "
    "laggy multiplier updates would break immersion and raise suspicion about game fairness. Aviator achieves its "
    "characteristic smooth visual experience through a combination of efficient rendering technology and sophisticated "
    "client-side interpolation algorithms.",
    body_style
))

story.append(Paragraph("<b>Rendering Technology Stack</b>", h3_style))
story.append(Paragraph(
    "The game employs HTML5 Canvas as the primary rendering surface for the multiplier display and plane animation. "
    "Canvas provides pixel-level control and performance advantages over SVG for continuously animating elements. The "
    "animation loop typically runs at 60 frames per second (FPS), synchronized with the browser's requestAnimationFrame "
    "API for optimal performance and power efficiency. The plane sprite, multiplier text, and background curve are all "
    "rendered to a single canvas context, minimizing draw calls and compositing overhead. Some implementations may use "
    "WebGL for more complex visual effects like particle systems or dynamic lighting, though this is not essential for "
    "core functionality.",
    body_style
))

story.append(Paragraph("<b>Multiplier Interpolation Algorithm</b>", h3_style))
story.append(Paragraph(
    "The server broadcasts multiplier updates at discrete intervals (typically 50-100ms), but the client must display "
    "a continuously increasing value. This is achieved through interpolation between the last received server value and "
    "a predicted current value. The algorithm works as follows: when the client receives a multiplier update (e.g., "
    "1.50x at timestamp T), it records this value and the local timestamp. Until the next update arrives, the client "
    "interpolates forward based on the expected rate of increase, which follows the predetermined exponential curve. "
    "When the next update arrives (e.g., 1.58x at T+100ms), the client smoothly corrects any drift between its predicted "
    "value and the actual server value. This approach ensures visual smoothness while maintaining fidelity to server "
    "values.",
    body_style
))

story.append(Paragraph("<b>Optimization Strategies</b>", h3_style))
story.append(Paragraph(
    "Several optimization techniques ensure consistent performance across devices: efficient canvas clearing and redraw "
    "cycles minimize garbage collection pauses; sprite sheet-based animations reduce image loading overhead; text "
    "rendering uses pre-calculated glyph caches for the multiplier display; background calculations occur in web workers "
    "to prevent main thread blocking; and adaptive quality settings reduce visual complexity on lower-powered devices "
    "while maintaining the core multiplier visibility. The result is a game that runs smoothly on everything from "
    "high-end gaming PCs to budget smartphones, a critical requirement for the global iGaming market.",
    body_style
))

story.append(PageBreak())

# ============== SECTION 2: ALGORITHMS & MATH ==============
story.append(Paragraph("<b>2. Algorithms &amp; The Math (Provably Fair RNG)</b>", h1_style))
story.append(Spacer(1, 12))

story.append(Paragraph(
    "The mathematical foundation of Aviator represents one of the most sophisticated applications of cryptographic "
    "randomness in the gambling industry. The provably fair system ensures that neither the operator nor the player "
    "can predict or manipulate the outcome of any round, while the crash formula creates the characteristic skewed "
    "distribution that makes the game mathematically viable for operators and psychologically engaging for players.",
    body_style
))

# Section 2.1
story.append(Paragraph("<b>2.1 Provably Fair System Architecture</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The provably fair system is the cryptographic backbone that enables players to verify that game outcomes were not "
    "manipulated after bets were placed. This system has become essential in the crypto-gambling space where trust is "
    "paramount and traditional regulatory oversight may be limited. The architecture relies on three key components: "
    "server seeds, client seeds, and cryptographic hash functions, working together in a manner that prevents any party "
    "from predicting or altering outcomes.",
    body_style
))

story.append(Paragraph("<b>Server Seed (Pre-Generated)</b>", h3_style))
story.append(Paragraph(
    "The operator generates a random server seed for each gaming session or batch of rounds. This seed is a cryptographically "
    "secure random string, typically 64 hexadecimal characters (256 bits). Before any rounds using this seed begin, the "
    "operator publishes a SHA-256 hash of the server seed. This hash commitment is crucial: it binds the operator to a "
    "specific server seed without revealing the seed itself. Players can verify after the session that the server seed "
    "used to generate outcomes matches the hash that was published beforehand. If the operator were to change the server "
    "seed after seeing player bets, the hash would not match, and the manipulation would be detectable.",
    body_style
))

story.append(Paragraph("<b>Client Seed (Player-Provided)</b>", h3_style))
story.append(Paragraph(
    "Each player can contribute a client seed to the random number generation process. This seed represents player input "
    "that the operator cannot predict or control. In practice, clients seeds may be generated from player browser data, "
    "custom input strings, or automatically derived from nonces (sequential identifiers for each round). The inclusion "
    "of client seeds ensures that even if an operator's server seed were somehow compromised or predicted, the operator "
    "still could not determine round outcomes without knowing what client seeds would be contributed. This creates a "
    "multi-party randomness generation system where manipulation requires collusion between parties who never directly "
    "communicate.",
    body_style
))

story.append(Paragraph("<b>SHA-256 Hash Chain</b>", h3_style))
story.append(Paragraph(
    "The SHA-256 cryptographic hash function serves as the mixing function that combines server and client seeds into "
    "an unpredictable, uniformly distributed output. The hash function's properties are essential: it is deterministic "
    "(same input always produces same output), preimage-resistant (impossible to reverse), avalanche-effective (small "
    "input changes create completely different outputs), and uniformly distributed (outputs appear random even if inputs "
    "are not). The typical hash combination process involves concatenating the server seed and client seed (often with "
    "a nonce representing the round number), then computing SHA-256 of this combined string. The resulting hash is then "
    "converted into the crash multiplier through a mathematical formula.",
    body_style
))

story.append(Paragraph("<b>Verification Process</b>", h3_style))
story.append(Paragraph(
    "After a gaming session concludes, the operator reveals the server seed. Players can then independently verify "
    "outcomes by: computing SHA-256 of the revealed server seed and comparing it to the published hash commitment; "
    "combining the server seed with their client seed(s) and round nonces; hashing the combination and applying the "
    "crash formula; confirming the calculated crash points match the observed game outcomes. This verification can be "
    "performed using any standard SHA-256 implementation, including online tools, command-line utilities, or custom "
    "code, giving players complete independence in auditing game fairness.",
    body_style
))

# Provably fair table
story.append(Spacer(1, 12))
fair_data = [
    [Paragraph("<b>Component</b>", header_style), Paragraph("<b>Role</b>", header_style), Paragraph("<b>Security Property</b>", header_style)],
    [Paragraph("Server Seed", cell_style), Paragraph("Operator-generated randomness, pre-committed via hash", cell_style), Paragraph("Preimage resistance prevents reverse engineering from hash", cell_style)],
    [Paragraph("Client Seed", cell_style), Paragraph("Player-contributed randomness input", cell_style), Paragraph("Operator cannot predict; ensures multi-party generation", cell_style)],
    [Paragraph("Nonce", cell_style), Paragraph("Sequential round identifier", cell_style), Paragraph("Prevents replay attacks; ensures unique hash per round", cell_style)],
    [Paragraph("SHA-256 Hash", cell_style), Paragraph("Cryptographic mixing function", cell_style), Paragraph("Avalanche effect; uniform distribution; irreversible", cell_style)],
]

fair_table = Table(fair_data, colWidths=[3*cm, 6*cm, 6*cm])
fair_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(fair_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 2: Components of the Provably Fair System</i>", ParagraphStyle(
    name='Caption', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 18))

# Section 2.2
story.append(Paragraph("<b>2.2 The Crash Formula</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The mathematical formula that converts a random number into a crash multiplier is the heart of the game's economics. "
    "This formula must accomplish several objectives simultaneously: create a highly skewed distribution favoring low "
    "multipliers (ensuring operator profitability), allow for occasional high multipliers (maintaining player hope and "
    "excitement), and produce a mathematically clean distribution that can be easily verified. The standard crash formula "
    "used by Aviator and similar games achieves all these objectives through inverse transform sampling of an exponential "
    "distribution.",
    body_style
))

story.append(Paragraph("<b>Derivation from Uniform Random to Crash Point</b>", h3_style))
story.append(Paragraph(
    "The process begins with a uniformly distributed random number h in the range [0, 1), derived from the SHA-256 hash "
    "output. This uniform random is then transformed into a crash point through the following formula:",
    body_style
))

story.append(Paragraph(
    "<b>Crash Point = (House_Weight / (h × House_Weight - h - House_Weight + 1))</b>",
    ParagraphStyle(name='Formula', fontName='Times New Roman', fontSize=12, alignment=TA_CENTER, spaceBefore=12, spaceAfter=12)
))

story.append(Paragraph(
    "Where House_Weight represents the inverse of the house edge (e.g., House_Weight = 99 for a 1% house edge). A more "
    "intuitively understandable form of this formula is:",
    body_style
))

story.append(Paragraph(
    "<b>Crash Point = 0.99 / (1 - h)</b>  (assuming 1% house edge and no insta-crash)",
    ParagraphStyle(name='Formula', fontName='Times New Roman', fontSize=12, alignment=TA_CENTER, spaceBefore=12, spaceAfter=12)
))

story.append(Paragraph(
    "This formula produces an exponential distribution of crash points. When h is small (close to 0), the crash point is "
    "close to 1.00x (low multiplier). When h approaches 1, the crash point grows exponentially toward infinity. The "
    "distribution of outcomes follows a Pareto principle: approximately 50% of crashes occur at or below 2.00x, while "
    "only about 1% of crashes exceed 100x.",
    body_style
))

story.append(Paragraph("<b>Distribution Analysis</b>", h3_style))
story.append(Paragraph(
    "Understanding the probability distribution of crash points is essential for both game design and player strategy. "
    "The following table illustrates the cumulative probability of crashes at various multiplier thresholds:",
    body_style
))

# Distribution table
story.append(Spacer(1, 12))
dist_data = [
    [Paragraph("<b>Multiplier Threshold</b>", header_style), Paragraph("<b>Cumulative Probability</b>", header_style), Paragraph("<b>Interpretation</b>", header_style)],
    [Paragraph("1.00x (Insta-crash)", cell_style), Paragraph("1.00%", cell_style), Paragraph("Everyone loses immediately (house edge capture)", cell_style)],
    [Paragraph("1.50x", cell_style), Paragraph("34.00%", cell_style), Paragraph("One-third of rounds crash before 1.50x", cell_style)],
    [Paragraph("2.00x", cell_style), Paragraph("50.50%", cell_style), Paragraph("Half of rounds crash at or below 2.00x", cell_style)],
    [Paragraph("3.00x", cell_style), Paragraph("67.00%", cell_style), Paragraph("Two-thirds of rounds fail to reach 3.00x", cell_style)],
    [Paragraph("5.00x", cell_style), Paragraph("80.20%", cell_style), Paragraph("Only 1 in 5 rounds exceeds 5.00x", cell_style)],
    [Paragraph("10.00x", cell_style), Paragraph("90.10%", cell_style), Paragraph("1 in 10 rounds exceeds 10.00x", cell_style)],
    [Paragraph("50.00x", cell_style), Paragraph("98.02%", cell_style), Paragraph("1 in 50 rounds exceeds 50.00x", cell_style)],
    [Paragraph("100.00x", cell_style), Paragraph("99.01%", cell_style), Paragraph("1 in 100 rounds exceeds 100.00x", cell_style)],
    [Paragraph("1000.00x", cell_style), Paragraph("99.90%", cell_style), Paragraph("1 in 1000 rounds exceeds 1000.00x", cell_style)],
]

dist_table = Table(dist_data, colWidths=[4*cm, 4*cm, 7*cm])
dist_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(dist_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 3: Cumulative Probability Distribution of Crash Points</i>", ParagraphStyle(
    name='Caption', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 18))

story.append(Paragraph(
    "This distribution creates a psychological tension that is central to the game's appeal. Players know that high "
    "multipliers are possible (they see them in the history feed), but they also know that most rounds crash early. "
    "This creates a strategic tension between 'safe' early cash-outs with small profits and risky holds for potentially "
    "large multipliers.",
    body_style
))

# Section 2.3
story.append(Paragraph("<b>2.3 House Edge Implementation</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The house edge in crash games is implemented mathematically through the crash formula itself, not through any "
    "separate 'commission' mechanism. This creates a mathematically elegant system where the expected value of any bet "
    "is inherently negative for the player and positive for the house. Understanding how this edge is encoded is crucial "
    "for both operator economics and player awareness.",
    body_style
))

story.append(Paragraph("<b>The Insta-Crash Mechanism</b>", h3_style))
story.append(Paragraph(
    "The most visible manifestation of the house edge is the 'insta-crash' at exactly 1.00x. In a standard 1% house edge "
    "implementation, approximately 1% of rounds will crash at 1.00x before any player can cash out. This is achieved by "
    "mapping a range of hash values (roughly the lowest 1% of possible h values) directly to a crash point of 1.00x. "
    "When an insta-crash occurs, all players who bet on that round lose their entire wager regardless of when they would "
    "have tried to cash out. This mechanism captures the house edge in a single, dramatic moment that players immediately "
    "understand: there was never any chance to win that round.",
    body_style
))

story.append(Paragraph("<b>Mathematical Expected Value Analysis</b>", h3_style))
story.append(Paragraph(
    "For a 1% house edge, the theoretical Return to Player (RTP) is 99%, meaning players can expect to receive back 99 "
    "cents for every dollar wagered over the long term. This can be verified mathematically: the integral of the crash "
    "distribution weighted by payout equals 0.99 for a 1% edge. In practice, the RTP may vary slightly based on player "
    "behavior: players who consistently cash out at low multipliers may experience RTP closer to 99%, while players who "
    "chase high multipliers may experience lower effective RTP due to the increased probability of being caught in crashes "
    "before their target.",
    body_style
))

story.append(Paragraph("<b>Variable House Edge Considerations</b>", h3_style))
story.append(Paragraph(
    "Some implementations allow operators to configure different house edges. A higher house edge (2-3%) results in more "
    "frequent insta-crashes and a steeper probability curve toward low multipliers. A lower house edge (0.5-1%) results in "
    "fewer insta-crashes and a flatter distribution, giving players more chances at high multipliers. The house edge is "
    "typically hardcoded into the crash formula constant and cannot be changed round-to-round without breaking the "
    "provably fair verification. Reputable operators publish their house edge and demonstrate that it is consistent across "
    "all rounds.",
    body_style
))

story.append(PageBreak())

# ============== SECTION 3: TECHNICAL TRICKS ==============
story.append(Paragraph("<b>3. Technical Tricks &amp; Difficulty Mechanics</b>", h1_style))
story.append(Spacer(1, 12))

story.append(Paragraph(
    "Beyond the mathematical edge, crash games incorporate several design elements that make the game inherently difficult "
    "for players to beat systematically. These are not 'tricks' in the sense of deception, but rather mathematical and "
    "temporal properties that favor the house over extended play. Understanding these mechanisms is essential for "
    "developers seeking to replicate the authentic feel of the game.",
    body_style
))

# Section 3.1
story.append(Paragraph("<b>3.1 Exponential Growth vs. Human Reaction Time</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The exponential acceleration of the multiplier creates a fundamental asymmetry between player capability and game "
    "dynamics. As multipliers increase, the rate of increase accelerates, compressing decision windows and making "
    "deliberate cash-out decisions increasingly difficult. This mechanism exploits the limitations of human reaction "
    "time and cognitive processing speed.",
    body_style
))

story.append(Paragraph("<b>The Reaction Time Problem</b>", h3_style))
story.append(Paragraph(
    "Human reaction time for visual stimuli is typically 180-250 milliseconds for young adults, with significant "
    "individual variation and degradation with age. When the multiplier is ticking at 1.00x-2.00x, it may be increasing "
    "at approximately 0.01x per 100ms, meaning a 200ms reaction delay results in a 0.02x difference in cash-out point, "
    "a trivial variance. However, at 10.00x, the multiplier may be increasing at 0.10x per 100ms; that same 200ms delay "
    "now represents a 0.20x difference. At 50.00x, the rate might be 0.50x per 100ms, and a 200ms delay costs 1.00x or "
    "more in multiplier value. This acceleration means that players chasing high multipliers face increasingly narrow "
    "decision windows where milliseconds matter.",
    body_style
))

story.append(Paragraph("<b>Network Latency Compound Effect</b>", h3_style))
story.append(Paragraph(
    "When network latency is combined with reaction time, the challenge intensifies. A player with 100ms network latency "
    "and 200ms reaction time has a 300ms total delay between 'seeing' a multiplier and having their cash-out registered "
    "server-side. At low multipliers, this is manageable. At high multipliers, this delay can represent a significant "
    "portion of the remaining 'distance' between the current multiplier and an impending crash. Players intuitively "
    "understand that they must cash out 'early' when targeting high multipliers, but the psychological difficulty of "
    "accepting a 9.00x cash-out when the multiplier is climbing through 10.00x creates cognitive dissonance that "
    "contributes to suboptimal decision-making.",
    body_style
))

# Reaction time table
story.append(Spacer(1, 12))
react_data = [
    [Paragraph("<b>Multiplier Range</b>", header_style), Paragraph("<b>Increase Rate (approx.)</b>", header_style), Paragraph("<b>Decision Window for 0.5x Change</b>", header_style)],
    [Paragraph("1.00x - 2.00x", cell_style), Paragraph("~0.01x per 100ms", cell_style), Paragraph("~5 seconds", cell_style)],
    [Paragraph("2.00x - 5.00x", cell_style), Paragraph("~0.03x per 100ms", cell_style), Paragraph("~1.7 seconds", cell_style)],
    [Paragraph("5.00x - 10.00x", cell_style), Paragraph("~0.07x per 100ms", cell_style), Paragraph("~700ms", cell_style)],
    [Paragraph("10.00x - 20.00x", cell_style), Paragraph("~0.15x per 100ms", cell_style), Paragraph("~330ms", cell_style)],
    [Paragraph("20.00x - 50.00x", cell_style), Paragraph("~0.30x per 100ms", cell_style), Paragraph("~170ms", cell_style)],
    [Paragraph("50.00x - 100.00x", cell_style), Paragraph("~0.50x per 100ms", cell_style), Paragraph("~100ms", cell_style)],
]

react_table = Table(react_data, colWidths=[4*cm, 5*cm, 6*cm])
react_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(react_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 4: Multiplier Acceleration and Decision Window Compression</i>", ParagraphStyle(
    name='Caption', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor('#666666')
)))
story.append(Spacer(1, 18))

# Section 3.2
story.append(Paragraph("<b>3.2 Volatility &amp; Variance Model</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The variance model of crash games creates a distinctive player experience characterized by frequent small losses, "
    "occasional moderate wins, and rare large wins. This volatility profile is intentional and serves both mathematical "
    "and psychological purposes in the game design.",
    body_style
))

story.append(Paragraph("<b>High Volatility Characteristics</b>", h3_style))
story.append(Paragraph(
    "Crash games are classified as high volatility gambling products. This means the outcome distribution has a high "
    "standard deviation relative to the mean: players frequently experience losing streaks punctuated by occasional "
    "significant wins. The mathematical expectation remains negative (due to house edge), but the distribution creates "
    "the appearance of 'beatable' patterns that encourage continued play. High volatility is psychologically advantageous "
    "for operators because it creates memorable 'big win' experiences that players recall and chase, while the frequent "
    "losses are normalized as 'expected' outcomes.",
    body_style
))

story.append(Paragraph("<b>Variance and Bankroll Management</b>", h3_style))
story.append(Paragraph(
    "The high variance creates a bankroll management challenge for players. Even with optimal play (consistent early "
    "cash-outs), players can experience significant downswings due to variance. A player with a 100-unit bankroll "
    "betting 1 unit per round with a target cash-out at 1.50x could theoretically lose their entire bankroll in 100 "
    "consecutive rounds, even though the expected outcome would be to maintain approximately 99 units after 100 rounds. "
    "This variance risk encourages players to either reduce bet sizes (reducing excitement) or accept higher risk of "
    "ruin (increasing operator profits from depleted players).",
    body_style
))

story.append(Paragraph("<b>The 'Due' Fallacy</b>", h3_style))
story.append(Paragraph(
    "High volatility games encourage the gambler's fallacy: the belief that a series of low crashes must be followed "
    "by a high crash, or vice versa. In reality, each round is independent, and a series of 1.01x crashes has no "
    "influence on the probability of the next round being high or low. However, players often observe patterns in random "
    "data, seeing 'hot streaks' and 'cold streaks' where none exist. The game's design provides visual reinforcement "
    "for this fallacy: the 'previous rounds' history bar shows multipliers color-coded by value, making streaks of "
    "low (red) or high (green) multipliers visually apparent even though they have no predictive value.",
    body_style
))

story.append(PageBreak())

# ============== SECTION 4: BEHAVIORAL GAME DESIGN ==============
story.append(Paragraph("<b>4. Behavioral Game Design &amp; Psychology</b>", h1_style))
story.append(Spacer(1, 12))

story.append(Paragraph(
    "The remarkable success of Aviator cannot be attributed solely to its mathematical design or technical implementation. "
    "The game's psychological architecture leverages decades of research in behavioral economics, cognitive psychology, "
    "and game design to create an experience that is intensely engaging and, for many players, difficult to disengage "
    "from. Understanding these psychological mechanisms is essential for developers seeking to replicate the game's "
    "'feel' and for players seeking to understand their own behavioral responses.",
    body_style
))

# Section 4.1
story.append(Paragraph("<b>4.1 Illusion of Control</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The illusion of control is a cognitive bias first identified by psychologist Ellen Langer in 1975, describing the "
    "tendency for people to overestimate their ability to control outcomes that are actually determined by chance. "
    "Aviator's design exploits this bias masterfully through several mechanisms that create a subjective sense of agency "
    "in a fundamentally random process.",
    body_style
))

story.append(Paragraph("<b>The Cash-Out Button as Agency Illusion</b>", h3_style))
story.append(Paragraph(
    "The central mechanic of the game, the manual cash-out button, creates a powerful illusion of player agency. When "
    "a player successfully cashes out at 2.50x before a crash at 2.60x, they experience a sense of skillful timing. "
    "When they cash out at 2.50x before a crash at 10.00x, they may feel regret for 'leaving money on the table.' "
    "Both emotional responses reinforce the belief that their decision mattered, even though the crash point was "
    "predetermined before the round began. The player's only real choice is when to exit, but this single decision is "
    "framed as a high-stakes, skill-testing moment.",
    body_style
))

story.append(Paragraph(
    "Research in cognitive psychology shows that near-miss outcomes (narrowly escaping a crash or narrowly missing a "
    "high multiplier) are particularly effective at reinforcing the illusion of control. A player who cashes out at "
    "1.95x before a crash at 2.00x experiences the emotional intensity of a 'close call,' reinforcing their belief "
    "that they made a skilled decision, even though the 0.05x margin is well within the range of random variance and "
    "network latency.",
    body_style
))

story.append(Paragraph("<b>Auto-Cash-Out: Delegated Control</b>", h3_style))
story.append(Paragraph(
    "The auto-cash-out feature allows players to set a target multiplier at which their bet will automatically cash out. "
    "This feature serves multiple psychological functions: it provides a 'safety net' for players who cannot react "
    "quickly enough, it allows players to pre-commit to a strategy (potentially avoiding emotional decisions during "
    "gameplay), and it creates a new dimension of perceived skill, the ability to 'predict' or 'target' the right "
    "multiplier. However, auto-cash-out also subtly shifts the locus of control from moment-to-moment decision-making "
    "to pre-round planning, maintaining the overall sense of player agency while actually reducing the number of "
    "in-game decisions the player must make.",
    body_style
))

# Section 4.2
story.append(Paragraph("<b>4.2 Variable Ratio Reinforcement</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Variable ratio reinforcement is a behavioral conditioning schedule identified by B.F. Skinner, in which rewards are "
    "delivered after an unpredictable number of responses. This reinforcement schedule is known to produce the highest "
    "rates of responding and the greatest resistance to extinction, making it the foundation of many addictive behaviors "
    "and gambling mechanics.",
    body_style
))

story.append(Paragraph("<b>The Slot Machine Parallel</b>", h3_style))
story.append(Paragraph(
    "Slot machines are the canonical example of variable ratio reinforcement: players pull the lever (response) and "
    "occasionally receive a payout (reward) on an unpredictable schedule. Aviator creates an analogous structure: "
    "players bet and wait through each round (response), occasionally winning or experiencing a big multiplier (reward). "
    "The unpredictability of both the crash point and the win magnitude creates a powerful reinforcement loop. Players "
    "never know whether the 'next round' will be the big one, creating continuous motivation to continue playing.",
    body_style
))

story.append(Paragraph("<b>Dopamine and Anticipation</b>", h3_style))
story.append(Paragraph(
    "Neuroscientific research has shown that dopamine release in the brain's reward system is more strongly associated "
    "with anticipation of reward than with reward receipt itself. The multiplier's visual climb creates a sustained "
    "anticipatory state: with each tick upward, players experience a spike of 'will it continue or crash?' uncertainty. "
    "This uncertainty is cognitively engaging and emotionally stimulating, creating a micro-dopamine cycle within each "
    "round. The variable reinforcement comes not just from winning or losing, but from the moment-to-moment uncertainty "
    "of the multiplier's trajectory.",
    body_style
))

# Section 4.3
story.append(Paragraph("<b>4.3 FOMO &amp; Social Proof</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Fear of Missing Out (FOMO) and social proof are psychological principles that leverage our social nature to "
    "influence behavior. Aviator's interface design incorporates several elements that exploit these principles to "
    "increase engagement and betting frequency.",
    body_style
))

story.append(Paragraph("<b>Live Bet Feed Analysis</b>", h3_style))
story.append(Paragraph(
    "The live bet feed, showing other players' bets, cash-outs, and results in real-time, serves multiple psychological "
    "functions. First, it provides social proof: seeing others bet validates the activity as normal and acceptable. "
    "Second, it creates FOMO: when players see others winning at high multipliers, they experience a fear of missing "
    "similar opportunities. Third, it creates comparative emotions: players compare their results to others, experiencing "
    "pride when doing better and envy when doing worse, both emotions that motivate continued play. The feed is typically "
    "designed to highlight notable events: large bets, high cash-outs, and dramatic wins receive visual emphasis.",
    body_style
))

story.append(Paragraph("<b>The 'Big Win' Highlight Effect</b>", h3_style))
story.append(Paragraph(
    "When a player achieves a notable win (high multiplier, large payout), the game often highlights this event visually, "
    "displaying it prominently in the live feed and sometimes triggering celebratory animations. This serves the social "
    "proof function by demonstrating that big wins 'really happen,' counteracting any intuitive sense that the odds are "
    "stacked against the player. The big wins of others become aspirational targets, while the frequency of losses "
    "is normalized and backgrounded. This selective visibility creates a biased sample: players see the wins but not "
    "the overall distribution of outcomes.",
    body_style
))

# Section 4.4
story.append(Paragraph("<b>4.4 Loss Aversion &amp; Near Misses</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Loss aversion, first documented by Kahneman and Tversky in prospect theory, describes the psychological tendency "
    "for losses to feel approximately twice as painful as equivalent gains feel pleasurable. Aviator's design incorporates "
    "several mechanisms that exploit this asymmetry to influence player behavior.",
    body_style
))

story.append(Paragraph("<b>The 'Too Early' Regret</b>", h3_style))
story.append(Paragraph(
    "When a player cashes out at 2.00x and the round continues to 10.00x before crashing, they experience a specific "
    "form of loss aversion: not a monetary loss, but a 'potential gain' loss. The difference between their 2.00x outcome "
    "and the 10.00x that 'could have been' is processed as a psychological loss. This creates a powerful motivation to "
    "hold longer in future rounds, potentially leading to more actual losses (cash-outs that fail to execute before "
    "crash). The game's visual design emphasizes this 'lost potential' by continuing to display the multiplier after "
    "cash-out, forcing players to observe what they 'missed.'",
    body_style
))

story.append(Paragraph("<b>The 'Almost Made It' Near-Miss</b>", h3_style))
story.append(Paragraph(
    "When a player holds through 2.00x, 3.00x, 4.00x, and the round crashes at 4.50x, just after they decided to hold "
    "through another tick, they experience a near-miss effect. Research has shown that near-misses in gambling activate "
    "similar brain regions as actual wins, creating a reinforcing experience even from losing outcomes. The player "
    "processes the event as 'I almost won big' rather than 'I lost,' maintaining engagement and motivation to try again. "
    "This near-miss effect is amplified by the visual representation of the crash: seeing the plane fly away just "
    "moments after one's intended cash-out point creates a visceral 'so close' experience.",
    body_style
))

# Section 4.5
story.append(Paragraph("<b>4.5 Dual Betting Psychology</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The ability to place two simultaneous bets in Aviator is a distinctive feature that serves multiple psychological "
    "functions. This seemingly simple addition creates a complex decision environment that influences risk perception, "
    "betting strategy, and emotional engagement.",
    body_style
))

story.append(Paragraph("<b>The Hedging Illusion</b>", h3_style))
story.append(Paragraph(
    "Players often use dual bets to create a perceived hedge: one 'safe' bet with early cash-out target and one 'risk' "
    "bet with high target or no auto-cash-out. This creates the illusion of risk management, as if the 'safe' bet "
    "protects the 'risk' bet. Mathematically, both bets have the same negative expected value, and the total risk is "
    "additive. However, psychologically, this structure reduces the perceived riskiness of play. Players can tell "
    "themselves 'at least I'll get something back from the safe bet' while chasing high multipliers with the risk bet.",
    body_style
))

story.append(Paragraph("<b>Increased Engagement Through Complexity</b>", h3_style))
story.append(Paragraph(
    "Managing two bets simultaneously increases cognitive load and attention demand. Players monitoring two different "
    "multiplier targets, or making real-time cash-out decisions for two bets, are more deeply engaged in the game. "
    "This increased engagement reduces the likelihood of disengagement or boredom, as there is always 'something to do' "
    "during the multiplier phase. The dual-bet structure also increases bet frequency (two bets per round instead of "
    "one) and average bet size per player, directly impacting operator revenue.",
    body_style
))

story.append(Paragraph("<b>The 'One Got Away' Dynamic</b>", h3_style))
story.append(Paragraph(
    "Dual betting creates asymmetric emotional outcomes: often, one bet succeeds while the other fails. A player might "
    "cash out bet one at 2.00x successfully, while bet two crashes at 1.50x. This creates a complex emotional state: "
    "the player has technically profited (net positive), but the 'one that got away' draws attention and emotional "
    "energy. Alternatively, if one bet cashes out successfully at 2.00x and the other would have hit 10.00x, the player "
    "experiences the regret of the 'missed opportunity' on the cashed-out bet. These complex emotional states maintain "
    "engagement and motivate continued play to 'resolve' the emotional tension.",
    body_style
))

story.append(PageBreak())

# ============== SECTION 5: EXECUTIVE SUMMARY ==============
story.append(Paragraph("<b>5. Executive Summary</b>", h1_style))
story.append(Spacer(1, 12))

story.append(Paragraph(
    "The Aviator crash game represents a masterful integration of technical architecture, mathematical design, and "
    "behavioral psychology. Its success stems not from any single innovation but from the synergistic combination of "
    "multiple engaging elements that create a compelling, difficult-to-disengage experience. For developers seeking to "
    "clone or study this game genre, two features stand out as essential for authenticity.",
    body_style
))

story.append(Paragraph("<b>The #1 Most Important Technical Feature: Provably Fair System</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The provably fair cryptographic system is the foundational trust mechanism that distinguishes legitimate crash games "
    "from opaque, potentially manipulated alternatives. This system must be implemented correctly to create a credible, "
    "verifiable game. The implementation requires: (1) pre-commitment of server seeds through SHA-256 hash publication, "
    "(2) inclusion of client-contributed randomness, (3) deterministic crash point calculation from combined inputs, and "
    "(4) post-session verification capability for players. Without a genuine provably fair system, the game lacks the "
    "trust foundation that enables player confidence and long-term engagement. Even for single-player clones designed "
    "for demonstration or educational purposes, implementing a functional provably fair system demonstrates technical "
    "competence and creates a more authentic experience.",
    body_style
))

story.append(Paragraph("<b>The #1 Most Important Psychological Feature: Variable Ratio Reinforcement with Visual Feedback</b>", h2_style))
story.append(Spacer(1, 8))

story.append(Paragraph(
    "The visual multiplier climb, combined with unpredictable outcomes, creates the core psychological hook of the game. "
    "This mechanism must be implemented with attention to: (1) smooth, continuous visual feedback during the multiplier "
    "phase, (2) exponential acceleration that creates decision compression at high multipliers, (3) immediate visual "
    "feedback for cash-out events (celebratory for wins, clear termination for losses), and (4) visible outcome for "
    "all players (crash point displayed even after cash-out to create 'near miss' and 'missed opportunity' experiences). "
    "The multiplier climb is not merely a visual representation of a mathematical outcome; it is a carefully designed "
    "psychological experience that maintains engagement through sustained anticipation. The tension of watching a "
    "multiplier climb, knowing it could crash at any moment, is the essential emotional core that must be preserved in "
    "any authentic clone.",
    body_style
))

story.append(Spacer(1, 24))

# Final notes box
final_note = """
<b>Implementation Note:</b> When developing a clone for educational or assessment purposes, focus first on the core 
game loop and multiplier mechanics. The psychological elements will emerge naturally from correct implementation 
of the mathematical model and smooth visual presentation. The provably fair system should be implemented as a 
separate module that can be demonstrated independently of gameplay. Remember that responsible game design includes 
appropriate player protections: clear display of odds, self-exclusion options, session limits, and resources for 
problem gambling support.
"""

story.append(Paragraph(final_note, body_style))

# Build document
doc.build(story)
print(f"PDF generated successfully at: {output_path}")
