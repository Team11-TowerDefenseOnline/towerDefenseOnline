import { RedisManager } from '../../init/redisConnect.js';
import { getGameSession, removeGameSession } from '../../session/game.session.js';

//   message C2SGameEndRequest {}

const endGameHandler = async ({ socket, payloadData }) => {
  try {
    const gameSession = getGameSession(socket.gameId);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    const user = gameSession.getUser(socket.uuid);
    const intervalManager = user.getIntervalManager();
    intervalManager.clearAll();
    gameSession.removeUser(socket); // 게임세션에서 유저 제거
    await RedisManager.deleteMonsterCacheMemory(socket.id);

    // 게임 세션에 남은 사람이 없다면 게임 세션을 제거
    console.log(gameSession.users);
    if (!gameSession.users.length) {
      removeGameSession(socket.gameId);
      console.log(socket.gameId, '세션이 제거됐습니다.');
    }
  } catch (error) {
    console.error(error);
  }
};

export default endGameHandler;
