\# Deep Well Operations Simulator



A retro-style 8-bit drilling simulator game built with vanilla JavaScript and HTML5 Canvas. Experience the challenges of directional drilling, manage drilling parameters, and navigate complex subsurface conditions to reach total depth while minimizing costs.



\## 🎮 Game Overview



Take control of a drilling operation and navigate through various geological formations while managing multiple drilling parameters. Balance speed, cost, safety, and directional control to successfully reach your target depth.



\## ✨ Features



\### Drilling Mechanics

\- \*\*Realistic ROP Calculations\*\*: Rate of Penetration varies by formation hardness, Weight on Bit (WOB), and mud weight

\- \*\*Bit Wear System\*\*: Bits degrade over time based on WOB and formation abrasiveness

\- \*\*Directional Drilling\*\*: Switch between rotating and sliding modes to steer the wellbore

\- \*\*Formation-Based Drift\*\*: Different rock types cause predictable directional tendencies



\### Mud Motor Management

\- \*\*Differential Pressure Monitoring\*\*: Track motor performance in real-time

\- \*\*Motor Stalls\*\*: Excessive DP stops drilling until WOB is reduced

\- \*\*DP Spikes\*\*: Random pressure spikes damage motor health

\- \*\*Motor Failure\*\*: After 15-20 spikes, motors fail requiring expensive trips



\### Mud System

\- \*\*Mud Weight Control\*\*: Adjust between 8.0 - 17.0 ppg

\- \*\*Kick Prevention\*\*: Maintain proper mud weight to prevent formation fluid influx

\- \*\*Mud Losses\*\*: High mud weight can cause losses in permeable zones

\- \*\*LCM System\*\*: Add Lost Circulation Material (0-100 lb/bbl) to heal losses



\### Hazards \& Events

\- \*\*Kicks\*\*: Formation pressure exceeds hydrostatic pressure (more common below 8,000 ft)

\- \*\*Mud Losses\*\*: Occur in specific zones when MW exceeds formation fracture gradient

\- \*\*Bit Failures\*\*: Worn bits require trips to surface for replacement

\- \*\*Motor Failures\*\*: Damaged motors require trips and replacement



\### Visual Systems

\- \*\*8-Bit Drilling Recorder\*\*: Real-time strip chart showing Depth, ROP, WOB, and Diff Pressure

\- \*\*Drilling Window\*\*: Top-down view showing bit position relative to target path

\- \*\*Formation Transitions\*\*: See upcoming formations before drilling into them

\- \*\*Directional Path\*\*: Visual red line showing target wellbore trajectory



\### Economics

\- \*\*Daily Spread Rate\*\*: $80,000/day operational costs

\- \*\*Trip Costs\*\*: $25,000 bit + $15,000 motor per trip

\- \*\*Mud Costs\*\*: $100/bbl for lost mud

\- \*\*LCM Costs\*\*: $2/lb for lost circulation material

\- \*\*NPV Penalties\*\*: Deviation from planned path reduces well value

\- \*\*Kick Costs\*\*: Time-based penalties for well control operations



\## 🎯 Controls



\### Drilling Operations

\- \*\*UP/DOWN ARROWS\*\* - Increase/Decrease Weight on Bit (0-80 klbs)

\- \*\*A\*\* - Slide Left (slower ROP, active steering)

\- \*\*S\*\* - Rotate (normal ROP, passive drift)

\- \*\*D\*\* - Slide Right (slower ROP, active steering)



\### Mud System

\- \*\*M/N\*\* - Increase/Decrease Mud Weight (8.0-17.0 ppg)

\- \*\*I/K\*\* - Increase/Decrease LCM Concentration (0-100 lb/bbl)



\### Game Controls

\- \*\*P\*\* - Pause/Resume

\- \*\*R\*\* - Restart Game



\## 📊 HUD Elements



\### Digital Readouts (Top)

\- \*\*DEPTH\*\* - Current measured depth in feet

\- \*\*ROP\*\* - Rate of Penetration in ft/hr

\- \*\*WOB\*\* - Weight on Bit in klbs (color-coded: green 15-45, red >45)

\- \*\*DIFF PRESS\*\* - Motor differential pressure in psi (color-coded by threshold)

\- \*\*MUD WT\*\* - Current mud weight in ppg



\### Drilling Recorder (Top Left)

Real-time strip chart displaying:

\- \*\*Cyan Line\*\* - Depth progression

\- \*\*Green Line\*\* - Rate of Penetration

\- \*\*Yellow Line\*\* - Weight on Bit

\- \*\*Magenta Line\*\* - Differential Pressure (with 80% threshold line)



\### Drilling Window (Left Side)

Top-down view showing:

\- \*\*White Triangle\*\* - Drill bit (always centered)

\- \*\*Red Vertical Line\*\* - Target path

\- \*\*Green Zone\*\* - Acceptable deviation (±30 ft)

\- \*\*Deviation Readout\*\* - Distance from target in feet



\### Status Display (Bottom)

\- \*\*COST\*\* - Total well cost in USD

\- \*\*STATUS\*\* - Current operation (READY/DRILLING/TRIPPING/KICK CONTROL)

\- \*\*BIT HEALTH\*\* - Bit condition (0-100%)

\- \*\*MOTOR HEALTH\*\* - Motor condition (0-100%)

\- \*\*KICK RISK\*\* - Probability of kick occurrence

\- \*\*MOTOR SPIKES\*\* - Count of DP spikes (warning at 15+)

\- \*\*MUD LOSSES\*\* - Current loss rate in bbl/hr

\- \*\*LCM\*\* - Current LCM concentration in lb/bbl

\- \*\*FORMATION\*\* - Current geological formation

\- \*\*TIME\*\* - Game time (Day X HH:MM)

\- \*\*SLIDE FT %\*\* - Percentage of well drilled while sliding

\- \*\*SLIDE TIME %\*\* - Percentage of drilling time spent sliding



\### Mode Indicator (Right Side)

Shows current drilling mode:

\- \*\*ROTATING\*\* (Green) - Normal drilling with passive drift

\- \*\*SLIDING LEFT/RIGHT\*\* (Yellow) - Active directional control

\- \*\*MOTOR STALLED\*\* (Red) - Motor overloaded, reduce WOB

\- \*\*KICK CONTROL\*\* (Red) - Managing formation influx



\## 🎲 Gameplay Strategy



\### Optimal Drilling

1\. \*\*Start Conservative\*\*: Begin with moderate WOB (20-30 klbs) to assess formation

2\. \*\*Monitor DP\*\*: Keep differential pressure below 1,600 psi (80% of max)

3\. \*\*Adjust for Formation\*\*: Increase WOB in hard rock, decrease in soft formations

4\. \*\*Plan Ahead\*\*: Watch for formation transitions and adjust parameters early



\### Directional Control

1\. \*\*Rotate in Vertical Sections\*\*: Faster ROP, less control needed

2\. \*\*Slide in Build Sections\*\*: Slower but precise directional control

3\. \*\*Watch Formation Drift\*\*: Each formation has characteristic drift tendencies

4\. \*\*Stay in the Green\*\*: Keep deviation under 30 ft to avoid NPV penalties



\### Mud Weight Management

1\. \*\*Start at Normal Pressure\*\*: Begin at formation's normal pressure MW

2\. \*\*Increase for Kicks\*\*: Raise MW if kick risk exceeds 50%

3\. \*\*Decrease for Losses\*\*: Lower MW if losses exceed 100 bbl/hr

4\. \*\*Use LCM Wisely\*\*: Add LCM to heal losses without reducing MW



\### Cost Optimization

1\. \*\*Minimize Trips\*\*: Manage bit health to avoid premature failures

2\. \*\*Prevent Kicks\*\*: Cheaper to maintain proper MW than control kicks

3\. \*\*Control Losses\*\*: LCM costs less than lost mud over time

4\. \*\*Stay On Target\*\*: Deviation penalties add up quickly



\## 🏗️ Technical Architecture



\### Modular Structure



drilling-simulator/

├── index.html # Main game HTML

├── css/

│ └── styles.css # All game styling

├── js/

│ ├── config/

│ │ ├── constants.js # Game constants and limits

│ │ └── wellConfigs.js # Well configurations and formations

│ ├── core/

│ │ ├── GameState.js # Game state management

│ │ ├── GameEngine.js # Main game loop and logic

│ │ └── DrillingMechanics.js # Physics calculations

│ ├── rendering/

│ │ ├── Renderer.js # Main canvas rendering

│ │ ├── Recorder.js # Strip chart rendering

│ │ └── DrillingWindow.js # Directional window

│ ├── ui/

│ │ └── UIManager.js # UI updates and warnings

│ └── main.js # Game initialization

└── README.md



\### Key Classes



\*\*GameEngine\*\* - Main game loop, event handling, and state coordination



\*\*GameState\*\* - Centralized state management for all game variables



\*\*DrillingMechanics\*\* - Static methods for physics calculations (ROP, damage, DP, etc.)



\*\*Renderer\*\* - Main canvas drawing (formations, drill string, target path)



\*\*Recorder\*\* - Strip chart visualization with scrolling data logs



\*\*DrillingWindow\*\* - Top-down directional view



\*\*UIManager\*\* - HUD updates and popup warnings



\## 🛠️ Adding New Wells



Edit `js/config/wellConfigs.js` to add custom well configurations:



```javascript

myCustomWell: {

&nbsp;   name: "Custom Well Name",

&nbsp;   targetDepth: 12000,

&nbsp;   targetPath: \[

&nbsp;       { depth: 0,    x: 400 },

&nbsp;       { depth: 4000, x: 400 },

&nbsp;       { depth: 8000, x: 550 },

&nbsp;       { depth: 12000, x: 550 }

&nbsp;   ],

&nbsp;   formations: \[

&nbsp;       { 

&nbsp;           limit: 3000,

&nbsp;           name: "Formation Name",

&nbsp;           color: "#hexcolor",

&nbsp;           particle: "#hexcolor",

&nbsp;           hardness: 1.0,        // 0.2-5.0 (higher = slower drilling)

&nbsp;           abrasiveness: 1.0,    // 0.1-3.0 (higher = faster bit wear)

&nbsp;           driftTendency: 0.5,   // -1.0 to 1.0 (negative = left, positive = right)

&nbsp;           lossZone: { 

&nbsp;               start: 1500, 

&nbsp;               end: 1600, 

&nbsp;               maxMW: 11.5, 

&nbsp;               maxLossRate: 200 

&nbsp;           },

&nbsp;           kickZone: { 

&nbsp;               start: 2500, 

&nbsp;               end: 2700, 

&nbsp;               minMW: 10.5 

&nbsp;           }

&nbsp;       }

&nbsp;   ],

&nbsp;   normalPressureMW: 10.0

}



Then update GameEngine constructor to use your well:



javascript

this.wellConfig = WELL\_CONFIGS.myCustomWell;



📈 Game Statistics

Total Lines of Code: ~1,722

JavaScript: ~1,302 lines (76%)

HTML/CSS: ~370 lines (21%)

Documentation: ~50 lines (3%)

🎓 Learning Objectives

This simulator teaches:



Drilling Operations: Real-world drilling parameter relationships

Risk Management: Balancing speed, safety, and cost

Problem Solving: Diagnosing and responding to drilling issues

Resource Management: Optimizing consumables and time

Directional Drilling: Understanding wellbore trajectory control

🚀 Installation

Download all files maintaining the folder structure

Open index.html in a modern web browser

No build process, dependencies, or server required!

🎮 Recommended Browsers

Chrome/Edge (Recommended)

Firefox

Safari

🏆 Winning Strategy

A successful well typically requires:



Final Cost: Under $500,000

Bit Trips: 2-4 trips maximum

Motor Spikes: Under 10 spikes

Slide Percentage: 15-30% of total depth

Deviation: Stay within ±30 ft of target

Time: Complete in 3-5 game days

📝 Version History

Current Version: 1.0



Full drilling mechanics implementation

Mud motor and differential pressure system

Mud losses and LCM system

Kick detection and control

Formation-based directional drift

Real-time strip chart recorder

Directional drilling window

Economic tracking and penalties

🤝 Contributing

This is an educational project. Feel free to:



Add new well configurations

Create additional formations

Implement new drilling challenges

Enhance visual effects

Add sound effects

Create difficulty levels

📄 License

Free to use, modify, and distribute for educational purposes.



🎯 Future Enhancements

Potential additions:



Multiple mud types with different properties

Casing and cementing operations

Stuck pipe scenarios

Wellbore stability issues

Multiple bit types with different characteristics

Logging while drilling (LWD) data

Geosteering based on formation tops

Multiplayer competitive mode

Achievement system

Leaderboard for cost optimization

Enjoy drilling! Remember: Safety first, then efficiency, then speed.





This README now comprehensively covers all the features, mechanics, and technical details of your drilling simulator!



