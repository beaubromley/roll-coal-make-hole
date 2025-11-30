const GAME_VERSION = {
    MAJOR: 1,
    MINOR: 1,  // Changed from 0 to 1
    PATCH: 0,  // Reset to 0
    toString() {
        return `v${this.MAJOR}.${this.MINOR}.${this.PATCH}`;
    }
};
