import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

// 게임 세션 id가 1이라고 했을 때 여기에 유저 2명이 참가하면
// 게임 세션 id가 2인놈을 만들고 유저를 참가 시켜야함
// 이걸 어떻게 기준으로 삼을까인데
// 가장 쉬운 방법은 userSession에다가 user를 계속 넣고 userSession의 user가 홀 수 일 때
// 게임 세션을 하나 더 만들어 준다 가 됩니다.

// gameSession에 addUser 메서드가 있는데 이게 호출 될 때 userSession의 user 수를 확인 한 다음
// 게임 세션을 더 추가할지 말지가 되야함

export const addGameSession = (id) => {
  const game = new Game(id);
  gameSessions.push(game);
  return game;
};

export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);
};

export const getAllGameSessions = () => {
  return gameSessions;
};
