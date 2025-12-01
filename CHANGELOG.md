\# Changelog



All notable changes to Roll Coal Make Hole will be documented in this file.



\## \[1.2.1] - 2025-12-01



\### Changed

\- Updated default high scores with real well performance data

\- Added actual engineer names and completion dates from field operations

\- Realistic drilling metrics based on actual wells

\- Harry Stamper's record-breaking Armageddon performance ($300B, saved the world)



\## \[1.2.0] - 2025-12-01



\### Added

\- \*\*Flow Rate System\*\*: Control pump rate (400-1000 gpm, 50 gpm increments)

  - Flow affects ROP (+60% at 1000 gpm, -30% at 400 gpm)

  - ECD (Equivalent Circulating Density) scales with flow and depth

  - Low flow (<500 gpm) increases motor stalls, DP spikes, and toolface flops

  - New controls: R (increase flow), F (decrease flow)

\- \*\*Speech Bubble System\*\*: Crew commentary with character portraits

  - 15 unique character portraits (drillers, engineers, company man, etc.)

  - Well-specific messages at key depths

  - General messages for common events

  - Armageddon features movie quotes from the film

\- \*\*Armageddon Well\*\*: Extreme 800 ft asteroid drilling challenge

  - 10-star difficulty (off the scale)

  - Hardness 150x normal formations

  - Zig-zagging path every 50 ft

  - Impossible MW window (kicks need 17 ppg, losses at 10 ppg)

  - Movie dialogue at specific depths

\- \*\*Default High Scores\*\*: Pre-populated leaderboards for all wells

\- \*\*Gas Flowing Alerts\*\*: Toast notifications during kick control

\- \*\*Well Images\*\*: Custom 8-bit artwork for all 6 wells

\- \*\*Title Screen\*\*: New custom artwork with explosions and lightning



\### Changed

\- \*\*Controls Remapped\*\*:

  - Mud Weight: M/N → T/G

  - LCM: I/K → Y/H

  - Flow Rate: New R/F

  - Restart removed (ESC to menu only)

\- \*\*ROP Formula\*\*: Reduced from (WOB × 10) to (WOB × 4) - requires 2.5x more WOB

\- \*\*Bit Wear\*\*: Increased 5x - bits wear out much faster

\- \*\*Diff Pressure\*\*: Reduced generation 2.5x - DP less limiting, bit wear is primary limit

\- \*\*Motor Stall\*\*: Now at 110% max DP (1650 psi)

\- \*\*DP Spikes\*\*: Toast notifications instead of blocking popups

\- \*\*Well Lengths\*\*:

  - STACK: 13,500 ft → 20,500 ft

  - Delaware: 14,500 ft → 21,500 ft

  - Williston: 26,500 ft → 21,500 ft

\- \*\*Recorder Tracks\*\*: Depth removed, Flow Rate added (ROP, WOB, Diff P, Flow)

\- \*\*Directional Path\*\*: Dashed line instead of solid

\- \*\*Well Select\*\*: Horizontal scrolling with auto-scroll on hover

\- \*\*Kibbey Formation\*\*: Abrasiveness increased to 10 (destroys bits)



\### Improved

\- Digital readouts condensed to fit 6 parameters

\- Bottom stats moved up 10px for better spacing

\- ECD display shows effective mud weight contribution

\- Speech bubbles slide in from bottom-left

\- Better PDC bit graphics with realistic cutters

\- Formation transitions scroll smoothly



\### Technical

\- New SpeechBubble.js module for crew commentary

\- Flow rate calculations integrated into all drilling mechanics

\- ECD affects both kicks (helps prevent) and losses (can induce)

\- Default scores populate on first load



\## \[1.1.0] - 2025-11-30



\### Added

\- \*\*5 Playable Wells\*\*: Powder River, Williston, Eagle Ford, STACK, Delaware

\- \*\*Casing System\*\*: Surface, intermediate, and production casing strings

  - Casing resets bit and motor health to 100%

  - Adds realistic casing costs ($65k-$750k depending on depth)

  - Notifications pause game until acknowledged

\- \*\*Toast Notification System\*\*: Non-blocking notifications for minor events

  - Toolface flop alerts when sliding direction changes

  - Periodic loss rate updates every few seconds

  - DP spike warnings (non-blocking)

\- \*\*Horizontal Well Select Screen\*\*: Scrollable card layout with high scores

\- \*\*Formation-Specific Challenges\*\*:

  - Kibbey formation (Williston) extremely abrasive (destroys bits)

  - Gas kicks in Red Fork and Chester (STACK)

  - Major losses in Wilcox (Eagle Ford)

  - Loss zone in Mission Canyon (Williston)



\### Changed

\- Motor stall threshold increased to 110% max DP (1650 psi from 1450 psi)

\- DP spikes now toast notifications instead of blocking popups

\- DP spikes take 5-10% motor health (random) instead of fixed amount

\- Spike probability increases with damaged motor health

\- WOB automatically resets to 0 on motor stall

\- Lateral sections have wavering paths for realism

\- Well difficulty reordered: Powder (1★) → Williston (2★) → Eagle Ford (3★) → STACK (4★) → Delaware (5★)



\### Improved

\- PDC bit graphics with realistic cutter layout

\- Formation transitions scroll smoothly

\- Digital readouts fixed width (no bouncing)

\- High scores show on well selection cards



\### Removed

\- Three Forks formation from Williston well

\- Pepper Shale and Buda Limestone from Eagle Ford

\- Pierre Shale, Greenhorn, Mowry, Dakota from Powder River (replaced with Shallow Sands)



\## \[1.0.1] - 2025-11-30



\### Fixed

\- Trip speed now properly accelerated 10x for gameplay

\- Kick detection only triggers when mud weight is insufficient

\- Formation transitions now scroll smoothly instead of instant change

\- Digital readouts no longer shift when values change digit count

\- Motor health now properly drains at high differential pressure

\- DP spikes only occur above 90% threshold (was 80%)



\### Added

\- Toast notification system for non-critical alerts

\- Toolface flop notifications when sliding direction changes

\- Formation-based toolface flop frequency (worse in 5000-9000 ft range)

\- High score menu accessible from start screen with \[H] key

\- Performance metrics (ft/day and $/ft) in high scores and name entry

\- Mud weight change costs ($5,000 per 0.1 ppg)

\- LCM system with mud weight increase (30 lb/bbl = 0.1 ppg)

\- LCM natural decay over time

\- Quit to menu option from pause screen



\### Changed

\- Bit cost: $25,000 → $15,000

\- Motor cost: $15,000 → $25,000

\- Motor health drain rates increased significantly at high utilization

\- Differential pressure more erratic (±15% variation, 50-100 psi bounce)

\- LCM display shows whole numbers only

\- More complex directional paths for all wells (7-11 waypoints)

\- Max mud weight increased to 17.0 ppg

\- Max WOB increased to 80 klbs



\## \[1.0.0] - 2025-11-30



\### Added

\- Initial release of Roll Coal Make Hole

\- Core drilling mechanics (ROP, WOB, bit wear, motor differential pressure)

\- Directional drilling system (sliding left/right, rotating with drift)

\- Two playable wells:

  - Standard Well (10,000 ft)

  - Bakken Horizontal (12,000 ft)

\- Formation system with 6-8 unique formations per well

\- Mud weight management (8.0-17.0 ppg)

\- Mud loss system with LCM treatment

\- Kick detection and control system

\- Motor stall mechanics

\- 8-bit style drilling recorder with 4 tracks

\- Drilling window showing real-time deviation

\- High score system with localStorage persistence

\- Economic tracking (daily spread rate, trip costs, NPV penalties)

\- Start menu and well selection screens

\- Pause functionality

\- Slide metrics (% footage and % time)



\### Features

\- Real-time strip chart recorder

\- Formation transition visualization

\- Color-coded warnings and alerts

\- Keyboard controls for all operations

\- Responsive drilling physics

\- Cost optimization gameplay



\### Technical

\- Modular JavaScript architecture

\- Separate rendering, game logic, and UI layers

\- Configurable well system for easy expansion

\- LocalStorage for high score persistence

