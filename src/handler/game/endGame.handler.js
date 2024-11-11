import {
  createMonsterSpawnPacket,
  createEnemyMonsterSpawnPacket,
  createStateSyncPacket,
  serializer,
} from '../../utils/notification/game.notification.js';
import { getGameSession, removeGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';

//   message C2SGameEndRequest {}

const endGameHandler = async ({ socket, payloadData }) => {
  try {
    const gameSession = getGameSession(socket.id);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    const user = gameSession.getUser(socket.uuid);
    const intervalManager = user.getIntervalManager();
    intervalManager.clearAll();
    gameSession.removeUser(socket); // 게임세션에서 유저 제거

    // 게임 세션에 남은 사람이 없다면 게임 세션을 제거
    if (!gameSession.users) {
      removeGameSession(socket.id);
    }
    console.log(socket.id, '세션이 제거됐습니다.');
  } catch (error) {
    console.error(error);
  }
};

export default endGameHandler;
