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
        
        const transitionY = this.drawFormationTransition(state, currentFormation);
        
        this.drawTargetPath(state);
        this.drawDrill(state.currentX);
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
        
        if (distanceToBoundary > 500 || distanceToBoundary < -100) return null;
        
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
