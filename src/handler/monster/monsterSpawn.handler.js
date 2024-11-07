import { v4 as uuidv4 } from 'uuid';
import {
  createMonsterSpawnPacket,
  createEnemyMonsterSpawnPacket,
} from '../../utils/notification/game.notification.js';
import { addMonster } from '../../session/monster.session.js';
import { gameSessions } from '../../sessions.js';
import { getGameSession } from '../../session/game.session.js';

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

// 유저 둘이 같은 몬스터가 리스폰이 되는가?
// 매 스테이지에 스폰되는 몬스터가 랜덤인가?

// Id 와 Number를 보낸다
// Id 는 고유한 값이다, number는 monster.json에 있는 id 값이다.
// socket을 통해서 유저의 userid를 찾아와서 보내준다.

// 몬스터 스폰이 동시에 들어오면 타임스탬프를 찍는다

// socket은 들어오지만 payloadData는 들어오는게 없다.

// monsterSession 을 핸들러에 넣어야하는데 그 위치가 어디일까?

const monsterSpawnHandler = async ({ socket, payloadData }) => {
  // monsterSession을 만들고 거기다가 class Monster를 넣고 뺴고 하는 부분을 userSession처럼
  try {
    // 몬스터 넣어주고
    const monster = await addMonster(socket, monsterUUID, randomMonsterId);

    if (!monster) {
      throw new Error('몬스터 추가가 되지 않습니다.');
    }

    // 우리가 가지고 있는거 우리의 socket을 가지고 있다 그러면? 내 적의 socket을 찾아보자

    const gameSession = gameSessions.getGameSession(socket.id);
    // socket에 있는 id가 맞는 Game을 가져온다
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    const opponentUser = gameSession.users.find((user) => user.socket !== socket);
    // 해당 게임의 내가 아닌 다른 유저의 소켓을 찾아서 opponentUser(상대방) 소켓에 넣는다.

    if (!opponentUser) {
      throw new Error('상대 유저를 찾지 못했습니다.');
    }

    const monsterUUID = uuidv4();
    const randomMonsterId = Math.floor(Math.random() * 5) + 1;

    const monsterSpawnPacket = {
      monsterId: monsterUUID,
      monsterNumber: randomMonsterId,
    };

    // 나한테 보내기
    socket.write(createMonsterSpawnPacket(monsterSpawnPacket));
    // 적에게 보내기
    opponentUser.socket.write(createEnemyMonsterSpawnPacket(monsterSpawnPacket));
    // 상대방 소켓에 있는 몬스터 스폰 정보를 createEnemyMonsterSpawnPacket로 보낸다?

    console.log(`Monster spawned ID & Number: ${monsterSpawnPacket}`);
  } catch (error) {
    console.error(socket, error);
  }
};

export default monsterSpawnHandler;
