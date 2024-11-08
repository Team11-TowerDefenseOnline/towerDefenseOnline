import {
  createMonsterSpawnPacket,
  createEnemyMonsterSpawnPacket,
  createStateSyncPacket,
  serializer,
} from '../../utils/notification/game.notification.js';
import { getGameSession } from '../../session/game.session.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { config } from '../../config/config.js';

const monsterDeathHendler = async ({ socket, payloadData }) => {
  try {
    const protoMessages = getProtoMessages();
    const request = protoMessages.common.C2SMonsterDeathNotification;
    const { monsterId } = request.decode(payloadData);
    console.log('사망 몬스터 아이디 : ', request.decode(payloadData));

    const gameSession = getGameSession(socket.id);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    const deathMonster = removeMonster(monsterId);
    console.log(monsterId, '가 사망함.');

    const response = protoMessages.common.GamePacket;
    const packet = response
      .encode({ S2CEnemyMonsterDeathNotification: { monsterId: monsterId } })
      .finish();

    socket.write(serializer(packet, config.packetType.enemyMonsterDeathNotification, 1));
  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathHendler;
