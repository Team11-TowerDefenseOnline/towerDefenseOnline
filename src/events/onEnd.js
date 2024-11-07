import { getGameSession, removeGameSession } from '../session/game.session.js';
import { removeUser } from '../session/user.session.js';

// 클라이언트 종료시 작동하는 이벤트
export const onEnd = (socket) => async () => {
  await removeUser(socket); // 매칭 돌려 유저 세션에 등록된 경우 유저 세션에서 제거

  // 클라이언트가 참가 중이던 게임 세션을 제거해야함.
  // 상대가 탈주해서 세션이 제거된 경우 상대에게 상대가 탈주함을 알리고 메인화면으로 보내줘야함.

  // 게임 세션에 참가한 경우
  if (socket.id) {
    removeGameSession(socket.id);
  } else {
  } // 게임 세션에 참가 안한채로 종료한 경우

  console.log('클라이언트 연결이 종료되었습니다.');
};
