import { getProtoMessages } from '../../init/loadProto.js';
import { getGameSession } from '../../session/game.session.js';
import { config } from '../../config/config.js';
import { createGameOverPacket, serializer } from '../../utils/notification/game.notification.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { addTower } from '../../session/tower.session.js';
import { getMonsterByMonsterId } from '../../session/monster.session.js';
import { RedisManager } from '../../init/redisConnect.js';

export const towerPurchaseHandler = async ({ socket, payloadData }) => {
  try {
    const protoMessages = getProtoMessages();
    const request = protoMessages.common.C2STowerPurchaseRequest;

    const { x, y } = request.decode(payloadData.subarray(2));

    const gameSession = getGameSession(socket.gameId);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }
    const user = gameSession.getUser(socket.uuid);
    const opponentUser = gameSession.users.find((user) => user.socket !== socket);
    console.log(`opponent: ${opponentUser.id} user: ${user.id} ${opponentUser.socket === socket}`);

    // 타워 리스트 안에 겹치는 위치에 포탑이 있는지 검증
    // if (towers.some((tower) => tower.socket === socket && tower.x === x && tower.y === y)) {
    //   console.error('타워 구매 실패: 이미 타워가 있는 위치');
    //   return;
    // }

    // 타워를 리스트 추가
    const myTower = addTower(x, y);

    // 해당 유저의 돈 소모 (소지금에 대한 정보를 못 받는데 검증 의미가 있나?)
    gameSession.getGameState(user.id).userGold -= 300;

    // 돈 부족하면 에러 발생 시켜야됨.

    // 구매 완료 응답
    const response = protoMessages.common.GamePacket;
    const packet = response.encode({ towerPurchaseResponse: { towerId: myTower.id } }).finish();

    // 상대방에게 타워 구매를 알림
    const opponentPacket = response
      .encode({
        addEnemyTowerNotification: {
          towerId: myTower.id,
          x: x,
          y: y,
        },
      })
      .finish();

    Promise.all([
      socket.write(serializer(packet, config.packetType.towerPurchaseResponse, 1)),
      opponentUser.socket.write(
        serializer(opponentPacket, config.packetType.addEnemyTowerNotification, 1),
      ),
    ]);
  } catch (error) {
    console.error(error);
  }
};

export const towerAttackHandler = async ({ socket, payloadData }) => {
  try {
    const protoMessages = getProtoMessages();
    const request = protoMessages.common.C2STowerAttackRequest;
    const { towerId, monsterId } = request.decode(payloadData.subarray(2));

    // 게임 세션 및 상대 정보 획득
    const gameSession = getGameSession(socket.gameId);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }
    const opponentUser = gameSession.users.find((user) => user.socket !== socket);
    if (!opponentUser) {
      console.log(`(상대가 탈주함) 살아남은 ${socket.uuid}의 승리`);
      socket.write(createGameOverPacket(true));
      return;
    }
    // 제대로된 검증
    // 1. 해당 유저가 담겨있는 몬스터만 공격가능하게
    const monsterData = await RedisManager.getMonster(monsterId);
    if (!monsterData) {
      return;
    }

    if (socket.id === monsterData.socketId) {
      const response = protoMessages.common.GamePacket;
      const packet = response
        .encode({ enemyTowerAttackNotification: { towerId: towerId, monsterId: monsterData.id } })
        .finish();

      opponentUser.socket.write(
        serializer(packet, config.packetType.enemyTowerAttackNotification, 1),
      );
    }
  } catch (error) {
    console.error(error);
  }
};
