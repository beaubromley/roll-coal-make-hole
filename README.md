## **README.md** (Complete Updated File)

# Roll Coal Make Hole

A retro-style 8-bit directional drilling simulator game built with vanilla JavaScript and HTML5 Canvas. Experience the challenges of directional drilling, manage drilling parameters, navigate complex subsurface conditions, and listen to your crew's commentary as you drill to total depth while minimizing costs.

## 🎮 Game Overview

Take control of a drilling operation and navigate through various geological formations while managing multiple drilling parameters. Balance speed, cost, safety, and directional control to successfully reach your target depth.

## ✨ Features

### Drilling Mechanics
- **Realistic ROP Calculations**: Rate of Penetration varies by formation hardness, Weight on Bit (WOB), mud weight, and flow rate
- **Bit Wear System**: Bits degrade based on WOB and formation abrasiveness
- **Directional Drilling**: Switch between rotating and sliding modes to steer the wellbore
- **Formation-Based Drift**: Different rock types cause predictable directional tendencies
- **Flow Rate Control**: Manage pump rate (400-1000 gpm) to optimize drilling performance

### Mud Motor Management
- **Differential Pressure Monitoring**: Track motor performance in real-time
- **Motor Stalls**: Excessive DP (1650 psi) stops drilling until WOB is reduced
- **DP Spikes**: Random pressure spikes damage motor health (5-10% per spike)
- **Motor Failure**: Motor health reaches 0, requires expensive trip
- **Flow Rate Impact**: Higher flow reduces stall risk and improves motor performance

### Mud System
- **Mud Weight Control**: Adjust between 8.0 - 17.0 ppg ($5,000 per 0.1 ppg)
- **Kick Prevention**: Maintain proper mud weight to prevent formation fluid influx
- **Mud Losses**: High mud weight can cause losses in permeable zones
- **LCM System**: Add Lost Circulation Material (0-100 lb/bbl) to heal losses
- **ECD (Equivalent Circulating Density)**: Flow rate creates additional pressure
  - Higher flow = higher ECD (helps prevent kicks, can induce losses)
  - ECD scales with depth and flow rate

### Casing Program
- **Surface Casing**: Set at shallow depths ($65k-$215k)
- **Intermediate Casing**: Set at mid-depths ($450k-$800k)
- **Production Casing**: Set at total depth ($350k-$2M)
- **Benefits**: Resets bit and motor health to 100% at each casing point

### Hazards & Events
- **Kicks**: Formation pressure exceeds hydrostatic pressure
  - More common below 8,000 ft
  - Requires proper MW + ECD to prevent
  - Control time speeds up 10x once kill weight achieved
- **Mud Losses**: Occur in specific zones when MW + ECD exceeds formation fracture gradient
- **Bit Failures**: Worn bits require trips to surface for replacement
- **Motor Failures**: Damaged motors require trips and replacement
- **Toolface Flops**: Sliding direction changes randomly (formation-dependent)

### Visual Systems
- **8-Bit Drilling Recorder**: Real-time strip chart showing ROP, WOB, Diff Pressure, and Flow Rate
- **Drilling Window**: Top-down view showing bit position relative to target path
- **Formation Transitions**: See upcoming formations before drilling into them
- **Directional Path**: Dashed red line showing target wellbore trajectory
- **Speech Bubbles**: Crew commentary with character portraits

### Economics
- **Daily Spread Rate**: $80,000/day operational costs
- **Trip Costs**: $15,000 bit + $25,000 motor per trip
- **Casing Costs**: $65,000 - $2,000,000 depending on well and depth
- **Mud Costs**: $100/bbl for lost mud
- **LCM Costs**: $10,000 per 10 lb/bbl added
- **MW Change Costs**: $5,000 per 0.1 ppg adjustment
- **NPV Penalties**: Deviation from planned path reduces well value
- **Kick Costs**: Time-based penalties for well control operations

## 🎯 Controls

### Drilling Operations
- **UP/DOWN ARROWS** - Increase/Decrease Weight on Bit (0-80 klbs)
- **A** - Slide Left (slower ROP, active steering)
- **S** - Rotate (normal ROP, passive drift)
- **D** - Slide Right (slower ROP, active steering)

### Mud & Flow System
- **T/G** - Increase/Decrease Mud Weight (8.0-17.0 ppg)
- **Y/H** - Increase/Decrease LCM Concentration (0-100 lb/bbl)
- **R/F** - Increase/Decrease Flow Rate (400-1000 gpm)

### Game Controls
- **P** - Pause/Resume
- **ESC** - Quit to Menu

## 🌍 Playable Wells

### 1. Powder River Basin - Niobrara (Wyoming) ★☆☆☆☆
- **Depth:** 27,500 ft MD
- **Challenges:** Extreme depth, multiple loss zones
- **Casing:** 3 strings ($1.385M total)
- **Difficulty:** Easiest - good for learning

### 2. Williston Basin - Bakken (North Dakota) ★★☆☆☆
- **Depth:** 21,500 ft MD
- **Challenges:** Extremely abrasive Kibbey formation, losses, kicks
- **Casing:** 3 strings ($905k total)
- **Difficulty:** Easy - watch for Kibbey destroying bits

### 3. South Texas - Eagle Ford ★★★☆☆
- **Depth:** 19,500 ft MD
- **Challenges:** Major Wilcox losses, deep kicks, long curve
- **Casing:** 2 strings ($840k total)
- **Difficulty:** Medium - manage major losses early

### 4. STACK Play - Meramec (Oklahoma) ★★★★☆
- **Depth:** 20,500 ft MD
- **Challenges:** Gas kicks in Red Fork and Chester, tight curve
- **Casing:** 3 strings ($1.215M total)
- **Difficulty:** Hard - two kick zones close together

### 5. Delaware Basin - Wolfcamp (West Texas) ★★★★★
- **Depth:** 21,500 ft MD
- **Challenges:** Salt sections, deep kickoff, losses and kicks
- **Casing:** 3 strings ($1.265M total)
- **Difficulty:** Hardest - everything at once

### 6. ARMAGEDDON - Asteroid ★★★★★★★★★★
- **Depth:** 800 ft
- **Challenges:** EVERYTHING - impossible MW window, extreme hardness, zig-zag path
- **Casing:** 1 string ($5M)
- **Difficulty:** EXTREME - features Armageddon movie quotes
- **Note:** Hardness 150x normal, requires perfect execution

## 📊 HUD Elements

### Digital Readouts (Top)
- **DEPTH** - Current measured depth in feet
- **ROP** - Rate of Penetration in ft/hr
- **WOB** - Weight on Bit in klbs (color-coded)
- **DIFF PRESS** - Motor differential pressure in psi (color-coded)
- **FLOW** - Pump rate in gpm (color-coded: red <500, yellow <550, cyan normal)
- **MUD WT** - Current mud weight including ECD in ppg

### Drilling Recorder (Top Left)
Real-time strip chart displaying:
- **Green Line** - Rate of Penetration (0-600 ft/hr)
- **Yellow Line** - Weight on Bit (0-80 klbs)
- **Magenta Line** - Differential Pressure (0-1500 psi, with 80% threshold line)
- **Cyan Line** - Flow Rate (400-1000 gpm)

### Drilling Window (Left Side)
Top-down view showing:
- **White Triangle** - Drill bit (always centered)
- **Red Dashed Line** - Target path
- **Green Zone** - Acceptable deviation (±30 ft)
- **Deviation Readout** - Distance from target in feet

### Status Display (Bottom)
- **COST** - Total well cost in USD
- **STATUS** - Current operation (READY/DRILLING/TRIPPING/KICK CONTROL)
- **BIT HEALTH** - Bit condition (0-100%)
- **MOTOR HEALTH** - Motor condition (0-100%)
- **KICK RISK** - Probability of kick occurrence
- **MOTOR SPIKES** - Count of DP spikes (warning at 15+)
- **MUD LOSSES** - Current loss rate in bbl/hr
- **LCM** - Current LCM concentration in lb/bbl
- **FORMATION** - Current geological formation
- **ECD** - Equivalent Circulating Density in ppg
- **TIME** - Game time (Day X HH:MM)
- **SLIDE FT %** - Percentage of well drilled while sliding

### Mode Indicator (Right Side)
Shows current drilling mode:
- **ROTATING** (Green) - Normal drilling with passive drift
- **SLIDING LEFT/RIGHT** (Yellow) - Active directional control
- **MOTOR STALLED** (Red) - Motor overloaded, reduce WOB
- **KICK CONTROL** (Red) - Managing formation influx

### Speech Bubbles (Bottom Left)
Crew commentary with character portraits:
- Formation warnings
- Casing point reminders
- Equipment status updates
- Sarcastic engineer comments
- Movie quotes (Armageddon well)

## 🎲 Gameplay Strategy

### Optimal Drilling
1. **Start Conservative**: Begin with moderate WOB (40-50 klbs) and normal flow (550 gpm)
2. **Monitor DP**: Keep differential pressure below 1,200 psi (80% of max)
3. **Adjust for Formation**: Increase WOB in hard rock, manage flow for ECD control
4. **Plan Ahead**: Watch for formation transitions and adjust parameters early

### Flow Rate Management
1. **Normal Flow (550 gpm)**: Baseline performance, moderate ECD
2. **High Flow (750+ gpm)**: Faster ROP, higher ECD (helps prevent kicks, may cause losses)
3. **Low Flow (<500 gpm)**: Slower ROP, motor struggles, more stalls and flops
4. **Balance**: Adjust flow based on kick risk vs loss risk

### Directional Control
1. **Rotate in Vertical Sections**: Faster ROP, less control needed
2. **Slide in Build Sections**: Slower but precise directional control
3. **Watch Formation Drift**: Each formation has characteristic drift tendencies
4. **Stay in the Green**: Keep deviation under 30 ft to avoid NPV penalties

### Mud Weight Management
1. **Start at Normal Pressure**: Begin at formation's normal pressure MW
2. **Account for ECD**: Total MW = Base MW + LCM contribution + ECD
3. **Increase for Kicks**: Raise MW or flow if kick risk exceeds 50%
4. **Decrease for Losses**: Lower MW or flow if losses exceed 100 bbl/hr
5. **Use LCM Wisely**: Add LCM to heal losses without reducing base MW

### Cost Optimization
1. **Minimize Trips**: Manage bit health and motor health to avoid premature failures
2. **Prevent Kicks**: Cheaper to maintain proper MW than control kicks
3. **Control Losses**: LCM costs less than lost mud over time
4. **Stay On Target**: Deviation penalties add up quickly
5. **Optimize Flow**: Higher flow = faster drilling but higher costs if losses occur

## 🏗️ Technical Architecture

### Modular Structure
```
roll-coal-make-hole/
├── index.html              # Main game HTML
├── CHANGELOG.md            # Version history
├── README.md               # This file
├── css/
│   └── styles.css         # All game styling
├── images/
│   ├── title-screen.png   # Main menu artwork
│   ├── well-*.png         # Well selection images (6)
│   └── portrait-*.png     # Character portraits (15)
└── js/
    ├── config/
    │   ├── version.js     # Version tracking
    │   ├── constants.js   # Game constants and limits
    │   └── wellConfigs.js # 6 well configurations
    ├── core/
    │   ├── GameState.js   # Game state management
    │   ├── GameEngine.js  # Main game loop and logic
    │   └── DrillingMechanics.js # Physics calculations
    ├── rendering/
    │   ├── Renderer.js    # Main canvas rendering
    │   ├── Recorder.js    # Strip chart rendering
    │   └── DrillingWindow.js # Directional window
    ├── ui/
    │   ├── UIManager.js   # HUD updates and warnings
    │   ├── SpeechBubble.js # Crew commentary system
    │   └── MenuManager.js # Menus and high scores
    └── main.js            # Game initialization
```

### Key Classes

**GameEngine** - Main game loop, event handling, and state coordination

**GameState** - Centralized state management for all game variables

**DrillingMechanics** - Static methods for physics calculations (ROP, damage, DP, ECD, etc.)

**Renderer** - Main canvas drawing (formations, drill string, target path)

**Recorder** - Strip chart visualization with scrolling data logs

**DrillingWindow** - Top-down directional view

**UIManager** - HUD updates and popup warnings

**SpeechBubble** - Crew commentary system with portraits

**MenuManager** - Menus, well selection, and high score management

## 🛠️ Adding New Wells

Edit `js/config/wellConfigs.js` to add custom well configurations. Each well needs:

- **name**: Display name
- **targetDepth**: Total measured depth (ft)
- **normalPressureMW**: Base pore pressure (ppg)
- **casingPoints**: Array of casing strings with depths and costs
- **targetPath**: Array of waypoints defining wellbore trajectory
- **formations**: Array of geological layers with properties

See existing wells for examples.

## 📈 Game Statistics

- **Total Lines of Code**: ~3,500+
- **JavaScript**: ~2,800 lines (80%)
- **HTML/CSS**: ~500 lines (14%)
- **Documentation**: ~200 lines (6%)
- **Playable Wells**: 6
- **Unique Formations**: 60+
- **Character Portraits**: 15

## 🎓 Learning Objectives

This simulator teaches:
- **Drilling Operations**: Real-world drilling parameter relationships
- **Risk Management**: Balancing speed, safety, and cost
- **Problem Solving**: Diagnosing and responding to drilling issues
- **Resource Management**: Optimizing consumables and time
- **Directional Drilling**: Understanding wellbore trajectory control
- **Hydraulics**: Flow rate, ECD, and pressure management

## 🚀 Installation

1. Download all files maintaining the folder structure
2. Open `index.html` in a modern web browser
3. No build process, dependencies, or server required!

## 🎮 Recommended Browsers

- Chrome/Edge (Recommended)
- Firefox
- Safari

## 🏆 Winning Strategy

A successful well typically requires:
- **Final Cost**: Under $2,000,000 for most wells
- **Bit Trips**: 3-6 trips maximum
- **Motor Spikes**: Under 10 spikes
- **Slide Percentage**: 15-30% of total depth
- **Deviation**: Stay within ±30 ft of target
- **Time**: Complete in 5-10 game days
- **Flow Management**: Optimize for formation conditions

## 📝 Version History

**Current Version**: 1.2.0

### v1.2.0 - Flow Rate System & Speech Bubbles
- Flow rate control system (400-1000 gpm)
- ECD calculations affecting kicks and losses
- Speech bubble system with 15 character portraits
- 6 playable wells including Armageddon
- Adjusted ROP/DP balance for better gameplay
- New controls and UI improvements

### v1.1.0 - Five Wells & Casing System
- 5 playable wells across major US basins
- Casing system with surface/intermediate/production strings
- Toast notification system
- Improved motor mechanics
- High score display on well selection

### v1.0.0 - Initial Release
- Core drilling mechanics
- 2 playable wells
- Basic UI and controls

## 🤝 Contributing

This is an educational project. Feel free to:
- Add new well configurations
- Create additional formations
- Implement new drilling challenges
- Enhance visual effects
- Add sound effects
- Create difficulty levels

## 📄 License

Free to use, modify, and distribute for educational purposes.

## 🎯 Future Enhancements

Potential additions:
- Global online leaderboards
- Multiple mud types with different properties
- Wellbore stability issues
- Stuck pipe scenarios
- Logging while drilling (LWD) data
- Geosteering based on formation tops
- Multiplayer competitive mode
- Achievement system
- Sound effects and music
- Mobile touch controls

## 🎬 Credits

**Armageddon Well** features dialogue from the 1998 film "Armageddon" directed by Michael Bay.

---

**Play Now:** https://beaubromley.github.io/roll-coal-make-hole/

**Source Code:** https://github.com/beaubromley/roll-coal-make-hole

**Enjoy drilling! Remember: Roll coal, make hole.** 🛢️⚡   
 