const GAME_VERSION = {
    MAJOR: 1,
    MINOR: 2,
    PATCH: 1,  // Changed from 0 to 1
    toString() {
        return `v${this.MAJOR}.${this.MINOR}.${this.PATCH}`;
    }
};
