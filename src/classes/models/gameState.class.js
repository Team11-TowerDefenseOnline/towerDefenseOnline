class GameState {
  constructor(userId, userGold, baseHp, towers, monsters) {
    this.userId = userId;
    this.userGold = userGold;
    this.baseHp = baseHp;
    this.score = 0;
    this.monsterLevel = 5;
    this.towers = towers;
    this.monsters = monsters;
  }

  setGold(userGold) {
    return (this.userGold = userGold);
  }

  setBaseHp(baseHp) {
    return (this.baseHp = baseHp);
  }

  setScore(score) {
    return (this.score = score);
  }

  setMonsterLevel(monsterLevel) {
    return (this.monsterLevel = monsterLevel);
  }

  addTower(tower) {
    this.towers.push(tower);
  }

  addMonster(monster) {
    this.monsters.push(monster);
  }

  monsterLevelUp() {
    this.monsterLevel++;
  }

  getStateData() {
    return {
      userGold: this.userGold,
      baseHp: this.baseHp,
      monsterLevel: this.monsterLevel,
      score: this.score,
      towers: this.towers,
      monsters: this.monsters,
    };
  }
}

export default GameState;
/**
 *   message S2CStateSyncNotification {
    int32 userGold = 1;
    int32 baseHp = 2;
    int32 monsterLevel = 3;
    int32 score = 4;
    repeated TowerData towers = 5;
    repeated MonsterData monsters = 6;
}
 */
