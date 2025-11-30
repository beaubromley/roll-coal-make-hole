\# Changelog



All notable changes to Roll Coal Make Hole will be documented in this file.



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

&nbsp; - Standard Well (10,000 ft)

&nbsp; - Bakken Horizontal (12,000 ft)

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



