import { getProtoMessages } from '../../init/loadProto.js';
import { getGameSession } from '../../session/game.session.js';
import { config } from '../../config/config.js';
import { gameSessions, towers, userSessions } from '../../session/sessions.js';
import { serializer } from '../../utils/notification/game.notification.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { testConnection } from '../../utils/testConnection/testConnection.js';
import { getUserBySocket } from '../../session/user.session.js';
import Tower from '../../classes/models/tower.class.js';
import { addTower } from '../../session/tower.session.js';

// message C2STowerPurchaseRequest {
//   float x = 1;
//   float y = 2;
// }

// message S2CTowerPurchaseResponse {
//   int32 towerId = 1;
// }

// message S2CAddEnemyTowerNotification {
//   int32 towerId = 1;
//   float x = 2;
//   float y = 3;
// }

export const towerPurchaseHandler = async ({ socket, payloadData }) => {
  const protoMessages = getProtoMessages();
  const request = protoMessages.common.C2STowerPurchaseRequest;
  const { x, y } = request.decode(payloadData);
  console.log(
    `towerPurchaseHandler running! payload:${JSON.stringify(payloadData)} x:${x}, y:${y}`,
  );

  const gameSession = getGameSession(socket.id);
  if (!gameSession) {
    throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
  }
  const user = gameSession.getUser(socket.uuid);
  const opponentUser = gameSession.users.find((user) => user.socket !== socket);
  console.log(`opponent: ${opponentUser.id} user: ${user.id} ${opponentUser.socket == socket}`);

  // 타워 리스트 안에 겹치는 위치에 포탑이 있는지 검증
  if (towers.some((tower) => tower.socket == socket && tower.x == x && tower.y == y)) {
    console.error('타워 구매 실패: 이미 타워가 있는 위치');
    return;
  }
  // 타워 ID를 랜덤하게 지급
  const randomTowerId = Math.floor(Math.random() * 4) + 1;

  // 타워를 리스트 추가
  const myTower = new Tower(socket, randomTowerId, x, y);
  const opponentTower = new Tower(opponentUser.socket, randomTowerId, x, y + 1);
  addTower(myTower);
  addTower(opponentTower);

  // 해당 유저의 돈 소모 (소지금에 대한 정보를 못 받는데 검증 의미가 있나?)
  user.gold -= 3000;

  // 돈 부족하면 에러 발생 시켜야됨.

  // 구매 완료 응답
  const response = protoMessages.common.GamePacket;
  const packet = response.encode({ towerPurchaseResponse: { towerId: randomTowerId } }).finish();

  // 상대방에게 타워 구매를 알림
  const opponentPacket = response
    .encode({
      addEnemyTowerNotification: { towerId: randomTowerId, x: opponentTower.x, y: opponentTower.y },
    })
    .finish();
  console.log(packet);

  Promise.all([
    socket.write(serializer(packet, config.packetType.towerPurchaseResponse, 1)),
    opponentUser.socket.write(
      serializer(opponentPacket, config.packetType.addEnemyTowerNotification, 1),
    ),
  ]);
};

export const towerAttackHandler = async ({ socket, payloadData }) => {
  const { towerId, monsterId } = payloadData;

  // 게임 세션 및 상대 정보 획득
  const gameSession = getGameSession(socket.id);
  if (!gameSession) {
    throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
  }
  const opponentUser = gameSession.users.find((user) => user.socket !== socket);

  // 타워가 존재하는지 검증
  // 몬스터가 존재하는지 검증

  // 상대에게 공격을 알림
  const packet = response.encode({ enemyTowerAttackNotification: { towerId, monsterId } }).finish();
  opponentUser.socket.write(serializer(packet, config.packetType.enemyTowerAttackNotification, 1));
};
