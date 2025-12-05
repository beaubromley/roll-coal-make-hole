// js/ui/DrillersConsole.js

class DrillersConsole {
    static init(gameEngine) {
        this.game = gameEngine;
        this.isMinimized = false;
        this.holdInterval = null;
        this.holdTimeout = null;

        // Chart canvases
        this.chartDepthDays = document.getElementById('chart-depth-days');
        this.chartDepthCost = document.getElementById('chart-depth-cost');
        this.chartFinalDays = document.getElementById('chart-final-days');
        this.chartFinalCost = document.getElementById('chart-final-cost');

        // Minimize/Maximize buttons
        document.getElementById('console-minimize-btn').addEventListener('click', () => {
            this.minimize();
        });

        document.getElementById('console-maximize-btn').addEventListener('click', () => {
            this.maximize();
        });

		// Pause button
		document.getElementById('console-pause-btn').addEventListener('click', () => {
			this.togglePause();
		});

        // Mode buttons (Slide Left, Rotate, Slide Right)
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                this.handleModeClick(mode);
            });
        });

        // Parameter buttons (WOB, Flow, MW, LCM) with hold-to-repeat
        document.querySelectorAll('.param-btn').forEach(btn => {
            // Mouse events
            btn.addEventListener('mousedown', () => {
                const param = btn.getAttribute('data-param');
                const direction = btn.getAttribute('data-direction');
                
                // Immediate action on mouse down
                this.handleParamClick(param, direction);
                
                // Start repeating after 300ms delay
                this.holdTimeout = setTimeout(() => {
                    this.holdInterval = setInterval(() => {
                        this.handleParamClick(param, direction);
                    }, 50);
                }, 300);
            });

            btn.addEventListener('mouseup', () => {
                this.stopHold();
            });

            btn.addEventListener('mouseleave', () => {
                this.stopHold();
            });

            // Touch events for mobile
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const param = btn.getAttribute('data-param');
                const direction = btn.getAttribute('data-direction');
                
                this.handleParamClick(param, direction);
                
                this.holdTimeout = setTimeout(() => {
                    this.holdInterval = setInterval(() => {
                        this.handleParamClick(param, direction);
                    }, 50);
                }, 300);
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopHold();
            });
        });
    }

    static stopHold() {
        if (this.holdTimeout) {
            clearTimeout(this.holdTimeout);
            this.holdTimeout = null;
        }
        if (this.holdInterval) {
            clearInterval(this.holdInterval);
            this.holdInterval = null;
        }
    }

    static minimize() {
        this.isMinimized = true;
        document.body.classList.add('console-minimized');
    }

    static maximize() {
        this.isMinimized = false;
        document.body.classList.remove('console-minimized');
    }
	
	static togglePause() {
    if (!this.game || !this.game.state || !this.game.state.hasStarted || this.game.state.isGameOver || this.game.state.waitingForAcknowledge) return;
    
    // Simulate P key press
    const event = new KeyboardEvent('keydown', { code: 'KeyP' });
    window.dispatchEvent(event);
	}

    static handleModeClick(mode) {
        if (!this.game || !this.game.state || this.game.state.isPaused || this.game.state.waitingForAcknowledge) return;

        // Remove active class from all mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));

        // Simulate keyboard press
        if (mode === 'slide-left') {
            const event = new KeyboardEvent('keydown', { code: 'KeyA' });
            window.dispatchEvent(event);
            document.querySelector('[data-mode="slide-left"]').classList.add('active');
        } else if (mode === 'rotate') {
            const event = new KeyboardEvent('keydown', { code: 'KeyS' });
            window.dispatchEvent(event);
            document.querySelector('[data-mode="rotate"]').classList.add('active');
        } else if (mode === 'slide-right') {
            const event = new KeyboardEvent('keydown', { code: 'KeyD' });
            window.dispatchEvent(event);
            document.querySelector('[data-mode="slide-right"]').classList.add('active');
        }
    }

    static handleParamClick(param, direction) {
        if (!this.game || !this.game.state) return;

        let keyCode;
        if (param === 'wob') {
            keyCode = direction === 'up' ? 'ArrowUp' : 'ArrowDown';
        } else if (param === 'flow') {
            keyCode = direction === 'up' ? 'KeyR' : 'KeyF';
        } else if (param === 'mw') {
            keyCode = direction === 'up' ? 'KeyT' : 'KeyG';
        } else if (param === 'lcm') {
            keyCode = direction === 'up' ? 'KeyY' : 'KeyH';
        }

        const event = new KeyboardEvent('keydown', { code: keyCode });
        window.dispatchEvent(event);
    }

    static drawPauseCharts(state) {
        if (!state || !this.chartDepthDays || !this.chartDepthCost) return;

        const perfLog = state.performanceLog;
        
        if (perfLog.depths.length < 2) {
            this.drawNoDataMessage(this.chartDepthDays.getContext('2d'), 'Insufficient data');
            this.drawNoDataMessage(this.chartDepthCost.getContext('2d'), 'Insufficient data');
            return;
        }

        this.drawDepthVsDaysChart(this.chartDepthDays.getContext('2d'), perfLog);
        this.drawDepthVsCostChart(this.chartDepthCost.getContext('2d'), perfLog);
    }

    static drawFinalCharts(state) {
        if (!state || !this.chartFinalDays || !this.chartFinalCost) return;

        const perfLog = state.performanceLog;
        
        if (perfLog.depths.length < 2) {
            this.drawNoDataMessage(this.chartFinalDays.getContext('2d'), 'Insufficient data');
            this.drawNoDataMessage(this.chartFinalCost.getContext('2d'), 'Insufficient data');
            return;
        }

        this.drawDepthVsDaysChart(this.chartFinalDays.getContext('2d'), perfLog);
        this.drawDepthVsCostChart(this.chartFinalCost.getContext('2d'), perfLog);
    }

    static drawNoDataMessage(ctx, message) {
        if (!ctx) return;
        
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = '#76ff03';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(message, ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

    static drawDepthVsDaysChart(ctx, perfLog) {
		if (!ctx) return;

		const width = ctx.canvas.width;
		const height = ctx.canvas.height;

		// Clear
		ctx.fillStyle = '#1a1a1a';
		ctx.fillRect(0, 0, width, height);

		// Draw grid
		this.drawChartGrid(ctx, width, height);

		// Get data ranges with 10% padding
		const maxDepth = Math.max(...perfLog.depths);
		const maxDays = Math.max(...perfLog.days);
		const depthPadding = maxDepth * 0.1;
		const daysPadding = maxDays * 0.1;

		// Draw axis tick labels
		ctx.fillStyle = '#76ff03';
		ctx.font = '6px "Press Start 2P"';
		
		// Y-axis (depth) labels - 4 ticks
		ctx.textAlign = 'right';
		for (let i = 0; i <= 4; i++) {
			const depth = (maxDepth / 4) * i;
			const y = 20 + ((depth / (maxDepth + depthPadding)) * (height - 40));
			
			// Show full numbers if this tick is < 1000, otherwise use "k" format
			let label;
			if (depth < 1000) {
				label = Math.floor(depth).toString();
			} else {
				label = `${Math.floor(depth / 1000)}k`;
			}
			ctx.fillText(label, 38, y + 3);
		}
		
		// X-axis (days) labels - 4 ticks
		ctx.textAlign = 'center';
		for (let i = 0; i <= 4; i++) {
			const days = (maxDays / 4) * i;
			const x = (days / (maxDays + daysPadding)) * (width - 40) + 20;
			ctx.fillText(days.toFixed(1), x, height - 22);
		}

		// Draw line
		ctx.strokeStyle = '#76ff03';
		ctx.lineWidth = 2;
		ctx.beginPath();

		for (let i = 0; i < perfLog.depths.length; i++) {
			const x = (perfLog.days[i] / (maxDays + daysPadding)) * (width - 40) + 20;
			const y = 20 + ((perfLog.depths[i] / (maxDepth + depthPadding)) * (height - 40));

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();

		// Draw axes titles
		ctx.fillStyle = '#76ff03';
		ctx.font = '7px "Press Start 2P"';
		ctx.textAlign = 'center';
		ctx.fillText('Days', width / 2, height - 5);
		
		ctx.save();
		ctx.translate(10, height / 2);
		ctx.rotate(-Math.PI / 2);
		ctx.fillText('Depth (ft)', 0, 0);
		ctx.restore();

		// Draw max values in corner
		ctx.textAlign = 'right';
		ctx.fillStyle = '#fff';
		ctx.font = '6px "Press Start 2P"';
		ctx.fillText(`${maxDepth.toLocaleString()} ft`, width - 5, height - 15);
		ctx.fillText(`${maxDays.toFixed(1)} days`, width - 5, 15);
	}

    static drawDepthVsCostChart(ctx, perfLog) {
		if (!ctx) return;

		const width = ctx.canvas.width;
		const height = ctx.canvas.height;

		// Clear
		ctx.fillStyle = '#1a1a1a';
		ctx.fillRect(0, 0, width, height);

		// Draw grid
		this.drawChartGrid(ctx, width, height);

		// Get data ranges with 10% padding
		const maxDepth = Math.max(...perfLog.depths);
		const maxCost = Math.max(...perfLog.costs);
		const depthPadding = maxDepth * 0.1;
		const costPadding = maxCost * 0.1;

		// Draw axis tick labels
		ctx.fillStyle = '#ffeb3b';
		ctx.font = '6px "Press Start 2P"';
		
		// Y-axis (depth) labels - 4 ticks
		ctx.textAlign = 'right';
		for (let i = 0; i <= 4; i++) {
			const depth = (maxDepth / 4) * i;
			const y = 20 + ((depth / (maxDepth + depthPadding)) * (height - 40));
			
			// Show full numbers if this tick is < 1000, otherwise use "k" format
			let label;
			if (depth < 1000) {
				label = Math.floor(depth).toString();
			} else {
				label = `${Math.floor(depth / 1000)}k`;
			}
			ctx.fillText(label, 38, y + 3);
		}

		
		// X-axis (cost) labels - 4 ticks
		ctx.textAlign = 'center';
		for (let i = 0; i <= 4; i++) {
			const cost = (maxCost / 4) * i;
			const x = (cost / (maxCost + costPadding)) * (width - 40) + 20;
			const costM = cost / 1000000;
			ctx.fillText(`$${costM.toFixed(1)}M`, x, height - 22);
		}

		// Draw line
		ctx.strokeStyle = '#ffeb3b';
		ctx.lineWidth = 2;
		ctx.beginPath();

		for (let i = 0; i < perfLog.depths.length; i++) {
			const x = (perfLog.costs[i] / (maxCost + costPadding)) * (width - 40) + 20;
			const y = 20 + ((perfLog.depths[i] / (maxDepth + depthPadding)) * (height - 40));

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();

		// Draw axes titles
		ctx.fillStyle = '#ffeb3b';
		ctx.font = '7px "Press Start 2P"';
		ctx.textAlign = 'center';
		ctx.fillText('Cost ($)', width / 2, height - 5);
		
		ctx.save();
		ctx.translate(10, height / 2);
		ctx.rotate(-Math.PI / 2);
		ctx.fillText('Depth (ft)', 0, 0);
		ctx.restore();

		// Draw max values in corner
		ctx.textAlign = 'right';
		ctx.fillStyle = '#fff';
		ctx.font = '6px "Press Start 2P"';
		ctx.fillText(`${maxDepth.toLocaleString()} ft`, width - 5, height - 15);
		ctx.fillText(`$${(maxCost / 1000000).toFixed(1)}M`, width - 5, 15);
	}


    static drawChartGrid(ctx, width, height) {
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 20; x < width - 20; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 10);
            ctx.lineTo(x, height - 20);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 10; y < height - 20; y += 30) {
            ctx.beginPath();
            ctx.moveTo(20, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#76ff03';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 10);
        ctx.lineTo(20, height - 20);
        ctx.lineTo(width - 20, height - 20);
        ctx.stroke();
    }

	static update(state) {
		if (!state) return;

		// Update display values
		document.getElementById('console-wob-display').innerText = state.wob;
		document.getElementById('console-flow-display').innerText = state.flowRate;
		document.getElementById('console-mw-display').innerText = state.baseMudWeight.toFixed(1);
		document.getElementById('console-lcm-display').innerText = Math.floor(state.lcmConcentration);

		// Update pause button appearance
		const pauseBtn = document.getElementById('console-pause-btn');
		if (state.isPaused) {
			pauseBtn.classList.add('paused');
			pauseBtn.innerHTML = '▶ RESUME';
		} else {
			pauseBtn.classList.remove('paused');
			pauseBtn.innerHTML = '⏸ PAUSE';
		}

		// Update active mode button
		document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
		if (state.drillingMode === 'sliding') {
			if (state.slideDirection === -1) {
				document.querySelector('[data-mode="slide-left"]')?.classList.add('active');
			} else {
				document.querySelector('[data-mode="slide-right"]')?.classList.add('active');
			}
		} else {
			document.querySelector('[data-mode="rotate"]')?.classList.add('active');
		}
	}
}
