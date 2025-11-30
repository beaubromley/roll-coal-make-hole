class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    draw(state) {
        const currentFormation = DrillingMechanics.getFormation(state.depth, state.wellConfig.formations);
        
        // Fill with current formation color
        this.ctx.fillStyle = currentFormation.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw current formation particles
        this.drawRocks(currentFormation, state.dirtOffset, 0, this.canvas.height);
        
        // Draw previous formations above (already drilled through)
        this.drawPreviousFormations(state, currentFormation);
        
        // Draw upcoming formation transition
        this.drawFormationTransition(state, currentFormation);
        
        this.drawTargetPath(state);
        this.drawDrill(state.currentX);
    }

    drawPreviousFormations(state, currentFormation) {
        // Find all formations we've already drilled through
        const formations = state.wellConfig.formations;
        
        for (let i = 0; i < formations.length; i++) {
            const formation = formations[i];
            
            // Skip if this is the current formation or deeper
            if (state.depth < formation.limit) break;
            
            // Calculate where this formation's bottom boundary is on screen
            const boundaryDepth = formation.limit;
            const depthDifference = boundaryDepth - state.depth;
            const screenY = (CONSTANTS.DRILL_Y + 50) + (depthDifference * 0.5);
            
            // Only draw if the formation is visible above the bit
            if (screenY < CONSTANTS.DRILL_Y + 50 && screenY > -500) {
                // Draw this old formation above its boundary
                this.ctx.fillStyle = formation.color;
                this.ctx.fillRect(0, 0, this.canvas.width, screenY);
                
                // Draw particles for this formation
                this.drawRocks(formation, state.dirtOffset, 0, screenY);
            }
        }
    }

    drawFormationTransition(state, currentFormation) {
        const nextFormation = this.getNextFormation(state.depth, state.wellConfig.formations);
        
        if (!nextFormation) return null;
        
        let boundaryDepth = null;
        for (let i = 0; i < state.wellConfig.formations.length; i++) {
            if (state.wellConfig.formations[i].name === currentFormation.name) {
                boundaryDepth = state.wellConfig.formations[i].limit;
                break;
            }
        }
        
        if (boundaryDepth === null) return null;
        
        const distanceToBoundary = boundaryDepth - state.depth;
        
        // Only draw transition when approaching (not after passing)
        if (distanceToBoundary > 500 || distanceToBoundary < 0) return null;
        
        const screenY = (CONSTANTS.DRILL_Y + 50) + (distanceToBoundary * 0.5);
        
        if (screenY > 0 && screenY < this.canvas.height) {
            // Draw the next formation below the boundary line
            this.ctx.fillStyle = nextFormation.color;
            this.ctx.fillRect(0, screenY, this.canvas.width, this.canvas.height - screenY);
            
            // Draw particles for next formation
            this.drawRocks(nextFormation, state.dirtOffset, screenY, this.canvas.height);
            
            // Draw boundary line
            this.ctx.strokeStyle = '#ffeb3b';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([10, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.canvas.width, screenY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // Draw formation label
            this.ctx.fillStyle = '#ffeb3b';
            this.ctx.font = '10px "Press Start 2P"';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(nextFormation.name.toUpperCase(), this.canvas.width - 10, screenY - 10);
            
            // Draw distance to boundary
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '8px "Press Start 2P"';
            this.ctx.fillText(`${Math.floor(distanceToBoundary)} ft`, this.canvas.width - 10, screenY + 20);
        }
        
        return screenY;
    }

    getNextFormation(currentDepth, formations) {
        let foundCurrent = false;
        for (let f of formations) {
            if (foundCurrent) {
                return f;
            }
            if (currentDepth < f.limit) {
                foundCurrent = true;
            }
        }
        return null;
    }

    drawTargetPath(state) {
        this.ctx.strokeStyle = '#ff1744';
        this.ctx.lineWidth = 4;
        
        for (let i = 0; i < state.wellConfig.targetPath.length - 1; i++) {
            const p1 = state.wellConfig.targetPath[i];
            const p2 = state.wellConfig.targetPath[i + 1];
            
            const screenY1 = CONSTANTS.DRILL_Y + (p1.depth - state.depth) * 0.5;
            const screenY2 = CONSTANTS.DRILL_Y + (p2.depth - state.depth) * 0.5;
            
            if (screenY2 >= -50 && screenY1 <= this.canvas.height) {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, screenY1);
                this.ctx.lineTo(p2.x, screenY2);
                this.ctx.stroke();
            }
        }
    }

    drawRocks(formation, offset, startY, endY) {
        this.ctx.fillStyle = formation.particle;
        for (let i = 0; i < this.canvas.width; i += 40) {
            for (let j = -40; j < this.canvas.height + 40; j += 40) {
                const particleY = j + offset + 10;
                if (particleY >= startY && particleY <= endY) {
                    this.ctx.fillRect(i + 10, particleY, 10, 10);
                }
            }
        }
    }

    drawDrill(x) {
        this.ctx.fillStyle = '#90a4ae';
        this.ctx.fillRect(x - 6, 0, 12, CONSTANTS.DRILL_Y);

        this.ctx.fillStyle = '#cfd8dc';
        this.ctx.fillRect(x - 18, CONSTANTS.DRILL_Y, 36, 30);
        
        this.ctx.fillStyle = '#eceff1';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 15, CONSTANTS.DRILL_Y + 30);
        this.ctx.lineTo(x + 15, CONSTANTS.DRILL_Y + 30);
        this.ctx.lineTo(x, CONSTANTS.DRILL_Y + 50);
        this.ctx.fill();
    }
}
