class DrillingMechanics {
    static getFormation(depth, formations) {
        for (let f of formations) {
            if (depth < f.limit) return f;
        }
        return formations[formations.length - 1];
    }

    static getTargetPathX(currentDepth, targetPath) {
        for (let i = 0; i < targetPath.length - 1; i++) {
            const p1 = targetPath[i];
            const p2 = targetPath[i + 1];

            if (currentDepth >= p1.depth && currentDepth <= p2.depth) {
                const depthRange = p2.depth - p1.depth;
                const xRange = p2.x - p1.x;
                const depthFraction = (currentDepth - p1.depth) / depthRange;
                return p1.x + (xRange * depthFraction);
            }
        }
        return targetPath[targetPath.length - 1].x;
    }

    static calculateMudROPFactor(currentMW) {
        return 1.1 - (currentMW * 0.015);
    }

    static calculateFlowROPFactor(flowRate) {
        // 550 gpm is baseline (1.0x)
        // 400 gpm = 0.7x (-30%)
        // 750 gpm = 1.3x (+30%)
        // 1000 gpm = 1.6x (+60%)
        const flowDiff = flowRate - CONSTANTS.NORMAL_FLOW_RATE;
        const ropFactor = 1.0 + (flowDiff / 550) * 0.6;
        return Math.max(0.5, Math.min(1.6, ropFactor));
    }

    static calculateECD(flowRate, depth) {
        // ECD scales linearly with depth
        // At 15,000 ft, use the full ECD values
        // At 0 ft, ECD = 0
        const depthFactor = depth / 15000;
        
        let baseECD = 0;
        if (flowRate < 550) {
            baseECD = 0.3;
        } else if (flowRate < 650) {
            baseECD = 0.6;
        } else if (flowRate < 750) {
            baseECD = 1.0;
        } else if (flowRate < 850) {
            baseECD = 1.3;
        } else {
            baseECD = 2.0;
        }
        
        return baseECD * depthFactor;
    }

    static calculateFlowStallFactor(flowRate) {
        // Below 500 gpm, motor stalls easier
        if (flowRate >= CONSTANTS.LOW_FLOW_THRESHOLD) return 1.0;
        
        // At 400 gpm, stall threshold drops to 90% (1.1x easier to stall)
        const flowDeficit = CONSTANTS.LOW_FLOW_THRESHOLD - flowRate;
        return 1.0 + (flowDeficit / 100) * 0.1;
    }

    static calculateFlowFlopFactor(flowRate) {
        // Below 500 gpm, toolface flops more
        if (flowRate >= CONSTANTS.LOW_FLOW_THRESHOLD) return 1.0;
        
        // At 400 gpm, flops 1.5x more often
        const flowDeficit = CONSTANTS.LOW_FLOW_THRESHOLD - flowRate;
        return 1.0 + (flowDeficit / 100) * 0.5;
    }

    static calculateFlowSpikeFactor(flowRate) {
        // Below 500 gpm, more DP spikes
        if (flowRate >= CONSTANTS.LOW_FLOW_THRESHOLD) return 1.0;
        
        // At 400 gpm, spikes 1.3x more likely
        const flowDeficit = CONSTANTS.LOW_FLOW_THRESHOLD - flowRate;
        return 1.0 + (flowDeficit / 100) * 0.3;
    }

    static calculateKickRisk(currentMW, depth, normalPressureMW) {
        let pressureDifferential = normalPressureMW - currentMW;
        if (pressureDifferential <= 0) return 0;
        return Math.min(100, (pressureDifferential * 10) + (depth / 200));
    }

    static calculateROP(currentWOB, formation) {
        if (currentWOB === 0) return 0;
        return (currentWOB * 6) / formation.hardness;
    }

    static calculateDamage(currentWOB, formation) {
        if (currentWOB === 0) return 0;
        // Increased from 0.0000016 to 0.000008 (5x faster wear)
        return (Math.pow(currentWOB, 2.2)) * 0.0000064 * formation.abrasiveness;
    }

    static calculateDiffPressure(currentWOB, formation, spikeMultiplier = 1.0, isSliding = false) {
        if (currentWOB === 0) return 0;
        
        let baseDP = (currentWOB * CONSTANTS.DP_BASE_MULTIPLIER) / 
                     (formation.hardness / CONSTANTS.DP_HARDNESS_DIVISOR);
        
        if (isSliding) {
            baseDP *= CONSTANTS.SLIDING_ROP_FACTOR;
        }
        
        baseDP *= spikeMultiplier;
        
        let variation = 1 + (Math.random() * 0.15 - 0.075);
        
        return baseDP * variation;
    }

    static calculateMotorHealthDrain(currentDP) {
        if (currentDP < CONSTANTS.MOTOR_50_PERCENT_DP) return 0;
        
        if (currentDP >= CONSTANTS.MOTOR_90_PERCENT_DP) {
            return CONSTANTS.MOTOR_DRAIN_FAST;
        } else if (currentDP >= CONSTANTS.MOTOR_RECOMMENDED_DP) {
            return CONSTANTS.MOTOR_DRAIN_MEDIUM;
        } else {
            return CONSTANTS.MOTOR_DRAIN_SLOW;
        }
    }

    static checkForDPSpike(currentDP, spikeMultiplier, motorHealth, flowSpikeFactor = 1.0) {
        if (currentDP < CONSTANTS.MOTOR_90_PERCENT_DP) return false;
        
        let overThreshold = (currentDP - CONSTANTS.MOTOR_90_PERCENT_DP) / 
                           (CONSTANTS.MOTOR_MAX_DP - CONSTANTS.MOTOR_90_PERCENT_DP);
        
        let healthFactor = 1 + ((100 - motorHealth) / 100);
        let baseProbability = 0.002 * spikeMultiplier * healthFactor * flowSpikeFactor;
        
        let spikeProbability = baseProbability * (1 + Math.pow(overThreshold, 2) * 10);
        
        return Math.random() < spikeProbability;
    }

    static shouldMotorFail(motorHealth) {
        return motorHealth <= 0;
    }

    static calculateFormationDrift(formation, formationDriftDirection) {
        let baseDrift = formation.driftTendency * formationDriftDirection * 0.7;
        let randomVariation = (Math.random() - 0.5) * 0.3;
        return (baseDrift + randomVariation) * CONSTANTS.ROTATE_DRIFT_SPEED;
    }

    static checkLossZone(depth, formation) {
        if (!formation.lossZone) return null;
        const zone = formation.lossZone;
        if (depth >= zone.start && depth <= zone.end) {
            return zone;
        }
        return null;
    }

    static calculateLossRate(mudWeight, lossZone, lcmConcentration) {
        if (!lossZone) return { lossRate: 0, healPercentage: 0 };
        
        const mwDifferential = Math.max(0, mudWeight - lossZone.maxMW);
        if (mwDifferential === 0) return { lossRate: 0, healPercentage: 0 };
        
        const baseLossRate = (mwDifferential / 2.0) * lossZone.maxLossRate;
        
        const lcmNeeded = mwDifferential * 50;
        const healPercentage = Math.min(100, (lcmConcentration / lcmNeeded) * 100);
        
        const actualLossRate = baseLossRate * (1 - healPercentage / 100);
        
        return { lossRate: actualLossRate, healPercentage: healPercentage };
    }

    static checkKickZone(depth, formation) {
        if (!formation.kickZone) return null;
        
        const zone = formation.kickZone;
        if (depth >= zone.start && depth <= zone.end) {
            return zone;
        }
        return null;
    }

    static isKickControlled(mudWeight, kickZone) {
        if (!kickZone) return true;
        return mudWeight >= kickZone.minMW;
    }
}
