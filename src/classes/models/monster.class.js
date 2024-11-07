import { getGameAssets } from '../../init/loadAssets.js';

class Monster {
  // id는 고유한 값 // number가 지금부터 "id": "MON00001",
  // number 뭐가 들어올 수 있을까? 1~5
  constructor(socket, id, number) {
    this.socket = socket; // 해당 유저 찾을때
    this.id = id; // 고유한값
    this.number = number;

    this.DisplayName = '';
    this.Description = '';
    this.maxHp = 0;
    this.HpPerLv = 0;
    this.spd = 0;
    this.DefPerLv = 0;
    this.Atk = 0;
    this.AtkPerLv = 0;
    this.makeMonsterData(number);
  }

  makeMonsterData(number) {
    const { monsters } = getGameAssets();
    const realMonster = monsters.data[number - 1];
    this.DisplayName = realMonster.DisplayName;
    this.Description = realMonster.Description;
    this.maxHp = realMonster.maxHp;
    this.HpPerLv = realMonster.HpPerLv;
    this.spd = realMonster.spd;
    this.DefPerLv = realMonster.DefPerLv;
    this.Atk = realMonster.Atk;
    this.AtkPerLv = realMonster.AtkPerLv;
  }
}

export default Monster;
