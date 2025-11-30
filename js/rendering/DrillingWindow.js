class DrillingWindow {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    draw(state) {
        // Clear
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw grid
        this.drawGrid();

        // Get current target position
        const targetX = DrillingMechanics.getTargetPathX(state.depth, state.wellConfig.targetPath);
        
        // Calculate positions relative to center
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Scale factor for the window (showing ±100 ft horizontally)
        const scale = this.width / 200;
        
        // Draw target path (vertical line in center when on target)
        const targetOffsetX = (targetX - state.currentX) * scale;
        const targetScreenX = centerX + targetOffsetX;
        
        this.ctx.strokeStyle = '#ff1744';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(targetScreenX, 0);
        this.ctx.lineTo(targetScreenX, this.height);
        this.ctx.stroke();

        // Draw acceptable deviation zone (±30 ft)
        const deviationZoneWidth = 30 * scale;
        this.ctx.fillStyle = 'rgba(118, 255, 3, 0.1)';
        this.ctx.fillRect(
            targetScreenX - deviationZoneWidth,
            0,
            deviationZoneWidth * 2,
            this.height
        );

        // Draw zone boundaries
        this.ctx.strokeStyle = '#76ff03';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(targetScreenX - deviationZoneWidth, 0);
        this.ctx.lineTo(targetScreenX - deviationZoneWidth, this.height);
        this.ctx.moveTo(targetScreenX + deviationZoneWidth, 0);
        this.ctx.lineTo(targetScreenX + deviationZoneWidth, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw drill bit (always in center)
        this.drawBit(centerX, centerY);

        // Draw deviation indicator
        const deviation = Math.abs(state.currentX - targetX);
        this.drawDeviationText(deviation);
    }

    drawGrid() {
        this.ctx.strokeStyle = '#1a3a1a';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.width; x += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.height; y += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        // Center crosshair
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.moveTo(0, this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2);
        this.ctx.stroke();
    }

    drawBit(x, y) {
        // Draw bit as a triangle
        this.ctx.fillStyle = '#eceff1';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 8, y - 10);
        this.ctx.lineTo(x + 8, y - 10);
        this.ctx.lineTo(x, y + 10);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw bit outline
        this.ctx.strokeStyle = '#90a4ae';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawDeviationText(deviation) {
        this.ctx.fillStyle = deviation > 30 ? '#ff1744' : '#76ff03';
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.floor(deviation)} ft`, this.width / 2, this.height - 10);
    }
}
