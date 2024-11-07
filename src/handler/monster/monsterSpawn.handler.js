import { v4 as uuidv4 } from 'uuid';
import { createMonsterSpawnPacket } from '../../utils/notification/game.notification.js';
import { addMonster } from '../../session/monster.session.js';

// message C2SSpawnMonsterRequest {
// }
// message S2CSpawnMonsterResponse {
//     int32 monsterId = 1;
//     int32 monsterNumber = 2;
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
  const monsterUUID = uuidv4();
  let randomMonsterId = Math.floor(Math.random() * 5) + 1;
  // monsterSession을 만들고 거기다가 class Monster를 넣고 뺴고 하는 부분을 userSession처럼
  try {
    const monster = addMonster(socket, id, number);

    const monsterSpawnPacket = {
      monsterId: monsterUUID,
      monsterNumber: randomMonsterId,
    };

    socket.write(createMonsterSpawnPacket(monsterSpawnPacket));
  } catch (error) {
    console.error(socket, error);
  }
};

export default monsterSpawnHandler;
