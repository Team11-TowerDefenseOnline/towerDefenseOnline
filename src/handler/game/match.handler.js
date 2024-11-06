import { getProtoMessages } from '../../init/loadProto.js';
import { addGameSession, getGameSession } from '../../session/game.session.js';
import { config } from '../../config/config.js';
import { gameSessions, userSessions } from '../../session/sessions.js';
import { serializer } from '../../utils/notification/game.notification.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js'
import { testConnection } from '../../utils/testConnection/testConnection.js';

// message S2CMatchStartNotification {
//     InitialGameState initialGameState = 1;
//     GameState playerData = 2;
//     GameState opponentData = 3;
// }
let count = 0;

const matchHandler = async ({ socket, payloadData }) => {
    const protoMessages = getProtoMessages();

    // 유저 세션 전체 다들고와서 홀수면 gameSession 만들고 아닐 때는 추가만
    const userLength = userSessions.length;
    
    if (userLength % 2) {// 유저가 홀수 일때
        return ;
    }
    else{
      // 유저가 짝수일때
    
      const users = userSessions.slice(-2);
        // 유저를 해당 게임 세션에 넣어줌
        const session = addGameSession(count++);
        session.addUser(users[0]);
        session.addUser(users[1]);
    }
    
    // BaseData
    //   message BaseData {
    //     int32 hp = 1;
    //     int32 maxHp = 2;
    //   }

    const position  = protoMessages.common.Position;
    const base  = protoMessages.common.BaseData;
    const tower  = protoMessages.common.TowerData;
    const monster  = protoMessages.common.Monster;
    const initialGameState = protoMessages.common.InitialGameState ;

    try {

        const initialGameStateData = {
            baseHp: 1000,
            towerCost: 200,
            initialGold: 1000,
            monsterSpawnInterval: 1000
        }
        const message1 = initialGameState.create(initialGameStateData);

        const baseData = {
            hp: 1000,
            maxHp: 1000,
        }
        const message2 = base.create(baseData);
        
        const positionData = {
            x: 0,
            y: 0,
        }
        const message3 = position.create(positionData);

        const PlayerData = {
            gold: 1000,
            base: message2,
            highScore: 0,
            towers: [],
            monsters: [],
            monsterLevel: 1,
            score: 0,
            monsterPath: [],
            basePosition: message3
        }
        //users[0].getHighScore()
        const OpponentData = {
            gold: 1000,
            base: message2,
            highScore: 0,
            towers: [],
            monsters: [],
            monsterLevel: 1,
            score: 0,
            monsterPath: [],
            basePosition: message3
        }

        const syncData = {
          
        }

        const response = protoMessages.common.GamePacket;
        const packet = response.encode({ matchStartNotification: {initialGameState: message1, playerData: PlayerData, opponentData : OpponentData} }).finish();

        socket.write(serializer(packet, 6, 1));

    } catch (error) {
        console.error(`${socket} : ${error}`)
        // handleError(socket, error);
    }
};

export default matchHandler;
/*
message S2CMatchStartNotification {
    InitialGameState initialGameState = 1;
    GameState playerData = 2;
    GameState opponentData = 3;
} */