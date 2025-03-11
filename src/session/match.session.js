import Match from '../classes/models/match.class.js';
import { matchSessions } from './sessions.js';

// constructor(id) {
//     this.id = id;
//     this.users = [];
//   }

// 매칭세션에 유저 1명이 오면 게임시작 x
// 유저 2명이 차면 바로 게임시작 O
// 대기 자체는 1명이 있을 때만이네

export const addUserInMatchSession = (user) => {
  matchSessions.push(user);
};

export const removeMatchSession = () => {};

export const getUserInMatchSessionByUserId = () => {};
