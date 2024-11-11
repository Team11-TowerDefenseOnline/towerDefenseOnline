import {
  createGameOverPacket,
  createAttackMonsterPacket,
} from '../../utils/notification/game.notification.js';
import { getGameSession } from '../../session/game.session.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { updateUserScore } from '../../db/user/user.db.js';

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

    const opponentUser = gameSession.users.find((user) => user.socket !== socket);

    if (myBaseHp < 0) {
      opponentUser.socket.write(createGameOverPacket(true));
      socket.write(createGameOverPacket(false));

      const winnerScore = gameSession.getGameState(opponentUser.id).score;
      if (opponentUser.getHighScore() < winnerScore) {
        updateUserScore(winnerScore, opponentUser.id);
      }
    } else {
      socket.write(createAttackMonsterPacket(false, myBaseHp));
      opponentUser.socket.write(createAttackMonsterPacket(true, myBaseHp));
    }
  } catch (error) {
    console.error(error);
  }
};

export default monsterAttackHandler;
