import { towers } from './sessions.js';
import Tower from '../classes/models/tower.class.js';

let towerCount = 1;

export const addTower = (x, y) => {
  const tower = new Tower(towerCount++, x, y);
  towers.push(tower);
  return tower;
};

export const initAddTower = (x, y) => {
  const tower = new Tower(towerCount++, x, y);
  towers.push(tower);

  console.log('현재 타워 개수', towerCount - 1);

  return tower.getTowerData();
};

export const removeTower = (socket) => {
  const index = towers.findIndex((tower) => tower.socket === socket);
  // Tower.socket 의 값과 socket이 일치하는 towers의 인덱스 값을 index에 반환
  if (index !== -1) {
    // index 값이 반환됨 = 일치하는 값이 있을 경우
    return towers.splice(index, 1)[0];
    // 일치하는 index 값을 제거한 towers를 반환
  }
};

// 사용자가 공격하는 타워들을 찾을때는 socket만 있으면 된다.
export const getAllTowerBySocket = (socket) => {
  return towers.filter((tower) => tower.socket === socket);
};

// 타워 하나만 찾을 때는 Tower Id 한개만
export const getTowerByTowerId = (TowerId) => {
  return towers.find((tower) => tower.id === TowerId);
};
