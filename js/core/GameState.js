class GameState {
    constructor(wellConfig) {
        this.wellConfig = wellConfig;
        this.reset();
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
}
