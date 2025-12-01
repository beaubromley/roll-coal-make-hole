class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    draw(state) {
        const currentFormation = DrillingMechanics.getFormation(state.depth, state.wellConfig.formations);
        
        this.ctx.fillStyle = currentFormation.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawRocks(currentFormation, state.dirtOffset, 0, this.canvas.height);
        
        this.drawPreviousFormations(state, currentFormation);
        
        this.drawFormationTransition(state, currentFormation);
        
        this.drawTargetPath(state);
        this.drawDrill(state.currentX);
    }

    drawPreviousFormations(state, currentFormation) {
        const formations = state.wellConfig.formations;
        
        for (let i = 0; i < formations.length; i++) {
            const formation = formations[i];
            
            if (state.depth < formation.limit) break;
            
            const boundaryDepth = formation.limit;
            const depthDifference = boundaryDepth - state.depth;
            const screenY = (CONSTANTS.DRILL_Y + 50) + (depthDifference * 0.5);
            
            if (screenY < CONSTANTS.DRILL_Y + 50 && screenY > -500) {
                this.ctx.fillStyle = formation.color;
                this.ctx.fillRect(0, 0, this.canvas.width, screenY);
                
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
        
        if (distanceToBoundary > 500 || distanceToBoundary < 0) return null;
        
        const screenY = (CONSTANTS.DRILL_Y + 50) + (distanceToBoundary * 0.5);
        
        if (screenY > 0 && screenY < this.canvas.height) {
            this.ctx.fillStyle = nextFormation.color;
            this.ctx.fillRect(0, screenY, this.canvas.width, this.canvas.height - screenY);
            
            this.drawRocks(nextFormation, state.dirtOffset, screenY, this.canvas.height);
            
            this.ctx.strokeStyle = '#ffeb3b';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([10, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.canvas.width, screenY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            this.ctx.fillStyle = '#ffeb3b';
            this.ctx.font = '10px "Press Start 2P"';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(nextFormation.name.toUpperCase(), this.canvas.width - 10, screenY - 10);
            
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
        this.ctx.setLineDash([15, 10]); // Long dashes: 15px dash, 10px gap
        
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
        
        this.ctx.setLineDash([]); // Reset to solid for other drawing
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
        // Drill pipe/string
        this.ctx.fillStyle = '#90a4ae';
        this.ctx.fillRect(x - 6, 0, 12, CONSTANTS.DRILL_Y);

        // BHA (Bottom Hole Assembly) - thicker section
        this.ctx.fillStyle = '#78909c';
        this.ctx.fillRect(x - 14, CONSTANTS.DRILL_Y, 28, 20);
        
        // Motor housing
        this.ctx.fillStyle = '#546e7a';
        this.ctx.fillRect(x - 16, CONSTANTS.DRILL_Y + 20, 32, 18);

        // PDC Bit body - main cylinder with rounded bottom
        this.ctx.fillStyle = '#37474f';
        this.ctx.fillRect(x - 18, CONSTANTS.DRILL_Y + 38, 36, 20);
        
        // Rounded shoulders
        this.ctx.fillStyle = '#263238';
        this.ctx.fillRect(x - 20, CONSTANTS.DRILL_Y + 54, 40, 4);
        
        // Angled bit face
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 20, CONSTANTS.DRILL_Y + 58);
        this.ctx.lineTo(x - 20, CONSTANTS.DRILL_Y + 68);
        this.ctx.lineTo(x - 12, CONSTANTS.DRILL_Y + 64);
        this.ctx.lineTo(x + 12, CONSTANTS.DRILL_Y + 64);
        this.ctx.lineTo(x + 20, CONSTANTS.DRILL_Y + 68);
        this.ctx.lineTo(x + 20, CONSTANTS.DRILL_Y + 58);
        this.ctx.closePath();
        this.ctx.fill();
        
        // PDC cutters (slate gray with black outlines)
        const cutterColor = '#607d8b';
        const outlineColor = '#000';
        
        // Helper function to draw cutter with outline
        const drawCutter = (cx, cy, width, height) => {
            // Black outline
            this.ctx.fillStyle = outlineColor;
            this.ctx.fillRect(cx - 1, cy - 1, width + 2, height + 2);
            // Gray cutter
            this.ctx.fillStyle = cutterColor;
            this.ctx.fillRect(cx, cy, width, height);
        };
        
        // Bottom edge cutters (angled profile - lower on outside, higher in middle)
        drawCutter(x - 19, CONSTANTS.DRILL_Y + 66, 4, 4); // Outer left (lowest)
        drawCutter(x - 14, CONSTANTS.DRILL_Y + 64, 4, 4);
        drawCutter(x - 9, CONSTANTS.DRILL_Y + 63, 4, 4);
        drawCutter(x - 4, CONSTANTS.DRILL_Y + 62, 4, 4);  // Center-left
        drawCutter(x + 1, CONSTANTS.DRILL_Y + 62, 4, 4);  // Center-right
        drawCutter(x + 6, CONSTANTS.DRILL_Y + 63, 4, 4);
        drawCutter(x + 11, CONSTANTS.DRILL_Y + 64, 4, 4);
        drawCutter(x + 16, CONSTANTS.DRILL_Y + 66, 4, 4); // Outer right (lowest)
        
        // Side cutters running up the edges
        // Left side
        drawCutter(x - 19, CONSTANTS.DRILL_Y + 62, 3, 3);
        drawCutter(x - 19, CONSTANTS.DRILL_Y + 58, 3, 3);
        
        // Right side
        drawCutter(x + 17, CONSTANTS.DRILL_Y + 62, 3, 3);
        drawCutter(x + 17, CONSTANTS.DRILL_Y + 58, 3, 3);
        
        // Add detail line on bit body
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 18, CONSTANTS.DRILL_Y + 46);
        this.ctx.lineTo(x + 18, CONSTANTS.DRILL_Y + 46);
        this.ctx.stroke();
    }
}
