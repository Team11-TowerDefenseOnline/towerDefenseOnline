class User {
  constructor(socket, id, highScore) {
    this.socket = socket;
    this.id = id; // 고유함
    this.latency = null; // 보류
    this.lastUpdateTime = Date.now();
    this.highScore = highScore || 0;
    this.gold = 0;
  }

  setHighScore(highScore) {
    this.highScore = highScore;
  }

  getHighScore() {
    return this.highScore;
  }
}

export default User;
