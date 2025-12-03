class GameState {
	constructor(wellConfig) {
		this.wellConfig = wellConfig;
		
		// Get starting MW from config (with fallback)
		let initialMW = 8.5; // Default
		if (this.wellConfig && this.wellConfig.startingMW && this.wellConfig.startingMW.length > 0) {
			initialMW = this.wellConfig.startingMW[0].mw;
		}
		
		this.baseMudWeight = initialMW;
		this.ecd = 0;
		this.mudWeight = initialMW;
		this.lcmConcentration = 0;
		this.flowRate = CONSTANTS.NORMAL_FLOW_RATE;
		
		this.depth = 0;
		this.wob = 0;
		this.bitHealth = 100;
		this.motorHealth = 100;
		this.diffPressure = 0;
		this.kickRisk = 0;
		
		this.totalCost = 0;
		this.totalDrillingTime = 0;
		this.totalSlideTime = 0;
		this.totalSlideDepth = 0;
		this.gameFrameCount = 0;
		
		this.currentFormationName = "";
		this.drillingMode = 'rotating';
		this.slideDirection = 1;
		this.slideChangeTimer = 0;
		this.slideChangeInterval = 300;
		this.rotateDriftTimer = 0;
		this.formationDriftDirection = 1;
		
		this.motorSpikeCount = 0;
		this.spikeMultiplier = 1.0;
		
		this.isTripping = false;
		this.tripTimeRemaining = 0;
		
		this.isKickActive = false;
		this.kickControlTimeRemaining = 0;
		this.isInKickZone = false;
		
		this.isInLossZone = false;
		this.currentLossRate = 0;
		this.lossHealPercentage = 0;
		this.totalMudLost = 0;
		
		this.isInInstabilityZone = false;
		
		this.isMotorStalled = false;
		this.motorStallStartDepth = 0;
		
		this.casingPointsReached = [];
		this.nextCasingIndex = 0;
		
		this.hasStarted = false;
		this.isPaused = false;
		this.isGameOver = false;
		this.waitingForAcknowledge = false;
		
		this.logCounter = 0;
		this.dirtOffset = 0;
		this.lastLoggedDepth = null;
		
		this.currentX = this.wellConfig.targetPath[0].x;
		
		this.speechTriggered = {};
		this.armageddonDepthsTriggered = [];
		
		this.slideCount = 0;
		this.needsTrip = false;
		
		this.performanceLog = {
			depths: [],
			days: [],
			costs: []
		};
		
		this.logData = {
			rop: [],
			wob: [],
			diffPressure: [],
			flowRate: []
		};
	}
	
	getStartingMWForSection(depth) {
	if (!this.wellConfig || !this.wellConfig.startingMW) return 8.5; // Default fallback
	
	// Find the appropriate section based on depth
	let appropriateMW = this.wellConfig.startingMW[0].mw; // Default to first section
	
	for (let i = 0; i < this.wellConfig.startingMW.length; i++) {
		const section = this.wellConfig.startingMW[i];
		if (depth >= section.depth) {
			appropriateMW = section.mw;
		} else {
			break;
		}
	}
	
	return appropriateMW;
	}

    reset() {
        this.depth = 0;
        this.bitHealth = 100;
        this.motorHealth = 100;
        this.wob = 0;
        this.gameFrameCount = 0;
        this.isGameOver = false;
        this.hasStarted = false;
        this.isPaused = false;
        this.totalCost = 0;
        this.isTripping = false;
        this.tripTimeRemaining = 0;
        this.mudWeight = this.wellConfig.normalPressureMW;
        this.baseMudWeight = this.wellConfig.normalPressureMW;
        this.previousMudWeight = this.wellConfig.normalPressureMW;
        this.kickRisk = 0;
        this.currentX = 400;
        this.dirtOffset = 0;
        this.logData = { rop: [], wob: [], diffPressure: [], flowRate: [] };
        this.logCounter = 0;
        
        this.drillingMode = 'rotating';
        this.slideDirection = 0;
        this.slideChangeTimer = 0;
        this.slideChangeInterval = 0;
        
        this.rotateDriftDirection = 0;
        this.rotateDriftTimer = 0;
        this.currentFormationName = null;
        this.formationDriftDirection = 1;
        
        this.diffPressure = 0;
        this.motorSpikeCount = 0;
        this.motorSpikeHistory = [];
        this.spikeMultiplier = 1.0;
        this.isMotorStalled = false;
        this.motorStallStartDepth = 0;
        
        this.lcmConcentration = 0;
        this.isInLossZone = false;
        this.currentLossRate = 0;
        this.lossHealPercentage = 0;
        this.totalMudLost = 0;
        
        this.isInKickZone = false;
        this.isKickActive = false;
        this.kickControlTimeRemaining = 0;
        
        this.totalSlideDepth = 0;
        this.totalSlideTime = 0;
        this.totalDrillingTime = 0;
        
        this.waitingForAcknowledge = false;
        
        this.casingPointsReached = [];
        this.nextCasingIndex = 0;
        
        this.speechTriggered = {};
        this.slideCount = 0;
        this.armageddonDepthsTriggered = [];
        
        // Flow rate
        this.flowRate = CONSTANTS.NORMAL_FLOW_RATE;
        this.ecd = 0;
    }
	
	getStartingMWForSection(depth) {
    if (!this.wellConfig.startingMW) return 8.5; // Default fallback
    
    // Find the appropriate section based on depth
    let appropriateMW = this.wellConfig.startingMW[0].mw; // Default to first section
    
    for (let i = 0; i < this.wellConfig.startingMW.length; i++) {
        const section = this.wellConfig.startingMW[i];
        if (depth >= section.depth) {
            appropriateMW = section.mw;
        } else {
            break;
        }
    }
    
    return appropriateMW;
}

}
