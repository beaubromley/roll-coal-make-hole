# Changelog

All notable changes to Roll Coal Make Hole will be documented in this file.

## [1.3.3] - 2025-12-05

### Added
- **Persistent Loss Rate Indicator**: Always-visible losses display on right side
  - Shows bbl/hr and % of flow rate in real-time
  - Flashing animation to draw attention
  - Turns red for severe losses (>500 bbl/hr)
- **Improved LCM System**: 
  - Base 5 lb/bbl LCM always present in mud system (invisible baseline)
  - Healing based on cumulative LCM pumped through losses (1000 lbs per ppg differential)
  - LCM effectiveness resets after each casing point (fresh hole section)
  - LCM decay accelerates with loss rate (losing mud = losing LCM faster)
  - Tracks total LCM used (lbs) in bottom stats
- **Enhanced Loss Rate System**:
  - Loss rate calculated as % of flow rate (realistic hydraulics)
  - Checks all formations for active loss zones simultaneously
  - Shows rate and percentage in multiple locations
  - Tracks total mud lost (bbls) in bottom stats
- Motor stalls now cause 10-20% motor health damage
- Formation transitions appear at screen bottom (1200 ft preview) and scroll up naturally

### Changed
- **EMW replaces ECD** in stat displays for clarity
  - Digital readouts show Base MW (controllable value with T/G keys)
  - Bottom stats show EMW (total effective mud weight including ECD + LCM)
  - Driller's Console shows Base MW
- Loss warning alert resets after each casing point (get alert per hole section)
- Removed ROP penalty for losses (losses cost money and LCM, not drilling time)
- Trip notifications improved:
  - Show failure reason immediately
  - Animate trip at 10x speed
  - Show completion message after animation
- Formation drift scales with ROP (realistic - no drift when not drilling)
- Rotary drift direction flips 50% of time (was 30%)

### Fixed
- Loss zones now check all formations, not just current formation
- LCM healing percentage trends correctly (improves as you pump LCM)
- Chart data logging uses consistent time calculation
- Digital readout displays correct MW type
- Loss rate indicator stays visible while in loss zone

## [1.3.2] - 2025-12-05

### Added

- **Driller's Console**: Clickable UI overlay with full drilling controls
  - Click-and-hold support for WOB, Flow, MW, and LCM adjustments
  - Mode buttons for Slide Left, Rotate, Slide Right with visual feedback
  - Pause button integrated into console header
  - Minimize/maximize functionality (defaults to open)
  - All keyboard shortcuts still functional
- **Performance Reports**: Real-time charts on pause screen
  - Depth vs. Time chart tracking drilling efficiency
  - Depth vs. Cost chart monitoring spending trends
  - Final reports shown on high score entry screen
  - Charts log every 10 ft for detailed tracking
  - Inverted Y-axis (depth increases downward - realistic)
  - Smart axis labels (show full numbers <1000, then switch to "k" format)
- **Armageddon Victory Screen**: Epic explosion animation after bomb placement
  - Custom 800x800px pixel art victory image
  - Click anywhere or press SPACE to continue
  - Shows before high score entry
- **Time Display Multiplier**: Adjustable time acceleration (2.67x default)
  - Gameplay feels the same but wells complete in realistic timeframes
  - 3 real days = ~8 displayed days
  - All stats, charts, and scores show multiplied time
- Clickable OK buttons on all blocking notifications (SPACE key still works)
- Click-to-dismiss speech bubbles (also auto-dismiss after duration)
- Custom speech bubble duration support (Harry's 750 ft speech lasts 10 seconds)
- Well Planner warning at 45+ ft deviation
- Manager motivation speech at 15,000 ft (Powder River)
- Engineer surface record speech at 4,600 ft (Eagle Ford)
- Additional depth-based speeches for Williston and Eagle Ford wells
- New portraits: Manager, Well Planner, Supervisor

### Changed

- **Reorganized Speech System**: All triggers now configured in SpeechBubble.js
  - Depth-based triggers in `depthTriggers` array
  - Formation-based triggers in `formationTriggers` array
  - Easy to add new speeches - just add one line to config
  - Cleaner GameEngine code
- Speech bubbles stack at 250px to clear Driller's Console
- Speech bubble cooldown (10 sec) doesn't apply to Armageddon
- Formation drift now scales with ROP (0 WOB = 0 drift)
- Rotary drift direction flips 50% of the time (was 30%)
- Motor stalls now cause 10-20% motor health damage
- Time penalties properly added and displayed:
  - Trips: Actual trip time added to game clock
  - Casing: 2 hours per 1000 ft of depth
  - Stuck pipe: 3 days penalty
- Final production casing message simplified (no bit/motor info)
- Kick notifications clarify MW must increase to proceed
- Charts display smooth curves with NPT impacts naturally included
- More compact UI throughout (Name Entry, Driller's Console)

### Fixed

- Chart data logging consistency (all use display time multiplier)
- Time no longer "jogs backward" at casing points
- Performance logging properly tracks after trips, casing, and kicks
- Trip animations no longer pause immediately (animate first, then pause)
- Null checks in all renderer draw methods
- Speech bubble triggers fire correctly for all event types
- Final data points include production casing costs

### Technical

- Added `TIME_DISPLAY_MULTIPLIER` constant (2.67)
- New `UIManager.getDisplayTime()` helper method
- New `DrillersConsole.js` module for clickable controls
- Enhanced `SpeechBubble.js` with trigger config arrays
- Added `tripReason`, `lastLoggedDepth` to GameState
- Performance log tracks depths, days, costs separately

## [1.3.1] - 2025-12-03

### Added

- **Driller's Console**: Clickable UI overlay for easier control
  - Click-and-hold support for rapid parameter changes
  - Minimize/maximize functionality
  - Mode buttons: Slide Left, Rotate, Slide Right
  - Parameter controls: WOB, Flow Rate, Mud Weight, LCM
- **Reports Tab**: Real-time performance charts
  - Depth vs. Time chart (tracking drilling efficiency)
  - Depth vs. Cost chart (tracking cost performance)
  - Charts log data every 10 ft for detailed analysis
- Clickable OK buttons on all blocking notifications
- Well Planner speech bubble at 45+ ft deviation
- Manager motivational speech at 15,000 ft (Powder River)
- Engineer surface record speech at 4,600 ft (Eagle Ford)

### Changed

- Speech bubbles positioned higher to clear Driller's Console (200px from bottom)
- Formation drift now scales with ROP (no drift when not making hole)
- Chart Y-axis inverted (depth increases downward - realistic display)
- Compact console design for better screen real estate

### Improved

- Speech bubble cooldown system
- Formation drift now scales with ROP (0 ROP = 0 drift when WOB = 0)
- Reorganized depth-based speech triggers into dedicated section in update loop
- Separated formation-based triggers from depth-based triggers
- Extended kick/loss/instability zones to persist until casing (more realistic)
- More compact Driller's Console styling

### Fixed

- Speech bubble depth triggers now fire correctly every frame
- Console UI properly updates in real-time
- Null checks added to renderer draw methods

## [1.3.0] - 2025-12-02

### Added

- **Instability System**: New wellbore collapse mechanic for shale formations
  - Three severity levels (minor/moderate/severe) based on MW deficit
  - Severity-based floorhand warnings with speech bubbles
  - Stuck pipe penalty: $1,000,000 and restart from last casing point
  - Active in Niobrara, Bakken, Eagle Ford, Meramec, and Wolfcamp formations
- **Starting Mud Weight System**: Each hole section now has appropriate starting MW
  - Automatically adjusts MW when casing is set
  - Realistic mud weights for each well's hole sections
- **Speech Bubble Cooldown**: 10-second cooldown prevents spam messages
- **Well Planner Warning**: Triggers at 45+ ft deviation from directional plan
- New Manager portrait and motivational speech bubble at 15,000 ft (Powder River)
- Engineer speech bubble at 4,600 ft for surface hole record (Eagle Ford)

### Changed

- Extended kick/loss zones to persist across formations until next casing point
- Improved speech bubble triggering system with better timing
- Updated all well configurations with comprehensive kick/loss zones
- All formations now have both kick and loss zones (8.0/15.0 ppg defaults)

### Fixed

- Fixed initialization issues with wellConfig loading
- Added null checks to renderer draw methods
- Improved game state initialization

## [1.2.2] - 2025-12-01

### Changed

- Updated default high scores with real well performance data from field operations
- Added actual engineer names and completion dates
- Realistic drilling metrics based on completed wells

### Fixed

- Speech bubbles now stack vertically when multiple appear
- Smooth transitions when bubbles appear and disappear
- Fixed speech bubble positioning bug

## [1.2.1] - 2025-12-01

### Changed

- Updated default high scores with real well performance data
- Added actual engineer names and completion dates from field operations
- Realistic drilling metrics based on actual wells
- Harry Stamper's record-breaking Armageddon performance ($300B, saved the world)

## [1.2.0] - 2025-12-01

### Added

- **Flow Rate System**: Control pump rate (400-1000 gpm, 50 gpm increments)
  - Flow affects ROP (+60% at 1000 gpm, -30% at 400 gpm)
  - ECD (Equivalent Circulating Density) scales with flow and depth
  - Low flow (<500 gpm) increases motor stalls, DP spikes, and toolface flops
  - New controls: R (increase flow), F (decrease flow)
- **Speech Bubble System**: Crew commentary with character portraits
  - 15 unique character portraits (drillers, engineers, company man, etc.)
  - Well-specific messages at key depths
  - General messages for common events
  - Armageddon features movie quotes from the film
- **Armageddon Well**: Extreme 800 ft asteroid drilling challenge
  - 10-star difficulty (off the scale)
  - Hardness 150x normal formations
  - Zig-zagging path every 50 ft
  - Impossible MW window (kicks need 17 ppg, losses at 10 ppg)
  - Movie dialogue at specific depths
- **Default High Scores**: Pre-populated leaderboards for all wells
- **Gas Flowing Alerts**: Toast notifications during kick control
- **Well Images**: Custom 8-bit artwork for all 6 wells
- **Title Screen**: New custom artwork with explosions and lightning

### Changed

- **Controls Remapped**:
  - Mud Weight: M/N → T/G
  - LCM: I/K → Y/H
  - Flow Rate: New R/F
  - Restart removed (ESC to menu only)
- **ROP Formula**: Reduced from (WOB × 10) to (WOB × 4) - requires 2.5x more WOB
- **Bit Wear**: Increased 5x - bits wear out much faster
- **Diff Pressure**: Reduced generation 2.5x - DP less limiting, bit wear is primary limit
- **Motor Stall**: Now at 110% max DP (1650 psi)
- **DP Spikes**: Toast notifications instead of blocking popups
- **Well Lengths**:
  - STACK: 13,500 ft → 20,500 ft
  - Delaware: 14,500 ft → 21,500 ft
  - Williston: 26,500 ft → 21,500 ft
- **Recorder Tracks**: Depth removed, Flow Rate added (ROP, WOB, Diff P, Flow)
- **Directional Path**: Dashed line instead of solid
- **Well Select**: Horizontal scrolling with auto-scroll on hover
- **Kibbey Formation**: Abrasiveness increased to 10 (destroys bits)

### Improved

- Digital readouts condensed to fit 6 parameters
- Bottom stats moved up 10px for better spacing
- ECD display shows effective mud weight contribution
- Speech bubbles slide in from bottom-left
- Better PDC bit graphics with realistic cutters
- Formation transitions scroll smoothly

### Technical

- New SpeechBubble.js module for crew commentary
- Flow rate calculations integrated into all drilling mechanics
- ECD affects both kicks (helps prevent) and losses (can induce)
- Default scores populate on first load

## [1.1.0] - 2025-11-30

### Added

- **5 Playable Wells**: Powder River, Williston, Eagle Ford, STACK, Delaware
- **Casing System**: Surface, intermediate, and production casing strings
  - Casing resets bit and motor health to 100%
  - Adds realistic casing costs ($65k-$750k depending on depth)
  - Notifications pause game until acknowledged
- **Toast Notification System**: Non-blocking notifications for minor events
  - Toolface flop alerts when sliding direction changes
  - Periodic loss rate updates every few seconds
  - DP spike warnings (non-blocking)
- **Horizontal Well Select Screen**: Scrollable card layout with high scores
- **Formation-Specific Challenges**:
  - Kibbey formation (Williston) extremely abrasive (destroys bits)
  - Gas kicks in Red Fork and Chester (STACK)
  - Major losses in Wilcox (Eagle Ford)
  - Loss zone in Mission Canyon (Williston)

### Changed

- Motor stall threshold increased to 110% max DP (1650 psi from 1450 psi)
- DP spikes now toast notifications instead of blocking popups
- DP spikes take 5-10% motor health (random) instead of fixed amount
- Spike probability increases with damaged motor health
- WOB automatically resets to 0 on motor stall
- Lateral sections have wavering paths for realism
- Well difficulty reordered: Powder (1★) → Williston (2★) → Eagle Ford (3★) → STACK (4★) → Delaware (5★)

### Improved

- PDC bit graphics with realistic cutter layout
- Formation transitions scroll smoothly
- Digital readouts fixed width (no bouncing)
- High scores show on well selection cards

### Removed

- Three Forks formation from Williston well
- Pepper Shale and Buda Limestone from Eagle Ford
- Pierre Shale, Greenhorn, Mowry, Dakota from Powder River (replaced with Shallow Sands)

## [1.0.1] - 2025-11-30

### Fixed

- Trip speed now properly accelerated 10x for gameplay
- Kick detection only triggers when mud weight is insufficient
- Formation transitions now scroll smoothly instead of instant change
- Digital readouts no longer shift when values change digit count
- Motor health now properly drains at high differential pressure
- DP spikes only occur above 90% threshold (was 80%)

### Added

- Toast notification system for non-critical alerts
- Toolface flop notifications when sliding direction changes
- Formation-based toolface flop frequency (worse in 5000-9000 ft range)
- High score menu accessible from start screen with [H] key
- Performance metrics (ft/day and $/ft) in high scores and name entry
- Mud weight change costs ($5,000 per 0.1 ppg)
- LCM system with mud weight increase (30 lb/bbl = 0.1 ppg)
- LCM natural decay over time
- Quit to menu option from pause screen

### Changed

- Bit cost: $25,000 → $15,000
- Motor cost: $15,000 → $25,000
- Motor health drain rates increased significantly at high utilization
- Differential pressure more erratic (±15% variation, 50-100 psi bounce)
- LCM display shows whole numbers only
- More complex directional paths for all wells (7-11 waypoints)
- Max mud weight increased to 17.0 ppg
- Max WOB increased to 80 klbs

## [1.0.0] - 2025-11-30

### Added

- Initial release of Roll Coal Make Hole
- Core drilling mechanics (ROP, WOB, bit wear, motor differential pressure)
- Directional drilling system (sliding left/right, rotating with drift)
- Two playable wells:
  - Standard Well (10,000 ft)
  - Bakken Horizontal (12,000 ft)
- Formation system with 6-8 unique formations per well
- Mud weight management (8.0-17.0 ppg)
- Mud loss system with LCM treatment
- Kick detection and control system
- Motor stall mechanics
- 8-bit style drilling recorder with 4 tracks
- Drilling window showing real-time deviation
- High score system with localStorage persistence
- Economic tracking (daily spread rate, trip costs, NPV penalties)
- Start menu and well selection screens
- Pause functionality
- Slide metrics (% footage and % time)

### Features

- Real-time strip chart recorder
- Formation transition visualization
- Color-coded warnings and alerts
- Keyboard controls for all operations
- Responsive drilling physics
- Cost optimization gameplay

### Technical

- Modular JavaScript architecture
- Separate rendering, game logic, and UI layers
- Configurable well system for easy expansion
- LocalStorage for high score persistence