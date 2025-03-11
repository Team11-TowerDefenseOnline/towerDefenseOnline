import GameState from './gameState.class.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.gameStates = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index != -1) {
      return this.users.splice(index, 1)[0];
    }
  }

  //userId, gold, base, score, towers, monsters
  addNewGameState(userId) {
    const initGold = 10000;
    const initBaseHp = 200;
    const towers = [
      { towerId: 4, x: 900, y: 300 },
      { towerId: 5, x: 900, y: 100 },
      { towerId: 6, x: 500, y: 300 },
    ];
    const monsters = [];
    this.gameStates.push(new GameState(userId, initGold, initBaseHp, towers, monsters));
  }

  getGameStateData(userId) {
    const gameState = this.gameStates.find((gameState) => gameState.userId == userId);
    return gameState.getStateData();
  }

  getGameState(userId) {
    const gameState = this.gameStates.find((gameState) => gameState.userId == userId);
    return gameState;
  }
}

export default Game;
