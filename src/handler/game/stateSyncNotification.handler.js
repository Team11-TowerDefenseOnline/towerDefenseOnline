import { addGameSession, getGameSession } from '../../session/game.session.js';
import { createStateSyncPacket, serializer } from '../../utils/notification/game.notification.js';

const stateSyncNotificationHandler = async ({ socket, payloadData }) => {
  try {
    const gameSession = getGameSession(socket.gameId);

    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }
    const user = gameSession.getUser(socket.uuid);

    //console.log('gameSession => ', gameSession);
    socket.write(createStateSyncPacket(gameSession, user.id));
  } catch (e) {
    console.error(e);
  }
};

export default stateSyncNotificationHandler;
