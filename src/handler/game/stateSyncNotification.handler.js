import { getProtoMessages } from '../../init/loadProto.js';
import { addGameSession, getGameSession } from '../../session/game.session.js';
import { gameSessions, userSessions } from '../../session/sessions.js';
import { createStateSyncPacket, serializer } from '../../utils/notification/game.notification.js';

// message S2CStateSyncNotification {
//   int32 userGold = 1;
//   int32 baseHp = 2;
//   int32 monsterLevel = 3;
//   int32 score = 4;
//   repeated TowerData towers = 5;
//   repeated MonsterData monsters = 6;
// }

const stateSyncNotificationHandler = async ({ socket, payloadData }) => {
  // 여기 이걸 받는게 아닐지도? 다른 핸들러 후에 호출되어야하는걸지도?

  const protoMessages = getProtoMessages();

  try {
    const gameSession = getGameSession(socket.id);

    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
      // gameSession을 삭제할 것
    }
    const user = gameSession.getUser(socket.uuid);

    //console.log('gameSession => ', gameSession);
    socket.write(createStateSyncPacket(gameSession, user.id));
  } catch (e) {
    console.error(e);
  }
};

export default stateSyncNotificationHandler;

/*
gold: 10000, // 현재 골드
        baseHp: 500, // 기지의 현재 HP
        maxHp: 500, // 기지의 최대 HP
        highScore: 0, // 플레이어의 최고 점수
        towers: [
          // { towerId: 4, x: 900, y: 300 },
          // { towerId: 5, x: 700, y: 300 },
          // { towerId: 6, x: 500, y: 300 },
          initAddTower(900, 300),
          initAddTower(700, 300),
          initAddTower(500, 300),
        ],
        monsters: [
          // 플레이어의 몬스터 목록
        ],
        monsterLevel: 1, // 몬스터의 현재 레벨
        score: 0, // 플레이어의 현재 점수
        monsterPath: [
          // 몬스터 이동 경로
          { x: 0, y: 250 },
          { x: 50, y: 250 },
          { x: 110, y: 250 },
          { x: 170, y: 250 },
          { x: 230, y: 250 },
          { x: 290, y: 250 },
          { x: 350, y: 250 },
          { x: 410, y: 250 },
          { x: 470, y: 250 },
          { x: 530, y: 250 },
          { x: 590, y: 250 },
          { x: 650, y: 250 },
          { x: 710, y: 250 },
          { x: 770, y: 250 },
          { x: 830, y: 250 },
          { x: 890, y: 250 },
          { x: 950, y: 250 },
          { x: 1010, y: 250 },
          { x: 1070, y: 250 },
          { x: 1130, y: 250 },
          { x: 1190, y: 250 },
        ],
        basePosition: { x: 1370, y: 250 }, // 기지 위치
      };
      */
