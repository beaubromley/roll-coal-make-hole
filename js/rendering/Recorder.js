class Recorder {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    logDataPoint(state, rop) {
        state.logData.rop.push(rop);
        state.logData.wob.push(state.wob);
        state.logData.diffPressure.push(state.diffPressure);
        state.logData.flowRate.push(state.flowRate);

        if (state.logData.rop.length > CONSTANTS.MAX_LOG_POINTS) {
            state.logData.rop.shift();
            state.logData.wob.shift();
            state.logData.diffPressure.shift();
            state.logData.flowRate.shift();
        }
    }

    draw(state) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, width, height);

        this.drawGrid(width, height);

        if (state.logData.rop.length < 2) return;

        const numPoints = state.logData.rop.length;
        const xStep = width / CONSTANTS.MAX_LOG_POINTS;

        // Track 1: ROP (Green)
        this.drawTrack(state.logData.rop, xStep, numPoints, '#76ff03', 
            (val) => Math.min(val / 600, 1), 37.5, 35);
        
        // Track 2: WOB (Yellow)
        this.drawTrack(state.logData.wob, xStep, numPoints, '#ffeb3b', 
            (val) => val / 80, 75, 35);
        
        // Track 3: Diff Pressure (Magenta)
        this.drawTrack(state.logData.diffPressure, xStep, numPoints, '#ff00ff', 
            (val) => val / CONSTANTS.MOTOR_MAX_DP, 112.5, 35);
        
        // Track 4: Flow Rate (Cyan)
        this.drawTrack(state.logData.flowRate, xStep, numPoints, '#00ffff', 
            (val) => (val - CONSTANTS.MIN_FLOW_RATE) / (CONSTANTS.MAX_FLOW_RATE - CONSTANTS.MIN_FLOW_RATE), 150, 35);

        this.drawLabels();
        this.drawDPThresholdLine();
    }

    drawGrid(width, height) {
        this.ctx.strokeStyle = '#1a3a1a';
        this.ctx.lineWidth = 1;
        
        for (let y = 0; y < height; y += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        for (let x = 0; x < width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
    }

    drawTrack(data, xStep, numPoints, color, normalizer, baseY, range) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i < numPoints; i++) {
            const x = i * xStep;
            const normalized = normalizer(data[i]);
            const y = baseY - (normalized * range);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }

    drawDPThresholdLine() {
        const thresholdY = 112.5 - ((CONSTANTS.MOTOR_RECOMMENDED_DP / CONSTANTS.MOTOR_MAX_DP) * 35);
        
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, thresholdY);
        this.ctx.lineTo(this.canvas.width, thresholdY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawLabels() {
        this.ctx.font = '8px "Press Start 2P"';
        
        this.ctx.fillStyle = '#76ff03';
        this.ctx.fillText('ROP', 5, 10);
        
        this.ctx.fillStyle = '#ffeb3b';
        this.ctx.fillText('WOB', 5, 47);
        
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillText('DIFF P', 5, 85);
        
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillText('FLOW', 5, 122);
    }
}
