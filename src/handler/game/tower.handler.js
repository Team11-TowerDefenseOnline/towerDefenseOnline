import { getProtoMessages } from '../../init/loadProto.js';
import { addGameSession, getGameSession } from '../../session/game.session.js';
import { config } from '../../config/config.js';
import { gameSessions, towers, userSessions } from '../../session/sessions.js';
import { serializer } from '../../utils/notification/game.notification.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { testConnection } from '../../utils/testConnection/testConnection.js';
import { getUserBySocket } from '../../session/user.session.js';
import Tower from '../../classes/models/tower.class.js';

export const towerPurchaseHandler = async ({ socket, payloadData }) => {
  const protoMessages = getProtoMessages();
  const { x, y } = payloadData;

  // 현재 가지고 있는 타워 리스트 데이터를 가져옴.
  towers;

  // 타워 리스트 안에 겹치는 위치에 포탑이 있는지 검증
  if (towers.some((tower) => tower.x == x && tower.y == y)) {
    console.error('타워 구매 실패: 이미 타워가 있는 위치');
    return;
  }
  // 타워 ID를 랜덤하게 지급
  const randomTowerId = Math.floor(Math.random() * 4) + 1;

  // 타워를 리스트 추가
  towers.push(new Tower(randomTowerId, x, y));

  // 해당 유저의 돈 소모
  const user = getUserBySocket(socket);
  user.gold -= 3000;

  // 소켓을 통해서 반환
  const response = protoMessages.common.GamePacket;
  console.log(response.towerPurchaseResponse);
  const packet = response.encode({ towerPurchaseResponse: { towerId: randomTowerId } }).finish();
  socket.write(serializer(packet, 9, 1));
};
