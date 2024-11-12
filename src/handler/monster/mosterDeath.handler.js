import {
  createMonsterSpawnPacket,
  createEnemyMonsterSpawnPacket,
  createStateSyncPacket,
  serializer,
} from '../../utils/notification/game.notification.js';
import { getGameSession } from '../../session/game.session.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { config } from '../../config/config.js';
import { getMonsterByMonsterId, removeMonster } from '../../session/monster.session.js';
import { RedisManager } from '../../init/redisConnect.js';
import { getUserBySocket } from '../../session/user.session.js';

const monsterDeathHendler = async ({ socket, payloadData }) => {
  try {
    const protoMessages = getProtoMessages();
    const request = protoMessages.common.C2SMonsterDeathNotification;
    const { monsterId } = request.decode(payloadData.subarray(3));

    const gameSession = getGameSession(socket.gameId);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    if (!RedisManager.getMonster(monsterId)) {
      console.error('몬스터가 이미 죽었습니다.');
      return;
    }
    const deathMonster = RedisManager.deleteMonster(monsterId);

    // 몬스터 잡을 시 돈 및 점수 획득
    const user = getUserBySocket(socket);
    gameSession.getGameState(user.id).userGold += 100;
    gameSession.getGameState(user.id).score += 1;

    const opponentUser = gameSession.users.find((user) => user.socket !== socket);

    const response = protoMessages.common.GamePacket;
    const packet = response
      .encode({ enemyMonsterDeathNotification: { monsterId: monsterId } })
      .finish();

    opponentUser.socket.write(
      serializer(packet, config.packetType.enemyMonsterDeathNotification, 1),
    );
  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathHendler;
