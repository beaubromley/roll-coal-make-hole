// js/ui/DrillersConsole.js

class DrillersConsole {
    static init(gameEngine) {
        this.game = gameEngine;
        this.isMinimized = false;
        this.holdInterval = null;
        this.holdTimeout = null;
        this.currentTab = 'controls';

        // Chart canvases
        this.chartDepthDays = document.getElementById('chart-depth-days');
        this.chartDepthCost = document.getElementById('chart-depth-cost');
        this.ctxDays = this.chartDepthDays?.getContext('2d');
        this.ctxCost = this.chartDepthCost?.getContext('2d');

        // Tab buttons
        document.querySelectorAll('.console-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Minimize/Maximize buttons
        document.getElementById('console-minimize-btn').addEventListener('click', () => {
            this.minimize();
        });

        document.getElementById('console-maximize-btn').addEventListener('click', () => {
            this.maximize();
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
                    }, 50); // Repeat every 50ms (fast)
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

    static switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.console-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.console-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        if (tabName === 'controls') {
            document.getElementById('console-content').classList.add('active');
        } else if (tabName === 'reports') {
            document.getElementById('console-reports').classList.add('active');
            this.drawCharts();
        }
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

    static drawCharts() {
        if (!this.game || !this.game.state) return;

        const perfLog = this.game.state.performanceLog;
        
        if (perfLog.depths.length < 2) {
            // Not enough data yet
            this.drawNoDataMessage(this.ctxDays, 'Insufficient data - drill more!');
            this.drawNoDataMessage(this.ctxCost, 'Insufficient data - drill more!');
            return;
        }

        this.drawDepthVsDaysChart(perfLog);
        this.drawDepthVsCostChart(perfLog);
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

    static drawDepthVsDaysChart(perfLog) {
        if (!this.ctxDays) return;

        const ctx = this.ctxDays;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        // Clear
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        this.drawChartGrid(ctx, width, height);

        // Get data ranges
        const maxDepth = Math.max(...perfLog.depths);
        const maxDays = Math.max(...perfLog.days);

        // Draw line
        ctx.strokeStyle = '#76ff03';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < perfLog.depths.length; i++) {
            const x = (perfLog.days[i] / maxDays) * (width - 40) + 20;
            const y = 20 + ((perfLog.depths[i] / maxDepth) * (height - 40));

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw axes labels
        ctx.fillStyle = '#76ff03';
        ctx.font = '7px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Days', width / 2, height - 5);
        
        ctx.save();
        ctx.translate(10, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Depth (ft)', 0, 0);
        ctx.restore();

        // Draw current values
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText(`${maxDepth.toLocaleString()} ft`, width - 5, 15);
        ctx.fillText(`${maxDays.toFixed(1)} days`, width - 5, height - 25);
    }

    static drawDepthVsCostChart(perfLog) {
        if (!this.ctxCost) return;

        const ctx = this.ctxCost;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        // Clear
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        this.drawChartGrid(ctx, width, height);

        // Get data ranges
        const maxDepth = Math.max(...perfLog.depths);
        const maxCost = Math.max(...perfLog.costs);

        // Draw line
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < perfLog.depths.length; i++) {
            const x = (perfLog.costs[i] / maxCost) * (width - 40) + 20;
            const y = 20 + ((perfLog.depths[i] / maxDepth) * (height - 40));

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw axes labels
        ctx.fillStyle = '#ffeb3b';
        ctx.font = '7px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Cost ($)', width / 2, height - 5);
        
        ctx.save();
        ctx.translate(10, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Depth (ft)', 0, 0);
        ctx.restore();

        // Draw current values
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText(`${maxDepth.toLocaleString()} ft`, width - 5, 15);
        ctx.fillText(`$${(maxCost / 1000000).toFixed(1)}M`, width - 5, height - 25);
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

        // Update charts if on reports tab
        if (this.currentTab === 'reports') {
            this.drawCharts();
        }
    }
}
