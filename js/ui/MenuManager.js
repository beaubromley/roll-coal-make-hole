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
        
        startButton.addEventListener('click', () => {
            this.showWellSelect();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' && this.isScreenVisible('start-screen')) {
                this.showWellSelect();
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
        backButton.addEventListener('click', () => {
            this.returnToStart();
        });

        const submitButton = document.getElementById('submit-score-button');
        submitButton.addEventListener('click', () => {
            this.submitScore();
        });

        const nameInput = document.getElementById('player-name');
        nameInput.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                this.submitScore();
            }
        });

        const quitButton = document.getElementById('quit-to-menu-button');
        quitButton.addEventListener('click', () => {
            this.quitToMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && window.game && window.game.state && window.game.state.isPaused) {
                this.quitToMenu();
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
        document.getElementById('game-container').style.display = 'none';
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

    static showNameEntry(wellType, cost, gameTime) {
        this.pendingScore = { wellType, cost, gameTime };
        
        document.getElementById('score-details').innerText = 
            `Well: ${WELL_CONFIGS[wellType].name}\nFinal Cost: $${Math.floor(cost).toLocaleString()}\nTime: ${gameTime}`;
        
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
                this.pendingScore.gameTime
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
                <td>${score.date}</td>
            `;
            tbody.appendChild(row);
        });
        
        if (scores.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center; color: #666;">No scores yet - be the first!</td>';
            tbody.appendChild(row);
        }
        
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('highscore-screen').style.display = 'flex';
    }

    static getHighScores(wellType) {
        const key = `highscores_${wellType}`;
        const scores = localStorage.getItem(key);
        return scores ? JSON.parse(scores) : [];
    }

    static addHighScore(wellType, name, cost, gameTime) {
        const scores = this.getHighScores(wellType);
        
        const newScore = {
            name: name.substring(0, 10).toUpperCase(),
            cost: cost,
            gameTime: gameTime,
            date: new Date().toLocaleDateString()
        };
        
        scores.push(newScore);
        scores.sort((a, b) => a.cost - b.cost);
        scores.splice(10);
        
        const key = `highscores_${wellType}`;
        localStorage.setItem(key, JSON.stringify(scores));
    }

    static loadHighScores() {
        // Initialize empty high score tables if they don't exist
        Object.keys(WELL_CONFIGS).forEach(wellType => {
            const key = `highscores_${wellType}`;
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });
    }
}
