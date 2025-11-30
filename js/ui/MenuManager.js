class MenuManager {
    static init() {
        this.currentWellType = null;
        this.setupStartScreen();
        this.setupWellSelectScreen();
        this.setupHighScoreScreen();
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
                    this.startGame('standard');
                } else if (e.code === 'Digit2') {
                    this.startGame('bakken');
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
        Object.keys(WELL_CONFIGS).forEach(wellType => {
            const key = `highscores_${wellType}`;
            let scores = localStorage.getItem(key);
            
            if (!scores) {
                localStorage.setItem(key, JSON.stringify([]));
            } else {
                // Migrate old scores to add missing fields
                scores = JSON.parse(scores);
                let needsUpdate = false;
                
                scores = scores.map(score => {
                    if (!score.ftPerDay || !score.costPerFt) {
                        needsUpdate = true;
                        
                        // Try to calculate from existing data
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
