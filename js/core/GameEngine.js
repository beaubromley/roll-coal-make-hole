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
        
        this.lossWarningShown = false;
        this.isRunning = false;
        this.loopStarted = false;
        this.currentWellType = null;
    }

    loadWell(wellType) {
        this.currentWellType = wellType;
        this.wellConfig = WELL_CONFIGS[wellType];
        this.state = new GameState(this.wellConfig);
        this.lossWarningShown = false;
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
    }

    handleKeyDown(e) {
        if (!this.isRunning) return;

        if (e.code === 'KeyP') {
            if (this.state.hasStarted && !this.state.isGameOver) {
                this.state.isPaused = !this.state.isPaused;
                UIManager.togglePause(this.state.isPaused);
            }
            return;
        }

        if (this.state.isPaused) return;

        if (this.state.isGameOver && e.code === 'KeyR') {
            this.reset();
            return;
        }
        
        if (e.code === 'ArrowUp') {
            if (this.state.wob < CONSTANTS.MAX_WOB) this.state.wob++;
            if (!this.state.hasStarted && this.state.wob > 0) {
                this.state.hasStarted = true;
                document.getElementById('start-prompt').style.display = 'none';
            }
        }
        if (e.code === 'ArrowDown') {
            if (this.state.wob > 0) this.state.wob--;
        }

        if (e.code === 'KeyA') {
            this.state.drillingMode = 'sliding';
            this.state.slideDirection = -1;
            this.resetSlideTimer();
        }
        if (e.code === 'KeyD') {
            this.state.drillingMode = 'sliding';
            this.state.slideDirection = 1;
            this.resetSlideTimer();
        }
        if (e.code === 'KeyS') {
            this.state.drillingMode = 'rotating';
            this.state.rotateDriftTimer = 0;
        }

        if (e.code === 'KeyM') {
            this.state.mudWeight = Math.min(CONSTANTS.MAX_MUD_WEIGHT, this.state.mudWeight + 0.1);
        }
        if (e.code === 'KeyN') {
            this.state.mudWeight = Math.max(8.0, this.state.mudWeight - 0.1);
        }
        
        if (e.code === 'KeyI') {
            this.state.lcmConcentration = Math.min(100, this.state.lcmConcentration + 5);
        }
        if (e.code === 'KeyK') {
            this.state.lcmConcentration = Math.max(0, this.state.lcmConcentration - 5);
        }
        
        if (e.code === 'KeyR') {
            this.reset();
        }
    }

    handleKeyUp(e) {
        // No key-up actions needed
    }

    resetSlideTimer() {
        this.state.slideChangeInterval = Math.floor(Math.random() * (10 * 60 - 1 * 60) + 1 * 60);
        this.state.slideChangeTimer = 0;
    }

    reset() {
        this.state.reset();
        this.lossWarningShown = false;
        UIManager.hideMessage();
        document.getElementById('deviation-warning').style.display = 'none';
        document.getElementById('start-prompt').style.display = 'block';
        document.getElementById('statusDisplay').innerText = "READY";
        UIManager.togglePause(false);
    }

    startTrip(reason = 'bit') {
        this.state.isTripping = true;
        
        const tripCost = CONSTANTS.BIT_ASSEMBLY_COST + CONSTANTS.MOTOR_COST;
        this.state.totalCost += tripCost;
        
        const tripDurationHours = (this.state.depth / CONSTANTS.TRIP_SPEED_FT_PER_HR) * 2;
        this.state.tripTimeRemaining = tripDurationHours * CONSTANTS.FRAMES_PER_GAME_HOUR;
        
        document.getElementById('statusDisplay').innerText = "TRIPPING";
        
        let title = reason === 'motor' ? "MOTOR FAILURE" : "BIT FAILURE";
        let detail = `${reason === 'motor' ? 'Motor' : 'Bit'} failure at ${Math.floor(this.state.depth).toLocaleString()} ft.\n` +
                    `Cost: $${CONSTANTS.BIT_ASSEMBLY_COST.toLocaleString()} bit + $${CONSTANTS.MOTOR_COST.toLocaleString()} motor\n` +
                    `Trip time: ${tripDurationHours.toFixed(1)} hours`;
        
        UIManager.showMessage(title, detail, '#f44336', false);

        setTimeout(() => UIManager.hideMessage(), 5000);
    }

    handleKickEvent(kickZone) {
        this.state.isKickActive = true;
        
        const kickDurationHours = (this.state.depth / 1000) * CONSTANTS.KICK_TIME_PER_1000FT;
        this.state.kickControlTimeRemaining = kickDurationHours * CONSTANTS.FRAMES_PER_GAME_HOUR;
        
        const kickCostPenalty = (kickDurationHours / 24) * CONSTANTS.SPREAD_RATE_PER_DAY;
        this.state.totalCost += kickCostPenalty;

        UIManager.showMessage(
            "KICK DETECTED!",
            `Kick at ${Math.floor(this.state.depth).toLocaleString()} ft!\nIncrease MW to ${kickZone.minMW.toFixed(1)} ppg\nControl time: ${kickDurationHours.toFixed(1)} hours\nCost: $${kickCostPenalty.toLocaleString('en-US', { maximumFractionDigits: 0 })}.`,
            '#ff1744',
            false
        );
        
        setTimeout(() => UIManager.hideMessage(), 5000);
    }

    handleLossEvent(lossZone) {
        if (!this.lossWarningShown) {
            this.lossWarningShown = true;
            
            UIManager.showLossWarning(lossZone.maxMW);
            
            setTimeout(() => {
                this.lossWarningShown = false;
            }, 5000);
        }
    }

    handleDPSpike() {
        this.state.motorSpikeCount++;
        this.state.spikeMultiplier += 0.05;
        this.state.motorHealth = Math.max(0, 100 - (this.state.motorSpikeCount / CONSTANTS.MOTOR_MAX_SPIKES * 100));
        
        UIManager.showDPSpikeWarning();
    }

    handleMotorStall() {
        if (!this.state.isMotorStalled) {
            this.state.isMotorStalled = true;
            this.state.motorStallStartDepth = this.state.depth;
            this.state.motorSpikeCount++;
            this.state.motorHealth = Math.max(0, 100 - (this.state.motorSpikeCount / CONSTANTS.MOTOR_MAX_SPIKES * 100));
            
            UIManager.showMotorStallWarning();
        }
    }

    endGame(win) {
        this.state.isGameOver = true;
        
        if (win) {
            const totalHours = Math.floor(this.state.gameFrameCount / CONSTANTS.FRAMES_PER_GAME_HOUR);
            const days = Math.floor(totalHours / 24);
            const hours = totalHours % 24;
            const gameTime = `${days}d ${hours}h`;
            
            const finalCost = Math.floor(this.state.totalCost);
            
            if (MenuManager.checkHighScore(this.currentWellType, finalCost, gameTime)) {
                MenuManager.showNameEntry(this.currentWellType, finalCost, gameTime);
            } else {
                UIManager.showMessage(
                    "TD REACHED!",
                    `Total Depth: ${this.state.wellConfig.targetDepth.toLocaleString()} ft\nFinal Cost: $${finalCost.toLocaleString()}\nTime: ${gameTime}\nMud Lost: ${Math.floor(this.state.totalMudLost)} bbls.`,
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

    update() {
        if (!this.isRunning || !this.state) return;
        if (this.state.isGameOver || !this.state.hasStarted || this.state.isPaused) return;

        this.state.gameFrameCount++;
        
        const costPerFrame = (CONSTANTS.SPREAD_RATE_PER_DAY / 24) / CONSTANTS.FRAMES_PER_GAME_HOUR;
        this.state.totalCost += costPerFrame;

        if (this.state.isTripping) {
            document.getElementById('statusDisplay').innerText = "TRIPPING";
            this.state.tripTimeRemaining--;
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
                document.getElementById('statusDisplay').innerText = "DRILLING";
            }
            return;
        }

        const formation = DrillingMechanics.getFormation(this.state.depth, this.state.wellConfig.formations);
        
        if (this.state.currentFormationName !== formation.name) {
            this.state.currentFormationName = formation.name;
            this.state.formationDriftDirection = formation.driftTendency > 0 ? 1 : -1;
            this.state.rotateDriftTimer = 0;
        }
        
        const kickZone = DrillingMechanics.checkKickZone(this.state.depth, formation);
        this.state.isInKickZone = kickZone !== null;
        
        if (this.state.isKickActive) {
            document.getElementById('statusDisplay').innerText = "KICK CONTROL";
            this.state.wob = 0;
            
            if (DrillingMechanics.isKickControlled(this.state.mudWeight, kickZone)) {
                this.state.kickControlTimeRemaining--;
                
                if (this.state.kickControlTimeRemaining <= 0) {
                    this.state.isKickActive = false;
                    document.getElementById('statusDisplay').innerText = "DRILLING";
                }
            }
            return;
        }
        
        if (this.state.isInKickZone && !this.state.isKickActive) {
            if (!DrillingMechanics.isKickControlled(this.state.mudWeight, kickZone)) {
                this.handleKickEvent(kickZone);
                return;
            }
        }
        
        const lossZone = DrillingMechanics.checkLossZone(this.state.depth, formation);
        this.state.isInLossZone = lossZone !== null;
        
        if (this.state.isInLossZone) {
            const lossResult = DrillingMechanics.calculateLossRate(
                this.state.mudWeight, 
                lossZone, 
                this.state.lcmConcentration
            );
            this.state.currentLossRate = lossResult.lossRate;
            this.state.lossHealPercentage = lossResult.healPercentage;
            
            if (this.state.currentLossRate > 0) {
                this.handleLossEvent(lossZone);
            }
            
            const lossPerFrame = this.state.currentLossRate / CONSTANTS.FRAMES_PER_GAME_HOUR;
            this.state.totalMudLost += lossPerFrame;
            
            const mudCostPerFrame = lossPerFrame * CONSTANTS.MUD_COST_PER_BBL;
            this.state.totalCost += mudCostPerFrame;
        } else {
            this.state.currentLossRate = 0;
            this.state.lossHealPercentage = 0;
        }
        
        if (this.state.lcmConcentration > 0) {
            const lcmCostPerFrame = (this.state.lcmConcentration * 500 * CONSTANTS.LCM_COST_PER_LB) / 
                                   (CONSTANTS.FRAMES_PER_GAME_HOUR * 24);
            this.state.totalCost += lcmCostPerFrame;
        }
        
        document.getElementById('statusDisplay').innerText = "DRILLING";
        
        this.state.diffPressure = DrillingMechanics.calculateDiffPressure(
            this.state.wob, 
            formation, 
            this.state.spikeMultiplier,
            this.state.drillingMode === 'sliding'
        );
        
        if (this.state.diffPressure >= CONSTANTS.MOTOR_STALL_DP && this.state.wob > 0) {
            this.handleMotorStall();
            return;
        } else if (this.state.isMotorStalled && this.state.diffPressure < CONSTANTS.MOTOR_STALL_DP) {
            this.state.isMotorStalled = false;
        }
        
        if (!this.state.isMotorStalled && DrillingMechanics.checkForDPSpike(
            this.state.diffPressure, 
            this.state.spikeMultiplier, 
            this.state.motorSpikeCount
        )) {
            this.handleDPSpike();
        }
        
        if (DrillingMechanics.shouldMotorFail(this.state.motorSpikeCount)) {
            this.startTrip('motor');
            return;
        }
        
        this.state.kickRisk = DrillingMechanics.calculateKickRisk(
            this.state.mudWeight, 
            this.state.depth, 
            this.state.wellConfig.normalPressureMW
        );
        
        let ropReductionFactor = DrillingMechanics.calculateMudROPFactor(this.state.mudWeight);
        let rop = DrillingMechanics.calculateROP(this.state.wob, formation) * ropReductionFactor;
        
        if (this.state.drillingMode === 'sliding') {
            rop *= CONSTANTS.SLIDING_ROP_FACTOR;
        }
        
        if (this.state.isInLossZone && this.state.currentLossRate > 0) {
            const lossROPFactor = 1 - (this.state.currentLossRate / 500);
            rop *= Math.max(0.1, lossROPFactor);
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
            this.state.logCounter = 0;
        }
        
        if (this.state.drillingMode === 'sliding' && this.state.wob > 0) {
            this.state.slideChangeTimer++;
            if (this.state.slideChangeTimer >= this.state.slideChangeInterval) {
                this.state.slideDirection *= -1;
                this.resetSlideTimer();
            }
            
            const ropScale = rop / 100;
            this.state.currentX += this.state.slideDirection * CONSTANTS.SLIDING_STEER_SPEED * ropScale;
        } else if (this.state.drillingMode === 'rotating') {
            this.state.rotateDriftTimer++;
            
            if (this.state.rotateDriftTimer >= CONSTANTS.ROTATE_DRIFT_CHANGE_INTERVAL * 2) {
                if (Math.random() < 0.3) {
                    this.state.formationDriftDirection *= -1;
                }
                this.state.rotateDriftTimer = 0;
            }
            
            let driftAmount = DrillingMechanics.calculateFormationDrift(
                formation, 
                this.state.formationDriftDirection
            );
            
            this.state.currentX += driftAmount;
        }
        
        let targetX = DrillingMechanics.getTargetPathX(this.state.depth, this.state.wellConfig.targetPath);
        this.state.currentX = Math.min(800 - 50, Math.max(50, this.state.currentX));

        let deviation = Math.abs(this.state.currentX - targetX);
        UIManager.showDeviation(deviation);
        
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

    draw() {
        if (!this.isRunning || !this.state) return;

        this.renderer.draw(this.state);
        this.recorder.draw(this.state);
        this.drillingWindow.draw(this.state);
        
        const formation = DrillingMechanics.getFormation(this.state.depth, this.state.wellConfig.formations);
        let rop = DrillingMechanics.calculateROP(this.state.wob, formation) * 
                  DrillingMechanics.calculateMudROPFactor(this.state.mudWeight);
        
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
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}
