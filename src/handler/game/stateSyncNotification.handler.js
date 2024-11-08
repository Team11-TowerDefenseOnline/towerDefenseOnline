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
    }
    const user = gameSession.getUser(socket.uuid);

    socket.write(createStateSyncPacket(gameSession, user.id));
  } catch (e) {
    console.error(e);
  }
};

export default stateSyncNotificationHandler;
