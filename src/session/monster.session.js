import { monsterSessions } from './sessions.js';
import Monster from '../classes/models/monster.class.js';

export const addMonster = (socket, id, number) => {
  const monster = new Monster(socket, id, number);
  monsterSessions.push(monster);
};
// 몬스터 추가
// socket, id, number의 값을 갖는 class 객체 배열을 monsterSessions 에 추가

export const removeMonster = (socket) => {
  const index = monsterSessions.findIndex((monster) => monster.socket === socket);
  // monster.socket 의 값과 socket이 일치하는 monsterSessions의 인덱스 값을 index에 반환
  if (index !== -1) {
    // index 값이 반환됨 = 일치하는 값이 있을 경우
    return monsterSessions.splice(index, 1)[0];
    // 일치하는 index 값을 제거한 monsterSessions를 반환
  }
};
