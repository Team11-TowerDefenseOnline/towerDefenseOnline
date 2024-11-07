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
let count = 1;

const matchHandler = async ({ socket, payloadData }) => {
  const protoMessages = getProtoMessages();

  // 유저 세션 전체 다들고와서 홀수면 gameSession 만들고 아닐 때는 추가만
  const userLength = userSessions.length;

  if (userLength % 2) {
    // 유저가 홀수 일때
    return;
  } else {
    // 유저가 짝수일때
    const users = userSessions.slice(-2);
    users[0].socket.id = count;
    users[1].socket.id = count;

    // 유저를 해당 게임 세션에 넣어줌
    const session = await addGameSession(count++);
    session.addUser(users[0]);
    session.addUser(users[1]);

    socket.id = count;

    try {
      const initialGameStateData = {
        baseHp: 1000,
        towerCost: 200,
        initialGold: 1000,
        monsterSpawnInterval: 1000,
      };

      const baseData = {
        hp: 1000,
        maxHp: 1000,
      };

      const positionData = {
        x: 0,
        y: 0,
      };

      const PlayerData = {
        gold: 1000,
        base: baseData,
        highScore: users[0].getHighScore(),
        towers: [],
        monsters: [],
        monsterLevel: 1,
        score: 0,
        monsterPath: [],
        basePosition: positionData,
      };

      const OpponentData = {
        gold: 1000,
        base: baseData,
        highScore: users[1].getHighScore(),
        towers: [],
        monsters: [],
        monsterLevel: 1,
        score: 0,
        monsterPath: [],
        basePosition: positionData,
      };

      const response = protoMessages.common.GamePacket;
      const packet = response
        .encode({
          matchStartNotification: {
            initialGameState: initialGameStateData,
            playerData: PlayerData,
            opponentData: OpponentData,
          },
        })
        .finish();

      users[0].socket.write(serializer(packet, 6, 1));
      users[1].socket.write(serializer(packet, 6, 1));
    } catch (error) {
      console.error(`${socket} : ${error}`);
      // handleError(socket, error);
    }
  }
};

export default matchHandler;
