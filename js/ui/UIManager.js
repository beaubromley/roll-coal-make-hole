class UIManager {
    static updateDigitalReadouts(state, rop) {
        document.getElementById('depth-readout').innerText = Math.floor(state.depth).toLocaleString() + ' ft';
        document.getElementById('rop-readout').innerText = Math.floor(rop) + ' ft/hr';
        document.getElementById('wob-readout').innerText = state.wob + ' klbs';
        document.getElementById('dp-readout').innerText = Math.floor(state.diffPressure) + ' psi';
        document.getElementById('mw-readout').innerText = state.mudWeight.toFixed(1) + ' ppg';
        
        const dpElement = document.getElementById('dp-readout');
        if (state.diffPressure >= CONSTANTS.MOTOR_STALL_DP) {
            dpElement.style.color = '#ff0000';
        } else if (state.diffPressure > CONSTANTS.MOTOR_RECOMMENDED_DP) {
            dpElement.style.color = '#ff1744';
        } else if (state.diffPressure > CONSTANTS.MOTOR_RECOMMENDED_DP * 0.7) {
            dpElement.style.color = '#ffeb3b';
        } else {
            dpElement.style.color = '#ff00ff';
        }
    }

    static updateStats(state, formation) {
        document.getElementById('costDisplay').innerText = '$' + Math.floor(state.totalCost).toLocaleString();
        document.getElementById('healthDisplay').innerText = Math.floor(state.bitHealth);
        document.getElementById('motorHealthDisplay').innerText = Math.floor(state.motorHealth);
        document.getElementById('motorSpikesDisplay').innerText = state.motorSpikeCount;
        document.getElementById('formationDisplay').innerText = formation.name.toUpperCase();
        document.getElementById('kickRiskDisplay').innerText = Math.floor(state.kickRisk) + '%';
        document.getElementById('lossRateDisplay').innerText = Math.floor(state.currentLossRate);
        document.getElementById('lcmDisplay').innerText = Math.floor(state.lcmConcentration);
        
        const slideFtPercent = state.depth > 0 ? (state.totalSlideDepth / state.depth * 100) : 0;
        const slideTimePercent = state.totalDrillingTime > 0 ? (state.totalSlideTime / state.totalDrillingTime * 100) : 0;
        
        document.getElementById('slideFtDisplay').innerText = slideFtPercent.toFixed(1);
        document.getElementById('slideTimeDisplay').innerText = slideTimePercent.toFixed(1);

        const spikesElement = document.getElementById('motorSpikesDisplay');
        if (state.motorSpikeCount >= CONSTANTS.MOTOR_MIN_SPIKES_TO_FAIL) {
            spikesElement.style.color = '#ff1744';
        } else if (state.motorSpikeCount >= CONSTANTS.MOTOR_MIN_SPIKES_TO_FAIL * 0.7) {
            spikesElement.style.color = '#ffeb3b';
        } else {
            spikesElement.style.color = '#fff';
        }
        
        const lossElement = document.getElementById('lossRateDisplay');
        if (state.currentLossRate > 200) {
            lossElement.style.color = '#ff1744';
        } else if (state.currentLossRate > 100) {
            lossElement.style.color = '#ffeb3b';
        } else if (state.currentLossRate > 0) {
            lossElement.style.color = '#ffa726';
        } else {
            lossElement.style.color = '#fff';
        }

        let totalHours = Math.floor(state.gameFrameCount / CONSTANTS.FRAMES_PER_GAME_HOUR);
        let currentHour = totalHours % 24;
        let currentDay = Math.floor(totalHours / 24) + 1;
        let timeStr = (currentHour < 10 ? "0" : "") + currentHour + ":00";
        document.getElementById('timeDisplay').innerText = `Day ${currentDay} ${timeStr}`;
    }

    static updateModeIndicator(state) {
        const indicator = document.getElementById('mode-indicator');
        if (state.isMotorStalled) {
            indicator.innerText = 'MOTOR STALLED!';
            indicator.style.borderColor = '#ff0000';
            indicator.style.color = '#ff0000';
        } else if (state.isKickActive) {
            indicator.innerText = 'KICK CONTROL';
            indicator.style.borderColor = '#ff1744';
            indicator.style.color = '#ff1744';
        } else if (state.drillingMode === 'sliding') {
            indicator.innerText = `SLIDING ${state.slideDirection === -1 ? 'LEFT' : 'RIGHT'}`;
            indicator.classList.add('sliding');
            indicator.style.borderColor = '#ffeb3b';
            indicator.style.color = '#ffeb3b';
        } else {
            indicator.innerText = 'ROTATING';
            indicator.classList.remove('sliding');
            indicator.style.borderColor = '#76ff03';
            indicator.style.color = '#76ff03';
        }
    }

    static showMessage(title, detail, color, showRestart = true) {
        document.getElementById('msg-title').innerText = title;
        document.getElementById('msg-title').style.color = color;
        document.getElementById('msg-detail').innerText = detail;
        document.getElementById('msg-restart').style.display = showRestart ? 'block' : 'none';
        document.getElementById('message').style.display = 'block';
    }

    static hideMessage() {
        document.getElementById('message').style.display = 'none';
    }

    static showDeviation(deviation) {
        const warning = document.getElementById('deviation-warning');
        if (deviation > 30) {
            warning.style.display = 'block';
            document.getElementById('deviation-amount').innerText = `Deviation: ${Math.floor(deviation)} ft | Losing NPV!`;
        } else {
            warning.style.display = 'none';
        }
    }

    static togglePause(isPaused) {
        document.getElementById('pause-overlay').style.display = isPaused ? 'flex' : 'none';
    }

    static showToast(message, type = 'default') {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        
        if (type === 'warning') toast.classList.add('toast-warning');
        if (type === 'error') toast.classList.add('toast-error');
        if (type === 'success') toast.classList.add('toast-success');
        
        toast.innerText = message;
        
        document.getElementById('game-container').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    static showDPSpikeWarning() {
        const warning = document.createElement('div');
        warning.style.position = 'absolute';
        warning.style.top = '350px';
        warning.style.left = '50%';
        warning.style.transform = 'translateX(-50%)';
        warning.style.background = 'rgba(255, 23, 68, 0.95)';
        warning.style.color = '#fff';
        warning.style.padding = '15px 30px';
        warning.style.border = '3px solid #ff1744';
        warning.style.fontSize = '14px';
        warning.style.fontFamily = '"Press Start 2P", cursive';
        warning.style.zIndex = '20';
        warning.style.textAlign = 'center';
        warning.innerText = '⚠ DIFF PRESSURE SPIKE! ⚠\nReduce WOB!';
        
        document.getElementById('game-container').appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 2000);
    }

    static showMotorStallWarning() {
        const warning = document.createElement('div');
        warning.style.position = 'absolute';
        warning.style.top = '350px';
        warning.style.left = '50%';
        warning.style.transform = 'translateX(-50%)';
        warning.style.background = 'rgba(255, 0, 0, 0.95)';
        warning.style.color = '#fff';
        warning.style.padding = '15px 30px';
        warning.style.border = '3px solid #ff0000';
        warning.style.fontSize = '14px';
        warning.style.fontFamily = '"Press Start 2P", cursive';
        warning.style.zIndex = '20';
        warning.style.textAlign = 'center';
        warning.innerText = '🛑 MOTOR STALLED! 🛑\nReduce WOB to continue drilling';
        
        document.getElementById('game-container').appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 3000);
    }

    static showLossWarning(maxMW) {
        const warning = document.createElement('div');
        warning.style.position = 'absolute';
        warning.style.top = '350px';
        warning.style.left = '50%';
        warning.style.transform = 'translateX(-50%)';
        warning.style.background = 'rgba(255, 152, 0, 0.95)';
        warning.style.color = '#fff';
        warning.style.padding = '15px 30px';
        warning.style.border = '3px solid #ff9800';
        warning.style.fontSize = '14px';
        warning.style.fontFamily = '"Press Start 2P", cursive';
        warning.style.zIndex = '20';
        warning.style.textAlign = 'center';
        warning.innerText = `⚠ MUD LOSSES DETECTED! ⚠\nReduce MW below ${maxMW.toFixed(1)} ppg\nor add LCM!`;
        
        document.getElementById('game-container').appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 3000);
    }
}
