import {
  createMonsterSpawnPacket,
  createEnemyMonsterSpawnPacket,
  createStateSyncPacket,
  serializer,
} from '../../utils/notification/game.notification.js';
import { getGameSession, removeGameSession } from '../../session/game.session.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { config } from '../../config/config.js';

//   message C2SGameEndRequest {}

const endGameRequest = async ({ socket, payloadData }) => {
  try {
    const gameSession = getGameSession(socket.id);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    const removed = removeGameSession(socket.id);
    console.log(removed.id, '세션이 제거됐습니다.');
  } catch (error) {
    console.error(error);
  }
};

export default monsterAttackHandler;
