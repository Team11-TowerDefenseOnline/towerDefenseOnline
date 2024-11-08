import {
  createMonsterSpawnPacket,
  createEnemyMonsterSpawnPacket,
  createStateSyncPacket,
} from '../../utils/notification/game.notification.js';
import { addMonster } from '../../session/monster.session.js';
import { getGameSession } from '../../session/game.session.js';
import initServer from '../../init/index.js';

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
let count = 1;

const monsterSpawnHandler = async ({ socket, payloadData }) => {
  // monsterSession을 만들고 거기다가 class Monster를 넣고 뺴고 하는 부분을 userSession처럼
  try {
    // 몬스터 넣어주고

    // 우리가 가지고 있는거 우리의 socket을 가지고 있다 그러면? 내 적의 socket을 찾아보자

    const gameSession = getGameSession(socket.id);
    //

    // console.log('gameSession : ', gameSession);
    // console.log('socket.id : ', socket.id);
    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    const opponentUser = gameSession.users.find((user) => user.socket !== socket);

    if (!opponentUser) {
      throw new Error('상대 유저를 찾지 못했습니다.');
    }
    const randomMonsterId = Math.floor(Math.random() * 5) + 1;
    const monster = await addMonster(socket, count, randomMonsterId);

    if (!monster) {
      throw new Error('몬스터 추가가 되지 않습니다.');
    }

    const monsterSpawnPacket = {
      monsterId: count++,
      monsterNumber: randomMonsterId,
    };
    //console.log('monsterSpawnPacket : ', monsterSpawnPacket);

    const user = gameSession.getUser(socket.uuid);

    // 나한테 보내기
    Promise.all([
      socket.write(createMonsterSpawnPacket(monsterSpawnPacket)),
      opponentUser.socket.write(createEnemyMonsterSpawnPacket(monsterSpawnPacket)),
      socket.write(createStateSyncPacket(gameSession, user.id)),
    ]);
  } catch (error) {
    console.error(error);
  }
};
//24.11.07 화이팅!
export default monsterSpawnHandler;

/**
 * message S2CStateSyncNotification {
    int32 userGold = 1;
    int32 baseHp = 2;
    int32 monsterLevel = 3;
    int32 score = 4;
    repeated TowerData towers = 5;
    repeated MonsterData monsters = 6;
}
 */

// 적에게 보내기
/**
 * 상태동기화를 보내줘야함
 *  -> [상태 동기화]=>packet패킷 [보내는 것]=>socket을 넣어야함.
 * packet_type = 7 이라는 정보를 넘겨줘야함 -> 어떻게?
 * 1. 패킷이 무엇인가에 대한 이해
 * 0101 같은 데이터 뭉치.
 * 0101[어떤내용] 1[핸들러 위치가리키는] 010101[실질적인 데이터] > 인코딩 디코딩
 * 패킷타입, 버전길이,버전,시퀀스,페이로드길이,페이로드 -> 몇 바이트로 이뤄졌는지
 * 패킷타입 -> 이 패킷이 어떤 핸들러로 갈것인가 를 정해주는 -> 2
 * 버전 길이 -> 아래있는 버전의 string의 길이 -> 1 => 5
 * 버전 -> 1.0.0 > 서버와 클라의 일치해야하는 버전 -> ? = 가변적이라
 * 시퀀스 -> 오는순서를 체크해주는 -> 4
 * 페이로드길이 -> 아래있는 페이로드의 string 길이 -> 4 = 20~
 * 페이로드 -> 실질적인 들어오는 데이터 내용 -> 모름 = 가변적이라
 *
 * 2. 실제 패킷의 모습
 * <buffer 02 42 f2 39 ... > -> 바이트 스트림을 길게 받아놓은 것.
 * 바이트 -> byte = 8bit
 * 스트림 -> 흘러감 바이트가 8bit 씩 socket을 통해 넘어감.
 * 흐름을 어디서 끊어야하는가...를 모름.
 * 그래서 클라이언트와 약속을 함. 그것이 패킷 명세서
 * 왜냐하면 흐름을 끊어서 읽지 않으면 아무의미 없는 데이터이기 때문에
 * 01 02 03 데이터가 왔는데 뭔 뜻일까? 클라이언트 할애비가와도 모름.
 * 01 -> 32bit
 * 01 02 03 -> 0000000 00000001 0000000 0000010 0000000 0000011
 * 0000000 / 0000/0001 0000000 0000010 / 0000000 0000011 ....>>>
 * 페킷 타입 / 버전 길이 / 버전 / ... -> onData에 이 내용이 있음.
 *
 * 3. 실습!
 * 3-1. 패킷을 생성하자
 * 3-2. 패킷을 보내자
 */
