class MenuManager {
    static init() {
        this.currentWellType = null;
        this.setupStartScreen();
        this.setupWellSelectScreen();
        this.setupHighScoreScreen();
        this.setupAutoScroll();
        this.loadHighScores();
    }

    static setupStartScreen() {
        const startButton = document.getElementById('start-button');
        const viewScoresButton = document.getElementById('view-scores-button');
        
        startButton.addEventListener('click', () => {
            this.showWellSelect();
        });

        if (viewScoresButton) {
            viewScoresButton.addEventListener('click', () => {
                this.showHighScoreMenu();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' && this.isScreenVisible('start-screen')) {
                this.showWellSelect();
            }
            if (e.code === 'KeyH' && this.isScreenVisible('start-screen')) {
                this.showHighScoreMenu();
            }
        });
    }

    static setupWellSelectScreen() {
        const selectButtons = document.querySelectorAll('.select-button');
        const wellCards = document.querySelectorAll('.well-card');
        const backButton = document.getElementById('back-from-select-button');

        if (backButton) {
            backButton.addEventListener('click', () => {
                this.returnToStart();
            });
        }

        selectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const wellType = button.getAttribute('data-well');
                this.startGame(wellType);
            });
        });

        wellCards.forEach(card => {
            card.addEventListener('click', () => {
                const wellType = card.getAttribute('data-well');
                this.startGame(wellType);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (this.isScreenVisible('well-select-screen')) {
                if (e.code === 'Digit1') {
                    this.startGame('powder');
                } else if (e.code === 'Digit2') {
                    this.startGame('williston');
                } else if (e.code === 'Digit3') {
                    this.startGame('eagleford');
                } else if (e.code === 'Digit4') {
                    this.startGame('stack');
                } else if (e.code === 'Digit5') {
                    this.startGame('delaware');
                } else if (e.code === 'Digit6') {
                    this.startGame('armageddon');
                } else if (e.code === 'Escape') {
                    this.returnToStart();
                }
            }
        });
    }

    static setupAutoScroll() {
        let scrollInterval = null;
        
        document.addEventListener('mousemove', (e) => {
            const wellOptions = document.getElementById('well-options');
            if (!wellOptions || !this.isScreenVisible('well-select-screen')) {
                if (scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }
                return;
            }

            const rect = wellOptions.getBoundingClientRect();
            const edgeThreshold = 100;
            const scrollSpeed = 50; // Changed from 5 to 50 (10x faster)

            // Check if mouse is near left edge
            if (e.clientX < rect.left + edgeThreshold && wellOptions.scrollLeft > 0) {
                if (!scrollInterval) {
                    scrollInterval = setInterval(() => {
                        wellOptions.scrollLeft -= scrollSpeed;
                    }, 16);
                }
            }
            // Check if mouse is near right edge
            else if (e.clientX > rect.right - edgeThreshold && 
                     wellOptions.scrollLeft < wellOptions.scrollWidth - wellOptions.clientWidth) {
                if (!scrollInterval) {
                    scrollInterval = setInterval(() => {
                        wellOptions.scrollLeft += scrollSpeed;
                    }, 16);
                }
            }
            // Not near edges
            else {
                if (scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }
            }
        });
    }

    static setupHighScoreScreen() {
        const backButton = document.getElementById('back-to-menu-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.returnToStart();
            });
        }

        const backFromScoresButton = document.getElementById('back-from-scores-button');
        if (backFromScoresButton) {
            backFromScoresButton.addEventListener('click', () => {
                this.returnToStart();
            });
        }

        const submitButton = document.getElementById('submit-score-button');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.submitScore();
            });
        }

        const nameInput = document.getElementById('player-name');
        if (nameInput) {
            nameInput.addEventListener('keydown', (e) => {
                if (e.code === 'Enter') {
                    this.submitScore();
                }
            });
        }

        const quitButton = document.getElementById('quit-to-menu-button');
        if (quitButton) {
            quitButton.addEventListener('click', () => {
                this.quitToMenu();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && window.game && window.game.state && window.game.state.isPaused) {
                this.quitToMenu();
            }
            if (e.code === 'Escape' && this.isScreenVisible('highscore-menu-screen')) {
                this.returnToStart();
            }
        });
    }

    static isScreenVisible(screenId) {
        const screen = document.getElementById(screenId);
        return screen && screen.style.display !== 'none';
    }

    static showWellSelect() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('well-select-screen').style.display = 'flex';
        document.getElementById('highscore-screen').style.display = 'none';
        const menuScreen = document.getElementById('highscore-menu-screen');
        if (menuScreen) menuScreen.style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        
        this.updateWellCardHighScores();
    }

    static updateWellCardHighScores() {
        Object.keys(WELL_CONFIGS).forEach(wellType => {
            const scores = this.getHighScores(wellType);
            const element = document.getElementById(`highscore-${wellType}`);
            
            if (element) {
                const valueDiv = element.querySelector('.highscore-value');
                if (scores.length > 0) {
                    const best = scores[0];
                    valueDiv.innerHTML = `${best.name} - $${Math.floor(best.cost).toLocaleString()}<br>${best.gameTime}`;
                } else {
                    valueDiv.innerText = 'No scores yet';
                }
            }
        });
    }

    static showHighScoreMenu() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('well-select-screen').style.display = 'none';
        document.getElementById('highscore-screen').style.display = 'none';
        document.getElementById('highscore-menu-screen').style.display = 'flex';
        document.getElementById('game-container').style.display = 'none';
        
        this.populateHighScoreMenu();
    }

    static populateHighScoreMenu() {
        const container = document.getElementById('highscore-menu-wells');
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.keys(WELL_CONFIGS).forEach((wellType, index) => {
            const wellConfig = WELL_CONFIGS[wellType];
            const button = document.createElement('button');
            button.className = 'menu-button';
            button.style.marginBottom = '15px';
            button.innerText = `${wellConfig.name} [${index + 1}]`;
            button.addEventListener('click', () => {
                this.showHighScores(wellType);
            });
            container.appendChild(button);
        });
    }

    static startGame(wellType) {
        this.currentWellType = wellType;
        document.getElementById('well-select-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        
        if (window.game) {
            window.game.loadWell(wellType);
        }
    }

    static returnToStart() {
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('highscore-screen').style.display = 'none';
        const menuScreen = document.getElementById('highscore-menu-screen');
        if (menuScreen) menuScreen.style.display = 'none';
        document.getElementById('well-select-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'flex';
    }

    static quitToMenu() {
        if (window.game) {
            window.game.isRunning = false;
            window.game.state.isPaused = false;
            UIManager.togglePause(false);
        }
        this.returnToStart();
    }

    static checkHighScore(wellType, cost, gameTime) {
        const scores = this.getHighScores(wellType);
        
        if (scores.length < 10) return true;
        
        return cost < scores[scores.length - 1].cost;
    }

    static showNameEntry(wellType, cost, gameTime, totalDepth) {
        this.pendingScore = { wellType, cost, gameTime, totalDepth };
        
        const timeParts = gameTime.match(/(\d+)d (\d+)h/);
        const days = parseInt(timeParts[1]);
        const hours = parseInt(timeParts[2]);
        const totalDays = days + (hours / 24);
        const ftPerDay = Math.floor(totalDepth / totalDays);
        const costPerFt = Math.floor(cost / totalDepth);
        
        document.getElementById('score-details').innerText = 
            `Well: ${WELL_CONFIGS[wellType].name}\n` +
            `Final Cost: $${Math.floor(cost).toLocaleString()}\n` +
            `Time: ${gameTime}\n` +
            `Depth: ${totalDepth.toLocaleString()} ft\n\n` +
            `Performance:\n` +
            `${ftPerDay.toLocaleString()} ft/day\n` +
            `$${costPerFt.toLocaleString()}/ft`;
        
        document.getElementById('name-entry-screen').style.display = 'flex';
        document.getElementById('player-name').value = '';
        document.getElementById('player-name').focus();
    }

    static submitScore() {
        const name = document.getElementById('player-name').value.trim() || 'DRILLER';
        
        if (this.pendingScore) {
            this.addHighScore(
                this.pendingScore.wellType,
                name,
                this.pendingScore.cost,
                this.pendingScore.gameTime,
                this.pendingScore.totalDepth
            );
            
            document.getElementById('name-entry-screen').style.display = 'none';
            this.showHighScores(this.pendingScore.wellType);
            this.pendingScore = null;
        }
    }

    static showHighScores(wellType) {
        const scores = this.getHighScores(wellType);
        const tbody = document.getElementById('highscore-list');
        tbody.innerHTML = '';
        
        document.getElementById('highscore-well-name').innerText = WELL_CONFIGS[wellType].name;
        
        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.name}</td>
                <td>$${Math.floor(score.cost).toLocaleString()}</td>
                <td>${score.gameTime}</td>
                <td>${score.ftPerDay ? score.ftPerDay.toLocaleString() + ' ft/day' : 'N/A'}</td>
                <td>${score.costPerFt ? '$' + score.costPerFt.toLocaleString() + '/ft' : 'N/A'}</td>
                <td>${score.date}</td>
            `;
            tbody.appendChild(row);
        });
        
        if (scores.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7" style="text-align: center; color: #666;">No scores yet - be the first!</td>';
            tbody.appendChild(row);
        }
        
        document.getElementById('game-container').style.display = 'none';
        const menuScreen = document.getElementById('highscore-menu-screen');
        if (menuScreen) menuScreen.style.display = 'none';
        document.getElementById('highscore-screen').style.display = 'flex';
    }

    static getHighScores(wellType) {
        const key = `highscores_${wellType}`;
        const scores = localStorage.getItem(key);
        return scores ? JSON.parse(scores) : [];
    }

    static addHighScore(wellType, name, cost, gameTime, totalDepth) {
        const scores = this.getHighScores(wellType);
        
        const timeParts = gameTime.match(/(\d+)d (\d+)h/);
        const days = parseInt(timeParts[1]);
        const hours = parseInt(timeParts[2]);
        const totalDays = days + (hours / 24);
        const ftPerDay = Math.floor(totalDepth / totalDays);
        const costPerFt = Math.floor(cost / totalDepth);
        
        const newScore = {
            name: name.substring(0, 10).toUpperCase(),
            cost: cost,
            gameTime: gameTime,
            ftPerDay: ftPerDay,
            costPerFt: costPerFt,
            date: new Date().toLocaleDateString()
        };
        
        scores.push(newScore);
        scores.sort((a, b) => a.cost - b.cost);
        scores.splice(10);
        
        const key = `highscores_${wellType}`;
        localStorage.setItem(key, JSON.stringify(scores));
    }

    static loadHighScores() {
        const defaultScores = {
            powder: [
                { name: "WILDCATTER", cost: 2500000, gameTime: "8d 12h", ftPerDay: 3235, costPerFt: 91, date: "1/1/2024" },
                { name: "ROUGHNECK", cost: 2800000, gameTime: "9d 6h", ftPerDay: 2957, costPerFt: 102, date: "1/1/2024" },
                { name: "DRILLER", cost: 3200000, gameTime: "10d 18h", ftPerDay: 2558, costPerFt: 116, date: "1/1/2024" }
            ],
            williston: [
                { name: "BAKKEN PRO", cost: 1900000, gameTime: "7d 4h", ftPerDay: 2986, costPerFt: 88, date: "1/1/2024" },
                { name: "OILMAN", cost: 2100000, gameTime: "8d 0h", ftPerDay: 2688, costPerFt: 98, date: "1/1/2024" },
                { name: "DRILLER", cost: 2400000, gameTime: "9d 12h", ftPerDay: 2263, costPerFt: 112, date: "1/1/2024" }
            ],
            eagleford: [
                { name: "TEXAN", cost: 1600000, gameTime: "6d 8h", ftPerDay: 3079, costPerFt: 82, date: "1/1/2024" },
                { name: "SHALE KING", cost: 1850000, gameTime: "7d 2h", ftPerDay: 2732, costPerFt: 95, date: "1/1/2024" },
                { name: "DRILLER", cost: 2100000, gameTime: "8d 6h", ftPerDay: 2349, costPerFt: 108, date: "1/1/2024" }
            ],
            stack: [
                { name: "SOONER", cost: 1750000, gameTime: "6d 18h", ftPerDay: 3015, costPerFt: 85, date: "1/1/2024" },
                { name: "MERAMEC ACE", cost: 2000000, gameTime: "7d 12h", ftPerDay: 2733, costPerFt: 98, date: "1/1/2024" },
                { name: "DRILLER", cost: 2300000, gameTime: "8d 20h", ftPerDay: 2318, costPerFt: 112, date: "1/1/2024" }
            ],
            delaware: [
                { name: "PERMIAN", cost: 1950000, gameTime: "7d 6h", ftPerDay: 2945, costPerFt: 91, date: "1/1/2024" },
                { name: "WOLFCAMP", cost: 2200000, gameTime: "8d 4h", ftPerDay: 2590, costPerFt: 102, date: "1/1/2024" },
                { name: "DRILLER", cost: 2500000, gameTime: "9d 18h", ftPerDay: 2204, costPerFt: 116, date: "1/1/2024" }
            ],
            armageddon: [
                { name: "BRUCE", cost: 99999999, gameTime: "99d 23h", ftPerDay: 8, costPerFt: 124999, date: "1/1/2024" }
            ]
        };
        
        Object.keys(WELL_CONFIGS).forEach(wellType => {
            const key = `highscores_${wellType}`;
            let scores = localStorage.getItem(key);
            
            if (!scores) {
                // No scores exist - install defaults
                const defaults = defaultScores[wellType] || [];
                localStorage.setItem(key, JSON.stringify(defaults));
            } else {
                // Migrate old scores
                scores = JSON.parse(scores);
                let needsUpdate = false;
                
                scores = scores.map(score => {
                    if (!score.ftPerDay || !score.costPerFt) {
                        needsUpdate = true;
                        
                        if (score.gameTime && score.cost) {
                            const timeParts = score.gameTime.match(/(\d+)d (\d+)h/);
                            if (timeParts) {
                                const days = parseInt(timeParts[1]);
                                const hours = parseInt(timeParts[2]);
                                const totalDays = days + (hours / 24);
                                const totalDepth = WELL_CONFIGS[wellType].targetDepth;
                                
                                score.ftPerDay = Math.floor(totalDepth / totalDays);
                                score.costPerFt = Math.floor(score.cost / totalDepth);
                            }
                        }
                    }
                    return score;
                });
                
                if (needsUpdate) {
                    localStorage.setItem(key, JSON.stringify(scores));
                }
            }
        });
    }

}
