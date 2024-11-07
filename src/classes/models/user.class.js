import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(socket, id, highScore) {
    this.socket = socket;
    this.id = id; // 고유함
    this.latency = null; // 보류
    this.lastUpdateTime = Date.now();
    this.highScore = highScore || 0;
    this.gold = 0;
  }

  ping() {
    const now = Date.now();
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`pong ${this.id} : ${now} with latency ${this.latency}ms`);
  }

  setHighScore(highScore) {
    this.highScore = highScore;
  }

  getHighScore() {
    return this.highScore;
  }
}

export default User;
