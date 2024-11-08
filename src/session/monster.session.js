import { monsterSessions } from './sessions.js';
import Monster from '../classes/models/monster.class.js';

let monsterIdCount = 1;

export const addMonster = (socket, number) => {
  const monster = new Monster(socket, monsterIdCount++, number);
  monsterSessions.push(monster);
  return monster;
};

// 몬스터 추가
// socket, id, number의 값을 갖는 class 객체 배열을 monsterSessions 에 추가

// 몬스터 아이디로 삭제하도록 변경함. (원래는 소켓)
export const removeMonster = (monsterId) => {
  const index = monsterSessions.findIndex((monster) => monster.id === monsterId);
  // monster.socket 의 값과 socket이 일치하는 monsterSessions의 인덱스 값을 index에 반환
  if (index !== -1) {
    // index 값이 반환됨 = 일치하는 값이 있을 경우
    return monsterSessions.splice(index, 1)[0];
    // 일치하는 index 값을 제거한 monsterSessions를 반환
  }
};

// 해당 클라이언트에 소환된 몬스터
// 사용자가 공격해야하는 몬스터들을 찾을때는 socket만 있으면 된다.
export const getAllMonsterBySocket = (socket) => {
  return monsterSessions.filter((monster) => monster.socket === socket);
};

// 몬스터 하나만 찾을 때는 monster Id 한개만
export const getMonsterByMonsterId = (monsterId) => {
  return monsterSessions.find((monster) => monster.id === monsterId);
};
