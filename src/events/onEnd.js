import { getGameSession, removeGameSession } from '../session/game.session.js';
import { removeUser } from '../session/user.session.js';

// 클라이언트 종료시 작동하는 이벤트
// userSession, gameSession에서 사용자 정보를 제거함.
// try catch 넣으면 강제 종료시 에러가 발생함.
export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  await removeUser(socket);

  // 클라이언트가 참가 중이던 게임 세션을 제거해야함.
  // 상대가 탈주해서 세션이 제거된 경우 상대에게 상대가 탈주함을 알리고 메인화면으로 보내줘야함.
  // removeGameSession(socket.id);
};
