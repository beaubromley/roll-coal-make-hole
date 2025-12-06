class GameEngine {
	constructor() {
		this.wellConfig = null;
		this.state = null;
		
		const gameCanvas = document.getElementById('gameCanvas');
		const recorderCanvas = document.getElementById('recorder-canvas');
		const drillingWindowCanvas = document.getElementById('drilling-window-canvas');
		
		this.renderer = new Renderer(gameCanvas);
		this.recorder = new Recorder(recorderCanvas);
		this.drillingWindow = new DrillingWindow(drillingWindowCanvas);
		this.setupEventListeners();
    
		// Initialize Driller's Console
		DrillersConsole.init(this);
		
		this.lossWarningShown = false;
		this.lossToastTimer = 0;
		this.gasFlowingToastTimer = 0;
		this.instabilityWarningShown = false;
		this.instabilityTimer = 0;
		this.instabilityFramesAccumulated = 0;
		this.currentInstabilitySeverity = 'none';
		this.isRunning = false;
		this.loopStarted = false;
		this.currentWellType = null;
		this.kickZoneTriggered = {};
		this.showTDAfterCasing = false;
		this.showArmageddonAfterAck = false;
	}

    loadWell(wellType) {
        this.currentWellType = wellType;
        this.wellConfig = WELL_CONFIGS[wellType];
        this.state = new GameState(this.wellConfig);
        this.lossWarningShown = false;
        this.lossToastTimer = 0;
        this.kickZoneTriggered = {};
		
		this.instabilityWarningShown = false;
		this.instabilityTimer = 0;
		this.instabilityFramesAccumulated = 0;
		this.currentInstabilitySeverity = 'none';

        this.isRunning = true;
        
        document.getElementById('start-prompt').style.display = 'block';
        document.getElementById('message').style.display = 'none';
        document.getElementById('deviation-warning').style.display = 'none';
        
        if (!this.loopStarted) {
            this.loopStarted = true;
            this.loop();
        }
    }

	setupEventListeners() {
		window.addEventListener('keydown', (e) => this.handleKeyDown(e));
		window.addEventListener('keyup', (e) => this.handleKeyUp(e));
		
		// OK button click handler
		document.getElementById('msg-ok-btn').addEventListener('click', () => {
			if (this.state && this.state.waitingForAcknowledge) {
				// Simulate SPACE key press
				const event = new KeyboardEvent('keydown', { code: 'Space' });
				this.handleKeyDown(event);
			}
		});
	}

    handleKeyDown(e) {
        if (!this.isRunning) return;

        if (e.code === 'ArrowUp') {
            if (this.state) {
                if (this.state.wob < CONSTANTS.MAX_WOB) this.state.wob++;
                if (!this.state.hasStarted && this.state.wob > 0) {
                    this.state.hasStarted = true;
                    document.getElementById('start-prompt').style.display = 'none';
                }
            }
            return;
        }
        if (e.code === 'ArrowDown') {
            if (this.state && this.state.wob > 0) this.state.wob--;
            return;
        }

        // Mud Weight: T = increase, G = decrease
        if (e.code === 'KeyT') {
            if (this.state) {
                const newMW = Math.min(CONSTANTS.MAX_MUD_WEIGHT, this.state.baseMudWeight + 0.1);
                const mwChange = Math.abs(newMW - this.state.baseMudWeight);
                this.state.totalCost += (mwChange / 0.1) * CONSTANTS.MW_CHANGE_COST;
                this.state.baseMudWeight = newMW;
                this.updateTotalMudWeight();
            }
            return;
        }
        if (e.code === 'KeyG') {
            if (this.state) {
                const newMW = Math.max(8.0, this.state.baseMudWeight - 0.1);
                const mwChange = Math.abs(newMW - this.state.baseMudWeight);
                this.state.totalCost += (mwChange / 0.1) * CONSTANTS.MW_CHANGE_COST;
                this.state.baseMudWeight = newMW;
                this.updateTotalMudWeight();
            }
            return;
        }

        // LCM: Y = increase, H = decrease
        if (e.code === 'KeyY') {
            if (this.state) {
                const newLCM = Math.min(100, this.state.lcmConcentration + 5);
                const lcmAdded = newLCM - this.state.lcmConcentration;
                
                const lcmCost = (lcmAdded / 10) * CONSTANTS.LCM_COST_PER_10_LB;
                this.state.totalCost += lcmCost;
                
                this.state.lcmConcentration = newLCM;
                this.updateTotalMudWeight();
            }
            return;
        }
        if (e.code === 'KeyH') {
            if (this.state) {
                const newLCM = Math.max(0, this.state.lcmConcentration - 5);
                this.state.lcmConcentration = newLCM;
                this.updateTotalMudWeight();
            }
            return;
        }

        // Flow Rate: R = increase, F = decrease
        if (e.code === 'KeyR') {
            if (this.state) {
                this.state.flowRate = Math.min(CONSTANTS.MAX_FLOW_RATE, this.state.flowRate + CONSTANTS.FLOW_INCREMENT);
            }
            return;
        }
        if (e.code === 'KeyF') {
            if (this.state) {
                this.state.flowRate = Math.max(CONSTANTS.MIN_FLOW_RATE, this.state.flowRate - CONSTANTS.FLOW_INCREMENT);
            }
            return;
        }

		if (this.state && this.state.waitingForAcknowledge && e.code === 'Space') {
			this.state.waitingForAcknowledge = false;
			this.state.isPaused = false;
			UIManager.hideMessage();
			
			if (this.showTDAfterCasing) {
				this.showTDAfterCasing = false;
				setTimeout(() => {
					this.endGame(true);
				}, 100);
				return;
			}
			
			// NEW: Handle Armageddon victory transition
			if (this.showArmageddonAfterAck) {
				this.showArmageddonAfterAck = false;
				setTimeout(() => {
					this.showArmageddonVictory();
				}, 100);
				return;
			}
			
			// Handle trip after stuck pipe
			if (this.state.needsTrip) {
				this.state.needsTrip = false;
				this.startTrip('stuck');
				return;
			}
			
			return;
		}

        if (e.code === 'KeyP') {
            if (this.state && this.state.hasStarted && !this.state.isGameOver && !this.state.waitingForAcknowledge) {
                this.state.isPaused = !this.state.isPaused;
                UIManager.togglePause(this.state.isPaused);
            }
            return;
        }

        // ESC to quit to menu
        if (e.code === 'Escape') {
            if (this.state && this.state.hasStarted && !this.state.isGameOver) {
                MenuManager.quitToMenu();
            }
            return;
        }

        if (!this.state || this.state.isPaused || this.state.waitingForAcknowledge) return;

        if (e.code === 'KeyA') {
            this.state.drillingMode = 'sliding';
            this.state.slideDirection = -1;
            this.resetSlideTimer();
            this.state.slideCount++;
            
            if (Math.random() < 0.1) {
                SpeechBubble.show(this.currentWellType, 'slideInitiated');
            }
            
            if (this.currentWellType === 'eagleford' && this.state.slideCount % 10 === 0) {
                SpeechBubble.show('eagleford', 'slideFaster');
            }
        }
        if (e.code === 'KeyD') {
            this.state.drillingMode = 'sliding';
            this.state.slideDirection = 1;
            this.resetSlideTimer();
            this.state.slideCount++;
            
            if (Math.random() < 0.1) {
                SpeechBubble.show(this.currentWellType, 'slideInitiated');
            }
            
            if (this.currentWellType === 'eagleford' && this.state.slideCount % 10 === 0) {
                SpeechBubble.show('eagleford', 'slideFaster');
            }
        }
        if (e.code === 'KeyS') {
            this.state.drillingMode = 'rotating';
            this.state.rotateDriftTimer = 0;
        }
    }

    handleKeyUp(e) {
        // No key-up actions needed
    }

    updateTotalMudWeight() {
        const lcmMWIncrease = (this.state.lcmConcentration / CONSTANTS.LCM_MW_INCREASE_RATIO) * 0.1;
        
        // Calculate ECD
        this.state.ecd = DrillingMechanics.calculateECD(this.state.flowRate, this.state.depth);
        
        // Total mud weight = base + LCM + ECD
        this.state.mudWeight = Math.min(CONSTANTS.MAX_MUD_WEIGHT, this.state.baseMudWeight + lcmMWIncrease + this.state.ecd);
    }

    resetSlideTimer() {
        const formation = DrillingMechanics.getFormation(this.state.depth, this.state.wellConfig.formations);
        const flopFactor = formation.toolfaceFlopFactor || 1.0;
        const flowFlopFactor = DrillingMechanics.calculateFlowFlopFactor(this.state.flowRate);
        
        const baseInterval = Math.floor(Math.random() * (10 * 60 - 1 * 60) + 1 * 60);
        this.state.slideChangeInterval = Math.floor(baseInterval / (flopFactor * flowFlopFactor));
        this.state.slideChangeTimer = 0;
    }

    reset() {
        this.state.reset();
        this.lossWarningShown = false;
        this.lossToastTimer = 0;
        this.gasFlowingToastTimer = 0; // ← ADD THIS LINE
        this.kickZoneTriggered = {};
		
		this.instabilityWarningShown = false;
		this.instabilityTimer = 0;
		this.instabilityFramesAccumulated = 0;
		this.currentInstabilitySeverity = 'none';
		
        UIManager.hideMessage();
        document.getElementById('deviation-warning').style.display = 'none';
        document.getElementById('start-prompt').style.display = 'block';
        document.getElementById('statusDisplay').innerText = "READY";
        UIManager.togglePause(false);
    }

	startTrip(reason = 'bit') {
		this.state.isTripping = true;
		this.state.tripReason = reason;  // Store reason for later
		
		const tripCost = CONSTANTS.BIT_ASSEMBLY_COST + CONSTANTS.MOTOR_COST;
		this.state.totalCost += tripCost;
		
		const actualTripHours = (this.state.depth / CONSTANTS.TRIP_SPEED_FT_PER_HR) * 2;
		const gameplayTripFrames = (actualTripHours * CONSTANTS.FRAMES_PER_GAME_HOUR) / CONSTANTS.TRIP_SPEED_MULTIPLIER;
		this.state.tripTimeRemaining = gameplayTripFrames;
		
		// ADD ACTUAL TRIP TIME TO GAME CLOCK
		const actualTripFrames = actualTripHours * CONSTANTS.FRAMES_PER_GAME_HOUR;
		this.state.gameFrameCount += actualTripFrames;
		
		document.getElementById('statusDisplay').innerText = "TRIPPING";
		
		SpeechBubble.show(this.currentWellType, 'bitTrip');
		
		// SHOW FAILURE MESSAGE
		this.state.waitingForAcknowledge = true;
		this.state.isPaused = true;
		
		let title = reason === 'motor' ? "MOTOR FAILURE" : (reason === 'stuck' ? "STUCK PIPE" : "BIT FAILURE");
		let failureType = reason === 'motor' ? 'Motor' : (reason === 'stuck' ? 'Stuck pipe' : 'Bit');
		let detail = `${failureType} failure at ${Math.floor(this.state.depth).toLocaleString()} ft\n\n` +
					`Trip cost: $${tripCost.toLocaleString()}\n` +
					`Trip time: ${actualTripHours.toFixed(1)} hours\n\n` +
					`Press SPACE to begin trip`;
		
		UIManager.showMessage(title, detail, '#f44336', false);
	}


	handleKickEvent(kickZone) {
		this.state.isKickActive = true;
		this.state.waitingForAcknowledge = true;
		this.state.isPaused = true;
		
		SpeechBubble.show(this.currentWellType, 'gasDetected');
		
		const kickDurationHours = (this.state.depth / 1000) * CONSTANTS.KICK_TIME_PER_1000FT;
		this.state.kickControlTimeRemaining = kickDurationHours * CONSTANTS.FRAMES_PER_GAME_HOUR;
		
		const kickCostPenalty = (kickDurationHours / 24) * CONSTANTS.SPREAD_RATE_PER_DAY;
		this.state.totalCost += kickCostPenalty;

		UIManager.showMessage(
			"KICK DETECTED!",
			`Gas kick at ${Math.floor(this.state.depth).toLocaleString()} ft!\n\n` +
			`Kill Weight Required: ${kickZone.minMW.toFixed(1)} ppg\n` +
			`Current MW (with ECD): ${this.state.mudWeight.toFixed(1)} ppg\n\n` +
			`YOU MUST INCREASE MUD WEIGHT TO PROCEED\n` +
			`Use [T] to raise MW or [R] to raise Flow\n\n` +
			`Control time: ${kickDurationHours.toFixed(1)} hours\n` +
			`Cost: $${kickCostPenalty.toLocaleString('en-US', { maximumFractionDigits: 0 })}\n\n` +
			`Press SPACE when MW is high enough`,
			'#ff1744',
			false
		);
	}

    handleLossEvent(lossZone) {
        if (!this.lossWarningShown) {
            this.lossWarningShown = true;
            this.state.waitingForAcknowledge = true;
            this.state.isPaused = true;
            
            UIManager.showMessage(
                "MUD LOSSES DETECTED!",
                `Losses at ${Math.floor(this.state.depth).toLocaleString()} ft\n\n` +
                `Loss Rate: ${Math.floor(this.state.currentLossRate)} bbl/hr\n` +
                `Max Safe MW: ${lossZone.maxMW.toFixed(1)} ppg\n` +
                `Current MW (with ECD): ${this.state.mudWeight.toFixed(1)} ppg\n\n` +
                `Reduce MW [G], Flow [F], or add LCM [Y]\n` +
                `Then press SPACE to continue`,
                '#ff9800',
                false
            );
        }
    }

    handleDPSpike() {
        const healthLoss = Math.floor(Math.random() * 6) + 5;
        this.state.motorHealth = Math.max(0, this.state.motorHealth - healthLoss);
        
        this.state.motorSpikeCount++;
        this.state.spikeMultiplier += 0.05;
        
        UIManager.showToast(
            `⚠ DP SPIKE!\n-${healthLoss}% Motor Health\nCurrent DP: ${Math.floor(this.state.diffPressure)} psi`,
            'error'
        );
    }

	handleMotorStall() {
		if (!this.state.isMotorStalled) {
			this.state.isMotorStalled = true;
			this.state.motorStallStartDepth = this.state.depth;
			this.state.motorSpikeCount++;
			this.state.wob = 0;
			
			// ADD MOTOR HEALTH DAMAGE FROM STALL
			const stallDamage = Math.floor(Math.random() * 11) + 10; // 10-20% damage
			this.state.motorHealth = Math.max(0, this.state.motorHealth - stallDamage);
			
			this.state.waitingForAcknowledge = true;
			this.state.isPaused = true;
			
			UIManager.showMessage(
				"MOTOR STALLED!",
				`Motor stalled at ${Math.floor(this.state.depth).toLocaleString()} ft\n\n` +
				`Current DP: ${Math.floor(this.state.diffPressure)} psi\n` +
				`Stall Threshold: ${Math.floor(CONSTANTS.MOTOR_STALL_DP / DrillingMechanics.calculateFlowStallFactor(this.state.flowRate))} psi\n` +
				`Motor Damage: -${stallDamage}%\n` +
				`WOB reset to 0 klbs\n\n` +
				`Reduce WOB or increase Flow [R]\n` +
				`Then press SPACE to continue drilling`,
				'#ff0000',
				false
			);
		}
	}

	handleStuckPipe(instabilityZone) {
		this.state.waitingForAcknowledge = true;
		this.state.isPaused = true;
		this.state.wob = 0;
		
		// Apply penalty
		this.state.totalCost += CONSTANTS.STUCK_PIPE_COST;
		
		// ADD TIME PENALTY: 3 days
		const stuckDays = 3;
		const stuckHours = stuckDays * 24;
		const stuckFrames = stuckHours * CONSTANTS.FRAMES_PER_GAME_HOUR;
		this.state.gameFrameCount += stuckFrames;
		
		// Destroy bit and motor
		this.state.bitHealth = 0;
		this.state.motorHealth = 0;
		
		// Find last casing depth
		let restartDepth = 0;
		for (let casing of this.state.wellConfig.casingPoints) {
			if (this.state.casingPointsReached.includes(casing.depth)) {
				restartDepth = casing.depth;
			}
		}
		
		const depthLost = Math.floor(this.state.depth - restartDepth);
		
		UIManager.showMessage(
			"STUCK PIPE!",
			`Wellbore instability at ${Math.floor(this.state.depth).toLocaleString()} ft\n\n` +
			`MW too low: ${this.state.mudWeight.toFixed(1)} ppg\n` +
			`Required: ${instabilityZone.minMW.toFixed(1)} ppg\n\n` +
			`Penalty: $${CONSTANTS.STUCK_PIPE_COST.toLocaleString()}\n` +
			`Time Lost: ${stuckDays} days\n` +
			`Depth Lost: ${depthLost.toLocaleString()} ft\n` +
			`Restart from: ${restartDepth.toLocaleString()} ft\n\n` +
			`Press SPACE to trip and restart drilling`,
			'#ff0000',
			false
		);
		
		// Reset to last casing depth
		this.state.depth = restartDepth;
		this.state.currentX = DrillingMechanics.getTargetPathX(restartDepth, this.state.wellConfig.targetPath);
		
		// Reset instability tracking
		this.instabilityWarningShown = false;
		this.instabilityTimer = 0;
		this.instabilityFramesAccumulated = 0;
		this.currentInstabilitySeverity = 'none';
		
		// Will trip on next space press
		this.state.needsTrip = true;
	}


	handleCasingPoint(casingPoint) {
		this.state.casingPointsReached.push(casingPoint.depth);
		
		this.state.waitingForAcknowledge = true;
		this.state.isPaused = true;
		this.state.wob = 0;
		
		this.state.bitHealth = 100;
		this.state.motorHealth = 100;
		this.state.motorSpikeCount = 0;
		this.state.spikeMultiplier = 1.0;
		
		this.state.totalCost += casingPoint.cost;

		// ADD TIME PENALTY: 2 hours per 1000 ft of depth
		const casingHours = (casingPoint.depth / 1000) * 2;
		const casingFrames = casingHours * CONSTANTS.FRAMES_PER_GAME_HOUR;
		this.state.gameFrameCount += casingFrames;
		
		// LOG DATA POINT AFTER CASING
		const displayTime = UIManager.getDisplayTime(this.state.gameFrameCount);
		const currentDays = displayTime.totalHours / 24;
		this.state.performanceLog.depths.push(Math.floor(this.state.depth));
		this.state.performanceLog.days.push(currentDays);
		this.state.performanceLog.costs.push(this.state.totalCost);
    
		// RESET LCM EFFECTIVENESS FOR NEW HOLE SECTION
		this.state.totalLCMLbs = 0;
		
		// RESET LOSS WARNING FLAG FOR NEW HOLE SECTION
		this.lossWarningShown = false;
		
		// SET MUD WEIGHT FOR NEXT SECTION
		this.state.baseMudWeight = this.state.getStartingMWForSection(casingPoint.depth);
		this.updateTotalMudWeight();
		
		const casingIndex = this.state.wellConfig.casingPoints.findIndex(c => c.depth === casingPoint.depth);
		let eventType = 'atCasing1';
		if (casingIndex === 1) eventType = 'atCasing2';
		if (casingIndex === 2) eventType = 'atCasing3';
		
		SpeechBubble.show(this.currentWellType, eventType);
		
		UIManager.showMessage(
			`${casingPoint.name.toUpperCase()} SET`,
			`Casing set at ${Math.floor(this.state.depth).toLocaleString()} ft\n\n` +
			`Cost: $${casingPoint.cost.toLocaleString()}\n` +
			`Time: ${casingHours.toFixed(1)} hours\n\n` +
			`New bit and motor installed\n` +
			`Bit Health: 100%\n` +
			`Motor Health: 100%\n` +
			`Mud Weight: ${this.state.baseMudWeight.toFixed(1)} ppg\n\n` +
			`Press SPACE to continue drilling`,
			'#00bcd4',
			false
		);
	}




	endGame(win) {
		this.state.isGameOver = true;
		
		if (win) {
			if (this.state.wellConfig.casingPoints) {
				const prodCasing = this.state.wellConfig.casingPoints.find(c => c.depth === this.state.wellConfig.targetDepth);
				
				if (prodCasing && !this.state.casingPointsReached.includes(prodCasing.depth)) {
					this.state.casingPointsReached.push(prodCasing.depth);
					
					this.state.totalCost += prodCasing.cost;
					this.state.bitHealth = 100;
					this.state.motorHealth = 100;
					this.state.motorSpikeCount = 0;
					this.state.spikeMultiplier = 1.0;
					
					// ADD TIME PENALTY (moved from handleCasingPoint since this is final casing)
					const casingHours = (prodCasing.depth / 1000) * 2;
					const casingFrames = casingHours * CONSTANTS.FRAMES_PER_GAME_HOUR;
					this.state.gameFrameCount += casingFrames;
					
					// LOG FINAL DATA POINT AFTER ADDING CASING COST/TIME
					const displayTime = UIManager.getDisplayTime(this.state.gameFrameCount);
					const currentDays = displayTime.totalHours / 24;
					this.state.performanceLog.depths.push(Math.floor(this.state.depth));
					this.state.performanceLog.days.push(currentDays);
					this.state.performanceLog.costs.push(this.state.totalCost);
					
					this.state.waitingForAcknowledge = true;
					this.state.isPaused = true;
					
					SpeechBubble.show(this.currentWellType, 'atTD');
					
					// Special handling for Armageddon
					if (this.currentWellType === 'armageddon') {
						UIManager.showMessage(
							`BOMB PLANTED`,
							`Bomb set at 800 ft\n\n` +
							`Cost: $${prodCasing.cost.toLocaleString()}\n\n` +
							`Detonation sequence initiated...\n\n` +
							`Press SPACE to detonate`,
							'#ff0000',
							false
						);
						
						this.showArmageddonAfterAck = true;
						return;
					}
					
					UIManager.showMessage(
						`${prodCasing.name.toUpperCase()} SET`,
						`Casing set at ${Math.floor(this.state.depth).toLocaleString()} ft\n\n` +
						`Cost: $${prodCasing.cost.toLocaleString()}\n\n` +
						`Rig Released!\n\n` +
						`Press SPACE to continue`,
						'#00bcd4',
						false
					);
					
					this.showTDAfterCasing = true;
					return;
				}
			}
			
			// Direct TD reached (no final casing to set) - log here instead
			const displayTime = UIManager.getDisplayTime(this.state.gameFrameCount);
			const currentDays = displayTime.totalHours / 24;
			this.state.performanceLog.depths.push(Math.floor(this.state.depth));
			this.state.performanceLog.days.push(currentDays);
			this.state.performanceLog.costs.push(this.state.totalCost);

			if (this.currentWellType === 'armageddon') {
				this.showArmageddonVictory();
				return;
			}

			const gameTime = displayTime.gameTime;

			const finalCost = Math.floor(this.state.totalCost);
			const totalDepth = this.state.wellConfig.targetDepth;
			
			if (MenuManager.checkHighScore(this.currentWellType, finalCost, gameTime)) {
				MenuManager.showNameEntry(this.currentWellType, finalCost, gameTime, totalDepth);
			} else {
				const totalDays = displayTime.days + (displayTime.hours / 24);
				const ftPerDay = Math.floor(totalDepth / totalDays);
				const costPerFt = Math.floor(finalCost / totalDepth);
				
				UIManager.showMessage(
					"TD REACHED!",
					`Total Depth: ${totalDepth.toLocaleString()} ft\n` +
					`Final Cost: $${finalCost.toLocaleString()}\n` +
					`Time: ${gameTime}\n` +
					`Mud Lost: ${Math.floor(this.state.totalMudLost)} bbls\n` +
					`LCM Used: ${Math.floor(this.state.totalLCMLbs).toLocaleString()} lbs\n\n` +
					`Performance:\n` +
					`${ftPerDay.toLocaleString()} ft/day\n` +
					`$${costPerFt.toLocaleString()}/ft`,
					'#76ff03',
					true
				);
				
				setTimeout(() => {
					MenuManager.returnToStart();
				}, 5000);
			}
		} else {
			UIManager.showMessage(
				"CRITICAL FAILURE",
				`Depth Achieved: ${Math.floor(this.state.depth)} ft\nCost at Failure: $${Math.floor(this.state.totalCost).toLocaleString()}.`,
				'#f44336',
				true
			);
		}
	}

	
	showArmageddonVictory() {
		const victoryScreen = document.getElementById('armageddon-victory-screen');
		victoryScreen.style.display = 'flex';
		
		const handleContinue = () => {
			victoryScreen.style.display = 'none';
			
			// Now show high score entry
			const displayTime = UIManager.getDisplayTime(this.state.gameFrameCount);
			const gameTime = displayTime.gameTime;
			const finalCost = Math.floor(this.state.totalCost);
			const totalDepth = this.state.wellConfig.targetDepth;
			
			if (MenuManager.checkHighScore(this.currentWellType, finalCost, gameTime)) {
				MenuManager.showNameEntry(this.currentWellType, finalCost, gameTime, totalDepth);
			} else {
				MenuManager.returnToStart();
			}
			
			// Remove event listeners
			continueBtn.removeEventListener('click', handleContinue);
			victoryScreen.removeEventListener('click', handleContinue);
			window.removeEventListener('keydown', handleSpaceKey);
		};
		
		const handleSpaceKey = (e) => {
			if (e.code === 'Space') {
				handleContinue();
			}
		};
		
		const continueBtn = document.getElementById('armageddon-continue-btn');
		continueBtn.addEventListener('click', handleContinue);
		victoryScreen.addEventListener('click', handleContinue);  // NEW - click anywhere
		window.addEventListener('keydown', handleSpaceKey);
	}

    update() {
        if (!this.isRunning || !this.state) return;
        if (this.state.isGameOver || !this.state.hasStarted || this.state.isPaused) return;

        this.state.gameFrameCount++;
        
        // Update ECD continuously
        this.updateTotalMudWeight();
        
        const costPerFrame = (CONSTANTS.SPREAD_RATE_PER_DAY / 24) / CONSTANTS.FRAMES_PER_GAME_HOUR;
        this.state.totalCost += costPerFrame;

		if (this.state.lcmConcentration > 0) {
			// Base decay rate
			let decayRate = CONSTANTS.LCM_DECAY_RATE;
			
			// Increase decay based on loss rate (losing mud = losing LCM faster)
			if (this.state.currentLossRate > 0) {
				// Add 0.001 per 100 bbl/hr loss rate
				const lossDecayMultiplier = this.state.currentLossRate / 100 * 0.004;
				decayRate += lossDecayMultiplier;
			}
			
			this.state.lcmConcentration = Math.max(0, this.state.lcmConcentration - decayRate);
			this.updateTotalMudWeight();
		}

        if (this.state.isTripping) {
            document.getElementById('statusDisplay').innerText = "TRIPPING";
            this.state.tripTimeRemaining -= CONSTANTS.TRIP_SPEED_MULTIPLIER;
            this.state.wob = 0;
            this.state.diffPressure = 0;

			if (this.state.tripTimeRemaining <= 0) {
				this.state.isTripping = false;
				this.state.tripTimeRemaining = 0;
				this.state.bitHealth = 100;
				this.state.motorHealth = 100;
				this.state.motorSpikeCount = 0;
				this.state.spikeMultiplier = 1.0;
				this.state.isMotorStalled = false;

				// LOG DATA POINT AFTER TRIP
				const displayTime = UIManager.getDisplayTime(this.state.gameFrameCount);
				const currentDays = displayTime.totalHours / 24;
				this.state.performanceLog.depths.push(Math.floor(this.state.depth));
				this.state.performanceLog.days.push(currentDays);
				this.state.performanceLog.costs.push(this.state.totalCost);
				   
				this.state.waitingForAcknowledge = true;
				this.state.isPaused = true;
				
				let completionDetail = 'New bit and motor installed\n\n';
				if (this.state.tripReason) {
					let reasonText = this.state.tripReason === 'motor' ? 'motor failure' : 
									(this.state.tripReason === 'stuck' ? 'stuck pipe' : 'bit failure');
					completionDetail = `Trip complete after ${reasonText}\n\n` +
									  `New bit and motor installed\n\n`;
				}
				
				UIManager.showMessage(
					"TRIP COMPLETE",
					completionDetail +
					`Bit Health: 100%\n` +
					`Motor Health: 100%\n\n` +
					`Press SPACE to acknowledge, then add WOB to continue`,
					'#76ff03',
					false
				);
				
				this.state.tripReason = null;  // Reset for next trip
			}
            return;
        }

        const formation = DrillingMechanics.getFormation(this.state.depth, this.state.wellConfig.formations);
        
        if (this.state.currentFormationName !== formation.name) {
            this.state.currentFormationName = formation.name;
            this.state.formationDriftDirection = formation.driftTendency > 0 ? 1 : -1;
            this.state.rotateDriftTimer = 0;
            
            this.checkFormationSpeech(formation);
        }
        
        // Check for casing points
        if (this.state.wellConfig.casingPoints && this.state.nextCasingIndex < this.state.wellConfig.casingPoints.length) {
            const nextCasing = this.state.wellConfig.casingPoints[this.state.nextCasingIndex];
            
            if (this.state.depth >= nextCasing.depth - 150 && this.state.depth < nextCasing.depth - 140) {
                if (!this.state.speechTriggered[`beforeCasing${this.state.nextCasingIndex}`]) {
                    this.state.speechTriggered[`beforeCasing${this.state.nextCasingIndex}`] = true;
                    
                    let eventType = 'beforeCasing1';
                    if (this.state.nextCasingIndex === 1) eventType = 'beforeCasing2';
                    if (this.state.nextCasingIndex === 2) eventType = 'beforeCasing3';
                    
                    SpeechBubble.show(this.currentWellType, eventType);
                }
            }
            
            if (this.state.depth >= nextCasing.depth && nextCasing.depth < this.state.wellConfig.targetDepth) {
                this.state.nextCasingIndex++;
                this.handleCasingPoint(nextCasing);
                return;
            }
        }
		
		// ============================================================================
		// DEPTH-BASED SPEECH TRIGGERS (checked every frame)
		// ============================================================================

		// Check depth-based triggers (configured in SpeechBubble.js)
		SpeechBubble.checkDepthTriggers(this.currentWellType, this.state.depth, this.state.speechTriggered);

		// Before TD check (all wells)
		if (this.state.depth >= this.state.wellConfig.targetDepth - 500 && 
			this.state.depth < this.state.wellConfig.targetDepth - 490) {
			if (!this.state.speechTriggered['beforeTD']) {
				this.state.speechTriggered['beforeTD'] = true;
				SpeechBubble.show(this.currentWellType, 'beforeTD');
			}
		}

		// Armageddon special depth triggers (keep this as-is since it's unique)
		if (this.currentWellType === 'armageddon') {
			const currentDepth = Math.floor(this.state.depth);
			if (!this.state.armageddonDepthsTriggered.includes(currentDepth)) {
				this.state.armageddonDepthsTriggered.push(currentDepth);
				SpeechBubble.show('armageddon', null, { depth: currentDepth });
			}
		}
        
        const kickZone = DrillingMechanics.checkKickZone(this.state.depth, formation);
        this.state.isInKickZone = kickZone !== null;
        
        if (this.state.isKickActive) {
            document.getElementById('statusDisplay').innerText = "KICK CONTROL";
            this.state.wob = 0;
            
            if (DrillingMechanics.isKickControlled(this.state.mudWeight, kickZone)) {
                this.state.kickControlTimeRemaining -= CONSTANTS.KICK_CONTROL_SPEED_MULTIPLIER;
                
                if (this.state.kickControlTimeRemaining <= 0) {
                    this.state.isKickActive = false;
					    
					// LOG DATA POINT AFTER KICK CONTROL
					// LOG DATA POINT AFTER KICK CONTROL
					const displayTime = UIManager.getDisplayTime(this.state.gameFrameCount);
					const currentDays = displayTime.totalHours / 24;
					this.state.performanceLog.depths.push(Math.floor(this.state.depth));
					this.state.performanceLog.days.push(currentDays);
					this.state.performanceLog.costs.push(this.state.totalCost);
	
                    this.state.waitingForAcknowledge = true;
                    this.state.isPaused = true;
                    
                    UIManager.showMessage(
                        "KICK CONTROLLED",
                        `Kick successfully controlled\n\n` +
                        `Final MW: ${this.state.mudWeight.toFixed(1)} ppg\n\n` +
                        `Press SPACE to acknowledge, then add WOB to continue`,
                        '#76ff03',
                        false
                    );
                }
            } else {
                // Still under kill weight - show periodic toast
                if (!this.gasFlowingToastTimer) this.gasFlowingToastTimer = 0;
                this.gasFlowingToastTimer++;
                
                if (this.gasFlowingToastTimer >= 120) { // Every ~0.8 seconds
                    UIManager.showToast(
                        `⚠ GAS FLOWING!\nRaise MW to ${kickZone.minMW.toFixed(1)} ppg\nCurrent: ${this.state.mudWeight.toFixed(1)} ppg`,
                        'error'
                    );
                    this.gasFlowingToastTimer = 0;
                }
            }
            return;
        }

        if (this.state.isInKickZone && !this.state.isKickActive && kickZone) {
            const zoneKey = `${kickZone.start}-${kickZone.end}`;
            
            if (!this.kickZoneTriggered[zoneKey] && !DrillingMechanics.isKickControlled(this.state.mudWeight, kickZone)) {
                this.kickZoneTriggered[zoneKey] = true;
                this.handleKickEvent(kickZone);
                return;
            }
        }
        
		// ============================================================================
		// INSTABILITY SYSTEM CHECKING
		// ============================================================================
		const instabilityZone = DrillingMechanics.checkInstabilityZone(this.state.depth, formation);
		this.state.isInInstabilityZone = instabilityZone !== null;

		if (this.state.isInInstabilityZone && instabilityZone) {
			const isStable = DrillingMechanics.isWellboreStable(this.state.mudWeight, instabilityZone);
			
			if (!isStable) {
				const severity = DrillingMechanics.getInstabilitySeverity(this.state.mudWeight, instabilityZone);
				
				// Show warning on first entry
				if (!this.instabilityWarningShown) {
				this.instabilityWarningShown = true;
				
				// Show severity-based speech bubble
				if (severity === 'severe') {
					SpeechBubble.show(this.currentWellType, 'instabilitySevere');
				} else if (severity === 'moderate') {
					SpeechBubble.show(this.currentWellType, 'instabilityModerate');
				} else {
					SpeechBubble.show(this.currentWellType, 'instabilityMinor');
				}
					
					UIManager.showToast(
						`⚠ WELLBORE INSTABILITY!\nRaise MW to ${instabilityZone.minMW.toFixed(1)} ppg\nCurrent: ${this.state.mudWeight.toFixed(1)} ppg`,
						'error'
					);
				}
				
				// Calculate timer for this severity level
				const requiredFrames = DrillingMechanics.calculateInstabilityTimer(this.state.mudWeight, instabilityZone);
				
				// If severity changed, reset timer
				if (severity !== this.currentInstabilitySeverity) {
					this.currentInstabilitySeverity = severity;
					this.instabilityFramesAccumulated = 0;
				}
				
				// Accumulate frames
				this.instabilityFramesAccumulated++;
				
				// Show periodic warnings
				if (this.instabilityFramesAccumulated % 300 === 0) { // Every 2 seconds
					UIManager.showToast(
						`⚠ INSTABILITY - ${severity.toUpperCase()}!\nMW: ${this.state.mudWeight.toFixed(1)} / ${instabilityZone.minMW.toFixed(1)} ppg`,
						'error'
					);
				}
				
				// Check if stuck
				if (this.instabilityFramesAccumulated >= requiredFrames) {
					this.handleStuckPipe(instabilityZone);
					return;
				}
			} else {
				// Stable - reset tracking
				this.instabilityWarningShown = false;
				this.instabilityFramesAccumulated = 0;
				this.currentInstabilitySeverity = 'none';
			}
		} else {
			// Not in instability zone - reset tracking
			this.instabilityWarningShown = false;
			this.instabilityFramesAccumulated = 0;
			this.currentInstabilitySeverity = 'none';
		}

        const lossZone = DrillingMechanics.checkAllLossZones(this.state.depth, this.state.wellConfig.formations);

        this.state.isInLossZone = lossZone !== null;
        
        if (this.state.isInLossZone) {
			const lossResult = DrillingMechanics.calculateLossRate(
				this.state.mudWeight, 
				lossZone, 
				this.state.lcmConcentration,
				this.state.flowRate,
				this.state.totalLCMLbs
			);
			this.state.currentLossRate = lossResult.lossRate;
			this.state.lossHealPercentage = lossResult.healPercentage;
			
			if (this.state.currentLossRate > 0) {
				this.handleLossEvent(lossZone);
				
				if (this.state.currentLossRate > 400 && Math.random() < 0.01) {
					SpeechBubble.show(this.currentWellType, 'lossesHeavy');
				} else if (this.state.currentLossRate > 250 && Math.random() < 0.01) {
					SpeechBubble.show(this.currentWellType, 'lossesModerate');
				}
				
				this.lossToastTimer++;
				if (this.lossToastTimer >= 180) {
					UIManager.showToast(
						`⚠ LOSSES: ${Math.floor(this.state.currentLossRate)} bbl/hr\n` +
						`Healed: ${Math.floor(this.state.lossHealPercentage)}%`,
						'warning'
					);
					this.lossToastTimer = 0;
				}
			} else {
				this.lossToastTimer = 0;
			}
			
			const lossPerFrame = this.state.currentLossRate / CONSTANTS.FRAMES_PER_GAME_HOUR;
			this.state.totalMudLost += lossPerFrame;

			// CALCULATE LCM USAGE - MAKE SURE THESE LINES ARE HERE
			const totalLCMConcentration = 5 + this.state.lcmConcentration;
			const lcmLbsPerFrame = lossPerFrame * totalLCMConcentration;
			this.state.totalLCMLbs += lcmLbsPerFrame;

			const mudCostPerFrame = lossPerFrame * CONSTANTS.MUD_COST_PER_BBL;
			this.state.totalCost += mudCostPerFrame;
		}
        
        document.getElementById('statusDisplay').innerText = "DRILLING";
        
        this.state.diffPressure = DrillingMechanics.calculateDiffPressure(
            this.state.wob, 
            formation, 
            this.state.spikeMultiplier,
            this.state.drillingMode === 'sliding'
        );
        
        const healthDrain = DrillingMechanics.calculateMotorHealthDrain(this.state.diffPressure);
        this.state.motorHealth = Math.max(0, this.state.motorHealth - healthDrain);
        
        if (this.state.motorHealth < 30 && Math.random() < 0.005) {
            SpeechBubble.show(this.currentWellType, 'motorWeak');
        }
        
        if (this.state.bitHealth < 20 && this.state.bitHealth > 10 && Math.random() < 0.005) {
            SpeechBubble.show(this.currentWellType, 'bitDull');
        }
        
        // Apply flow rate stall factor
        const flowStallFactor = DrillingMechanics.calculateFlowStallFactor(this.state.flowRate);
        const adjustedStallDP = CONSTANTS.MOTOR_STALL_DP / flowStallFactor;
        
        if (this.state.diffPressure >= adjustedStallDP && this.state.wob > 0) {
            this.handleMotorStall();
            return;
        } else if (this.state.isMotorStalled && this.state.diffPressure < adjustedStallDP) {
            this.state.isMotorStalled = false;
        }
        
        // Apply flow rate spike factor
        const flowSpikeFactor = DrillingMechanics.calculateFlowSpikeFactor(this.state.flowRate);
        
        if (!this.state.isMotorStalled && DrillingMechanics.checkForDPSpike(
            this.state.diffPressure, 
            this.state.spikeMultiplier,
            this.state.motorHealth,
            flowSpikeFactor
        )) {
            this.handleDPSpike();
        }
        
        if (DrillingMechanics.shouldMotorFail(this.state.motorHealth)) {
            this.startTrip('motor');
            return;
        }
        
        this.state.kickRisk = DrillingMechanics.calculateKickRisk(
            this.state.mudWeight, 
            this.state.depth, 
            this.state.wellConfig.normalPressureMW
        );
        
        let ropReductionFactor = DrillingMechanics.calculateMudROPFactor(this.state.mudWeight);
        let flowROPFactor = DrillingMechanics.calculateFlowROPFactor(this.state.flowRate);
        let rop = DrillingMechanics.calculateROP(this.state.wob, formation) * ropReductionFactor * flowROPFactor;
        
        if (this.state.drillingMode === 'sliding') {
            rop *= CONSTANTS.SLIDING_ROP_FACTOR;
        }
        

        
        let damage = DrillingMechanics.calculateDamage(this.state.wob, formation);
        let feetPerFrame = rop / CONSTANTS.FRAMES_PER_GAME_HOUR;

        if (this.state.wob > 0 && this.state.depth < this.state.wellConfig.targetDepth) {
            this.state.depth += feetPerFrame;
            this.state.bitHealth -= damage;
            this.state.dirtOffset -= feetPerFrame * 2;
            
            this.state.totalDrillingTime++;
            if (this.state.drillingMode === 'sliding') {
                this.state.totalSlideDepth += feetPerFrame;
                this.state.totalSlideTime++;
            }
        }
        
		this.state.logCounter++;
		if (this.state.logCounter >= CONSTANTS.LOG_INTERVAL) {
			this.recorder.logDataPoint(this.state, rop);
			
			// Log performance data for charts (every 10 ft)
			if (Math.floor(this.state.depth) % 10 === 0 && !this.state.lastLoggedDepth) {
				this.state.lastLoggedDepth = Math.floor(this.state.depth);
				const displayTime = UIManager.getDisplayTime(this.state.gameFrameCount);
				const currentDays = displayTime.totalHours / 24;
				this.state.performanceLog.depths.push(Math.floor(this.state.depth));
				this.state.performanceLog.days.push(currentDays);
				this.state.performanceLog.costs.push(this.state.totalCost);
			}
    
			// ADD THESE 4 LINES HERE:
			// Reset flag when we pass to next 10 ft increment
			if (Math.floor(this.state.depth) % 10 !== 0) {
				this.state.lastLoggedDepth = null;
			}
			
			this.state.logCounter = 0;
		}
        
        if (this.state.drillingMode === 'sliding' && this.state.wob > 0) {
            this.state.slideChangeTimer++;
            if (this.state.slideChangeTimer >= this.state.slideChangeInterval) {
                this.state.slideDirection *= -1;
                this.resetSlideTimer();
                
                UIManager.showToast('⚠ TOOLFACE FLOP', 'warning');
                
                if (formation.toolfaceFlopFactor > 3 && Math.random() < 0.3) {
                    SpeechBubble.show(this.currentWellType, 'toolfaceFlop');
                }
            }
            
            const ropScale = rop / 100;
            this.state.currentX += this.state.slideDirection * CONSTANTS.SLIDING_STEER_SPEED * ropScale;
			} else if (this.state.drillingMode === 'rotating') {
				this.state.rotateDriftTimer++;
				
				if (this.state.rotateDriftTimer >= CONSTANTS.ROTATE_DRIFT_CHANGE_INTERVAL * 0.5) {
					if (Math.random() < 0.3) { // ← 50% chance to flip direction
						this.state.formationDriftDirection *= -1;
					}
					this.state.rotateDriftTimer = 0;
				}
				
				// Scale drift with ROP (no ROP = no drift)
				const ropScale = rop / 100;
				let driftAmount = DrillingMechanics.calculateFormationDrift(
					formation, 
					this.state.formationDriftDirection
				);
				
				this.state.currentX += driftAmount * ropScale;
			}
        
		let targetX = DrillingMechanics.getTargetPathX(this.state.depth, this.state.wellConfig.targetPath);
		this.state.currentX = Math.min(800 - 50, Math.max(50, this.state.currentX));

		let deviation = Math.abs(this.state.currentX - targetX);
		UIManager.showDeviation(deviation);

		// NEW: Check for major deviation (45+ ft)
		if (deviation >= 45 && Math.random() < 0.01) {
			SpeechBubble.show(this.currentWellType, 'deviationWarning');
		}

		if (deviation > 30) {
			let deviationUnits = (deviation - 30) / 10;
			this.state.totalCost += deviationUnits * CONSTANTS.NPV_LOSS_RATE;
		}

        if (this.state.bitHealth <= 0) {
            this.startTrip('bit');
        } else if (this.state.depth >= this.state.wellConfig.targetDepth) {
            this.state.depth = this.state.wellConfig.targetDepth;
            this.endGame(true);
        }

        if (this.state.dirtOffset < -40) this.state.dirtOffset = 0;
    }

	checkFormationSpeech(formation) {
		// Check formation-based triggers (configured in SpeechBubble.js)
		SpeechBubble.checkFormationTriggers(this.currentWellType, formation, this.state.speechTriggered);
	}

	draw() {
		if (!this.isRunning || !this.state) return;

		this.renderer.draw(this.state);
		this.recorder.draw(this.state);
		this.drillingWindow.draw(this.state);
		
		const formation = DrillingMechanics.getFormation(this.state.depth, this.state.wellConfig.formations);
		let rop = DrillingMechanics.calculateROP(this.state.wob, formation) * 
				  DrillingMechanics.calculateMudROPFactor(this.state.mudWeight) *
				  DrillingMechanics.calculateFlowROPFactor(this.state.flowRate);
		
		if (this.state.drillingMode === 'sliding') {
			rop *= CONSTANTS.SLIDING_ROP_FACTOR;
		}
		
		if (this.state.isInLossZone && this.state.currentLossRate > 0) {
			const lossROPFactor = 1 - (this.state.currentLossRate / 500);
			rop *= Math.max(0.1, lossROPFactor);
		}
		
		UIManager.updateDigitalReadouts(this.state, rop);
		UIManager.updateStats(this.state, formation);
		UIManager.updateModeIndicator(this.state);
		UIManager.updateLossIndicator(this.state);  // ADD THIS LINE
		
		// Update Driller's Console
		DrillersConsole.update(this.state); // ADD THIS LINE
	}

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}
