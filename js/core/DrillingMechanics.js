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

    static calculateKickRisk(currentMW, depth, normalPressureMW) {
        let pressureDifferential = normalPressureMW - currentMW;
        if (pressureDifferential <= 0) return 0;
        return Math.min(100, (pressureDifferential * 10) + (depth / 200));
    }

    static calculateROP(currentWOB, formation) {
        if (currentWOB === 0) return 0;
        return (currentWOB * 10) / formation.hardness;
    }

    static calculateDamage(currentWOB, formation) {
        if (currentWOB === 0) return 0;
        return (Math.pow(currentWOB, 2.2)) * 0.0000016 * formation.abrasiveness;
    }

    static calculateDiffPressure(currentWOB, formation, spikeMultiplier = 1.0, isSliding = false) {
        if (currentWOB === 0) return 0;
        
        let baseDP = (currentWOB * CONSTANTS.DP_BASE_MULTIPLIER) / 
                     (formation.hardness / CONSTANTS.DP_HARDNESS_DIVISOR);
        
        if (isSliding) {
            baseDP *= CONSTANTS.SLIDING_ROP_FACTOR;
        }
        
        baseDP *= spikeMultiplier;
        
        // Increased variation: ±50-100 psi range
        let variation = 1 + (Math.random() * 0.15 - 0.075);
        
        return Math.min(baseDP * variation, CONSTANTS.MOTOR_MAX_DP);
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

    static checkForDPSpike(currentDP, spikeMultiplier, motorSpikeCount) {
        // Only check if we're above 90% threshold (1350 psi)
        if (currentDP < CONSTANTS.MOTOR_90_PERCENT_DP) return false;
        
        // Calculate spike probability based on how far over 90% we are
        let overThreshold = (currentDP - CONSTANTS.MOTOR_90_PERCENT_DP) / 
                           (CONSTANTS.MOTOR_MAX_DP - CONSTANTS.MOTOR_90_PERCENT_DP);
        
        // Base probability increases with spike history
        let baseProbability = 0.002 * spikeMultiplier;
        
        // Probability increases exponentially as we approach max DP
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
