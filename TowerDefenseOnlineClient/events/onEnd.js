import { getGameSession } from '../session/game.session.js';
import { removeUser } from '../session/user.session.js';

// 클라이언트 종료시 작동하는 이벤트
// userSession, gameSession에서 사용자 정보를 제거함.
// try catch 넣으면 강제 종료시 에러가 발생함.
export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');
  
  await removeUser(socket);

  const gameSession = getGameSession();
  gameSession.removeUser(socket);
};