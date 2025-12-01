const GAME_VERSION = {
    MAJOR: 1,
    MINOR: 2,
    PATCH: 2,  // Changed from 1 to 2
    toString() {
        return `v${this.MAJOR}.${this.MINOR}.${this.PATCH}`;
    }
};
