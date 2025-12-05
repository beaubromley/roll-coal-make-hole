// js/ui/SpeechBubble.js

class SpeechBubble {
    static activeBubbles = [];
    static lastShownTime = {}; // Track last time each event was shown
    static COOLDOWN_MS = 10000; // 10 seconds cooldown
    
    static messages = {
		powder: {
			beforeCasing1: [],
			atCasing1: [
				{ speaker: "BLM Inspector", portrait: "portrait-inspector.png", message: "I'll be watching your cement job!" }
			],
			foxHills: [
				{ speaker: "BLM Inspector", portrait: "portrait-inspector.png", message: "Fox Hills ahead! Protect the beloved." }
			],
			foxHillsLosses: [
				{ speaker: "Mud Engineer", portrait: "portrait-mudengineer.png", message: "At this rate, I'm gettin' my bonus. Keep it up!" }
			],
			teapotLosses: [
				{ speaker: "Mud Engineer", portrait: "portrait-mudengineer.png", message: "Teapot's leaking more than my ol' man at night." }
			],
			parkmanLosses: [
				{ speaker: "Mud Engineer", portrait: "portrait-mudengineer.png", message: "Parkman's drinking mud like it's happy hour." }
			],
			motivation: [
				{ speaker: "BU VP", portrait: "portrait-manager.png", message: "YOU PLAY TO WIN THE GAME." }
			],
			trust: [
				{ speaker: "Engineering Supervisor", portrait: "portrait-supervisor.png", message: "Trust the engineering." }
			],
            beforeCasing2: [],
            atCasing2: [],
            curveStart: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Curve's coming up. Can I kick off early? 100 ft? 200 ft?" }
            ],
            toolfaceFlop: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Toolface is floppin' like a fish outta water. Motor's gettin' weak!" }
            ],
            beforeTD: [],
            atTD: [
                { speaker: "Superintendent", portrait: "portrait-superintendent.png", message: "Have you done the 39-step pill spotting calc yet?" }
            ]
        },
        
        williston: {
            beforeCasing1: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Casing point's coming up. Don't forget to stop." }
            ],
            atCasing1: [
                { speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "This 9-5/8\" is praying we don't see Dakota flows." }
            ],
            kibbey: [
                { speaker: "Mud Logger", portrait: "portrait-mudlogger.png", message: "Kibbey formation! Bits go in, paper weights come out." }
            ],
            missionLosses: [
                { speaker: "Mud Engineer", portrait: "portrait-mudengineer.png", message: "Mission Canyon's weak over here." }
            ],
            curveStart: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Curve time! Can I kick off early, or you wanna trust geosteering?" }
            ],
            toolfaceFlop: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Toolface is floppin' more than a pancake at IHOP." }
            ],
            beforeCasing2: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Casing point's near. Don't mess up." }
            ],
            atCasing2: [
                { speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "Engineers said set casing here, so get ready to move it tomorrow." }
            ],
            geosteering: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Geosteering says we might be high or we might be low." }
            ],
            seismic: [
                { speaker: "Geophysicist", portrait: "portrait-geophysicist.png", message: "Hey did you guys know we had seismic?" }
            ],
            beforeTD: [],
            atTD: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Good well, men." }
            ]
        },
        
        eagleford: {
            beforeCasing1: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Casing point's coming up." }
            ],
            atCasing1: [],
            surfaceRecord: [
                { speaker: "DUTCHMAN", portrait: "portrait-engineer.png", message: "Congrats on a new surface hole record!" }
            ],
            flexure: [
                { speaker: "Geophysicist", portrait: "portrait-geophysicist.png", message: "Don't get flexed on by that flexure." }
            ],
            midway: [
                { speaker: "Mud Engineer", portrait: "portrait-mudengineer.png", message: "Midway's up. I think we may lose here sometimes." }
            ],
            stepout: [
                { speaker: "Engineering Supervisor", portrait: "portrait-supervisor.png", message: "Stepouts don't matter." }
            ],
            curveStart: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Long curve ahead. Can I kick off early, or you wanna risk it?" }
            ],
            slideFaster: [
                { speaker: "Engineering Manager", portrait: "portrait-manager.png", message: "Slide faster..." }
            ],
            slideInitiated: [],
            beforeTD: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Don't miss that depth. Can't stop here." }
            ],
            atTD: [
                { speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "Hex Grip don't fail me now. Lotta pipe to lay down." }
            ]
        },
        
        stack: {
            beforeCasing1: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Why do we always set pipe at 1,500 ft?" }
            ],
            curveStart: [],
            beforeCasing2: [],
            atCasing2: [
                { speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "We used to set into the curve with those other guys." }
            ],
            rcmh: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Roll Coal Make Hole, almost at TD!" }
            ],
            whisperer: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Where's that Woodford Whisperer when you need him?" }
            ],
            beforeTD: [],
            atTD: []
        },
        
        delaware: {
            beforeCasing1: [],
            atCasing1: [
                { speaker: "BLM Inspector", portrait: "portrait-inspector.png", message: "Yesss... the Rustler. My work here is done." }
            ],
            curveStart: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Deep curve coming up. Can I kick off early, or you wanna steer?" }
            ],
            beforeCasing2: [],
            atCasing2: [],
            beforeTD: [],
            atTD: [
                { speaker: "Engineer", portrait: "portrait-engineer.png", message: "I'm gonna have to update this WCDM." }
            ]
        },
        
        armageddon: [
            { depth: 50, speaker: "President", portrait: "portrait-president.png", message: "We are faced with the very gravest of challenges." },
            { depth: 100, speaker: "Chick", portrait: "portrait-chick.png", message: "You know, Harry, I swore I'd never drill again after that last one." },
            { depth: 200, speaker: "Bear", portrait: "portrait-bear.png", message: "You stick that drill in the ground, and you make it sing!" },
            { depth: 250, speaker: "Rockhound", portrait: "portrait-rockhound.png", message: "I'm not crazy, I'm just a little unwell." },
            { depth: 300, speaker: "Max", portrait: "portrait-max.png", message: "I got a bad feeling about this rock, Harry." },
            { depth: 400, speaker: "Harry Stamper", portrait: "portrait-harry.png", message: "I can't do it alone, Colonel. I need your help." },
            { depth: 500, speaker: "Rockhound", portrait: "portrait-rockhound.png", message: "Guess what guys, it's time to embrace the horror! Look, we've got front row tickets to the end of the earth!" },
            { depth: 600, speaker: "Chick", portrait: "portrait-chick.png", message: "Harry, you ever miss a depth?" },
            { depth: 650, speaker: "Harry Stamper", portrait: "portrait-harry.png", message: "Not once, Chick. Not once." },
            { depth: 700, speaker: "Bear", portrait: "portrait-bear.png", message: "If this thing blows, I want my last meal to be a Twinkie." },
            { depth: 750, speaker: "Harry Stamper", portrait: "portrait-harry.png", message: "I have been drilling holes in the earth for 30 years. And I have never, NEVER missed a depth that I have aimed for. And by God, I am not gonna miss this one, I will make 800 feet.", duration: 8000 },  // ADD duration: 10000 (10 seconds)
			{ depth: 798, speaker: "President", portrait: "portrait-president.png", message: "Mission accomplished. Godspeed, gentlemen." },
			{ depth: 799, speaker: "Harry Stamper", portrait: "portrait-harry.png", message: "Yeah one more thing, um... none of them wanna pay taxes again." }
        ],
        
		general: {
			bitDull: [
				{ speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "If you make this bit last 2 more hours, my relief said he'd love to trip it." },
				{ speaker: "Superintendent", portrait: "portrait-superintendent.png", message: "This bit isn't gonna make it. Y'all running with the bull or something?" }
			],
			bitTrip: [
				{ speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "If I trip one more time, I'm going to work at Starbucks." },
				{ speaker: "Company Man", portrait: "portrait-companyman.png", message: "Can't make hole off bottom!" }
			],
			deviationWarning: [
				{ speaker: "Well Planner", portrait: "portrait-wellplanner.png", message: "Are you even paying attention to my directional plan?" }
			],
            motorWeak: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Motor's gettin' weak, can't hold toolface worth a dang." },
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Motor's got less grip than a greased pig." }
            ],
            slideInitiated: [
                { speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Why don't you try AutoSlide. I'm done." },
				{ speaker: "Directional Driller", portrait: "portrait-directional.png", message: "Can I interest you in a RSS? Only 10 easy payments of LIH." }
            ],
            lossesModerate: [
                { speaker: "Mud Engineer", portrait: "portrait-mudengineer.png", message: "At this rate, I'm gettin' my bonus. Keep it up!" }
            ],
            lossesHeavy: [
                { speaker: "Mud Engineer", portrait: "portrait-mudengineer.png", message: "I'm about to start selling mud futures." }
            ],
            gasDetected: [
                { speaker: "Company Man", portrait: "portrait-companyman.png", message: "Gas! Don't make me call the incident command." }
            ],
            beforeCasing: [],
            atTD: [
                { speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "TD! Y'all paying bonuses yet?" }
            ],
            // ============================================================================
            // INSTABILITY WARNINGS (severity-based)
            // ============================================================================
            instabilityMinor: [
                { speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "I'm seeing some shale slivers at the shakers." }
            ],
            instabilityModerate: [
                { speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "We have some chunky shale coming across. I'll grab some samples." }
            ],
            instabilitySevere: [
                { speaker: "Floorhand", portrait: "portrait-floorhand.png", message: "HEY MAN, THERE ARE FULL SKOAL CANS AT THE SHAKERS!" }
            ]
        }
    };
	

	// Depth-based triggers (organized by well)
	static depthTriggers = {
		powder: [
			{ depth: 9400, event: 'curveStart', range: 50 },
			{ depth: 12000, event: 'trust', range: 50 },
			{ depth: 15000, event: 'motivation', range: 50 }
		],
		williston: [
			{ depth: 10651, event: 'curveStart', range: 50 },
			{ depth: 16000, event: 'geosteering', range: 50 },
			{ depth: 18000, event: 'seismic', range: 50 }
		],
		eagleford: [
			{ depth: 4600, event: 'surfaceRecord', range: 50 },
			{ depth: 6200, event: 'stepout', range: 50 },
			{ depth: 7000, event: 'midway', range: 50 },
			{ depth: 11000, event: 'flexure', range: 50 },
			{ depth: 12300, event: 'curveStart', range: 50 }
		],
		stack: [
			{ depth: 9600, event: 'curveStart', range: 50 },
			{ depth: 12200, event: 'whisperer', range: 50 },
			{ depth: 19900, event: 'rcmh', range: 50 }
		],
		delaware: [
			{ depth: 11400, event: 'curveStart', range: 50 }
		]
	};

	// Formation-based triggers (organized by well)
	static formationTriggers = {
		powder: [
			{ formationName: 'Fox Hills', event: 'foxHills' }
		],
		williston: [
			{ formationName: 'Kibbey', event: 'kibbey' }
		]
	};

	static checkFormationTriggers(wellType, formation, speechTriggered) {
		const triggers = this.formationTriggers[wellType];
		if (!triggers) return;
		
		for (let trigger of triggers) {
			const triggerKey = trigger.event;
			
			if (formation.name === trigger.formationName && !speechTriggered[triggerKey]) {
				speechTriggered[triggerKey] = true;
				this.show(wellType, trigger.event);
			}
		}
	}

	static checkDepthTriggers(wellType, currentDepth, speechTriggered) {
		const triggers = this.depthTriggers[wellType];
		if (!triggers) return;
		
		for (let trigger of triggers) {
			const triggerKey = `${trigger.event}_${trigger.depth}`;
			
			if (currentDepth >= trigger.depth && 
				currentDepth < trigger.depth + trigger.range && 
				!speechTriggered[triggerKey]) {
				
				speechTriggered[triggerKey] = true;
				this.show(wellType, trigger.event);
			}
		}
	}

	static show(wellType, eventType, customData = null) {
		// Check cooldown (SKIP for Armageddon)
		if (wellType !== 'armageddon') {
			const cooldownKey = `${wellType}_${eventType}`;
			const now = Date.now();
			
			if (this.lastShownTime[cooldownKey]) {
				const timeSinceLastShown = now - this.lastShownTime[cooldownKey];
				if (timeSinceLastShown < this.COOLDOWN_MS) {
					return; // Still in cooldown, don't show
				}
			}
			
			// Update last shown time
			this.lastShownTime[cooldownKey] = now;
		}
		
		let messageData;
		
		if (wellType === 'armageddon') {
			const armageddonMessages = this.messages.armageddon;
			const depth = customData?.depth || 0;
			
			const depthMessages = armageddonMessages.filter(m => m.depth === Math.floor(depth));
			if (depthMessages.length > 0) {
				messageData = depthMessages[Math.floor(Math.random() * depthMessages.length)];
			} else {
				return;
			}
		} else {
			const wellMessages = this.messages[wellType];
			const generalMessages = this.messages.general;
			
			let messageArray = wellMessages?.[eventType] || generalMessages?.[eventType];
			
			if (!messageArray || messageArray.length === 0) return;
			
			messageData = messageArray[Math.floor(Math.random() * messageArray.length)];
		}
		
		if (!messageData) return;

		// Get custom duration if specified
		const duration = messageData.duration || 5000;

		this.createBubble(messageData, duration);
	}

    static createBubble(data, customDuration = 5000) {
		const bubble = document.createElement('div');
		bubble.className = 'speech-bubble';
		
		const portrait = document.createElement('img');
		portrait.src = `images/${data.portrait}`;
		portrait.className = 'speech-portrait';
		portrait.onerror = () => { portrait.style.display = 'none'; };
		
		const content = document.createElement('div');
		content.className = 'speech-content';
		
		const speaker = document.createElement('div');
		speaker.className = 'speech-speaker';
		speaker.innerText = data.speaker.toUpperCase();
		
		const message = document.createElement('div');
		message.className = 'speech-message';
		message.innerText = data.message;
		
		content.appendChild(speaker);
		content.appendChild(message);
		
		bubble.appendChild(portrait);
		bubble.appendChild(content);
		
		// Add to active bubbles array
		this.activeBubbles.push(bubble);
		
		// Position bubble based on stack
		this.updateBubblePositions();
		
		document.getElementById('game-container').appendChild(bubble);
		
		// Click to dismiss
		bubble.style.cursor = 'pointer';
		bubble.addEventListener('click', () => {
			this.dismissBubble(bubble);
		});
		
		// Auto-remove after custom duration
		const autoRemoveTimeout = setTimeout(() => {
			this.dismissBubble(bubble);
		}, customDuration);  // CHANGED: use parameter instead of hardcoded 5000
		
		// Store timeout so we can cancel it if manually dismissed
		bubble.autoRemoveTimeout = autoRemoveTimeout;
	}

	static dismissBubble(bubble) {
		// Cancel auto-remove timeout if it exists
		if (bubble.autoRemoveTimeout) {
			clearTimeout(bubble.autoRemoveTimeout);
		}
		
		// Remove from DOM
		bubble.remove();
		
		// Remove from active bubbles array
		const index = this.activeBubbles.indexOf(bubble);
		if (index > -1) {
			this.activeBubbles.splice(index, 1);
			this.updateBubblePositions();
		}
	}
    static updateBubblePositions() {
        // Stack bubbles from bottom up
        let currentBottom = 250;
        
        this.activeBubbles.forEach((bubble, index) => {
            bubble.style.bottom = currentBottom + 'px';
            currentBottom += bubble.offsetHeight + 10; // 10px gap between bubbles
        });
    }
}
