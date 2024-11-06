import { getProtoMessages } from '../../init/loadProto.js';
import { addGameSession, getGameSession } from '../../session/game.session.js';
import { config } from '../../config/config.js';
import { gameSessions, userSessions } from '../../session/sessions.js';
import { serializer } from '../../utils/notification/game.notification.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { testConnection } from '../../utils/testConnection/testConnection.js';

// message S2CMatchStartNotification {
//     InitialGameState initialGameState = 1;
//     GameState playerData = 2;
//     GameState opponentData = 3;
// }
let count = 0;

const monsterAttackNotification = async ({ socket, payloadData }) => {
  const protoMessages = getProtoMessages();
  const user = userSessions;

  /*
  message MonsterData {
  int32 monsterId = 1;
  int32 monsterNumber = 2;
  int32 level = 3;
}
   */
  // 유저 세션 전체 다들고와서 홀수면 gameSession 만들고 아닐 때는 추가만

  try {
    const monsterAttackData = {
      monsterId: 1,
      monsterNumber: 1,
      level: 1,
    };

    const response = protoMessages.common.GamePacket;
    const packet = response
      .encode({
        monsterAttackNotification: monsterAttackData,
      })
      .finish();

    user.socket.write(serializer(packet, 16, 1));
  } catch (error) {
    console.error(`${socket} : ${error}`);
    // handleError(socket, error);
  }
};

export default matchHandler;