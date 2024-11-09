import {
  createMonsterSpawnPacket,
  createEnemyMonsterSpawnPacket,
  createStateSyncPacket,
  serializer,
  createGameOverPacket,
  createAttackMonsterPacket,
} from '../../utils/notification/game.notification.js';
import { addMonster } from '../../session/monster.session.js';
import { getGameSession } from '../../session/game.session.js';
import initServer from '../../init/index.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { config } from '../../config/config.js';

// message C2SSpawnMonsterRequest {
// }
// message S2CSpawnMonsterResponse {
//     int32 monsterId = 1;
//     int32 monsterNumber = 2;
// }
// message S2CSpawnEnemyMonsterNotification {
//   int32 monsterId = 1;
//   int32 monsterNumber = 2;
// }
const monsterAttackHandler = async ({ socket, payloadData }) => {
  try {
    const protoMessages = getProtoMessages();
    const request = protoMessages.common.C2SMonsterAttackBaseRequest;
    const { damage } = request.decode(payloadData.subarray(3));

    const gameSession = getGameSession(socket.id);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    let myBaseHp = gameSession.getGameState(socket.uuid).baseHp;
    myBaseHp -= damage;
    gameSession.getGameState(socket.uuid).baseHp = myBaseHp;
    console.log(socket.uuid, '베이스 체력 : ', myBaseHp);

    const response = protoMessages.common.GamePacket;
    const opponentUser = gameSession.users.find((user) => user.socket !== socket);

    if (myBaseHp < 0) {
      console.log(`${socket.uuid}의 베이스 체력: ${myBaseHp}`);
      opponentUser.socket.write(createGameOverPacket(true));
      socket.write(createGameOverPacket(false));
    } else {
      socket.write(createAttackMonsterPacket(false, myBaseHp));
      opponentUser.socket.write(createAttackMonsterPacket(true, myBaseHp));
    }
  } catch (error) {
    console.error(error);
  }
};

export default monsterAttackHandler;
