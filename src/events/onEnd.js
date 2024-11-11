import { getGameSession, removeGameSession } from '../session/game.session.js';
import { userSessions } from '../session/sessions.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';

// 클라이언트 종료시 작동하는 이벤트
export const onEnd = (socket) => async () => {
  await removeUser(socket); // 매칭 돌려 유저 세션에 등록된 경우 유저 세션에서 제거

  // 클라이언트가 참가 중이던 게임 세션을 제거해야함.
  // 상대가 탈주해서 세션이 제거된 경우 상대에게 상대가 탈주함을 알리고 메인화면으로 보내줘야함.
  try {
    // 게임 한판 한뒤 종료하는 경우: socket.id가 이미 있음으로.
    const gameSession = getGameSession(socket.id);
    if (!gameSession) {
      console.log('클라이언트 연결이 종료되었습니다.');
      return;
    }

    // 게임 세션에 참가한 경우
    if (socket.id) {
      const user = gameSession.getUser(socket.uuid);
      const intervalManager = user.getIntervalManager();
      intervalManager.clearAll(); // 상태동기화를 해제
      gameSession.removeUser(socket); // 게임세션에서 유저 제거

      // 게임 세션에 남은 사람이 없다면 게임 세션을 제거
      if (!gameSession.users) {
        removeGameSession(socket.id);
      }
      removeUser(socket);
    } else {
    } // 게임 세션에 참가 안한채로 종료한 경우
  } catch (error) {
    throw new Error(`클라이언트 종료 중 알 수 없는 에러 ${error}`);
  }

  console.log('클라이언트 연결이 종료되었습니다.', userSessions);
};
