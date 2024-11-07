import { createLocationPacket } from '../../utils/notification/game.notification.js';
import LatencyManager from '../managers/latency.manager.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.towers = [];
    this.latencyManager = new LatencyManager();
  }

  addUser(user) {
    this.users.push(user);

    this.latencyManager.addUser(user.id, user.ping.bind(user), 1000);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index != -1) {
      if (this.users.length === 1) {
        this.latencyManager.clearAll();
      }
      this.latencyManager.removeUser(this.users[index].id);
      return this.users.splice(index, 1)[0];
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
  }

  getAllLocation(userId) {
    const maxLatency = this.getMaxLatency();

    const location = this.users
      .filter((user) => user.id !== userId)
      .map((user) => {
        const { x, y } = user.calculatePosition(maxLatency);
        return { id: user.id, playerId: user.playerId, x, y };
      });

    return createLocationPacket(location);
  }

  addTower(tower) {
    this.towers.push(tower);
  }
}

export default Game;
