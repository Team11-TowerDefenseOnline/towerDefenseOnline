import {
  createMonsterSpawnPacket,
  createEnemyMonsterSpawnPacket,
  createGameOverPacket,
} from '../../utils/notification/game.notification.js';
import { addMonster } from '../../session/monster.session.js';
import { getGameSession } from '../../session/game.session.js';

const monsterSpawnHandler = async ({ socket, payloadData }) => {
  try {
    const gameSession = getGameSession(socket.id);

    if (!gameSession) {
      throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
    }

    const opponentUser = gameSession.users.find((user) => user.socket !== socket);
    // 해당 게임의 내가 아닌 다른 유저의 소켓을 찾아서 opponentUser(상대방) 소켓에 넣는다.

    if (!opponentUser) {
      console.log(`(상대가 탈주함) 살아남은 ${socket.uuid}의 승리`);
      socket.write(createGameOverPacket(true));
      return;
    }
    const randomMonsterNUmber = Math.floor(Math.random() * 5) + 1;

    const monster = await addMonster(socket, randomMonsterNUmber);

    if (!monster) {
      throw new Error('몬스터 추가가 되지 않습니다.');
    }

    const monsterSpawnPacket = {
      monsterId: monster.getMonsterId(),
      monsterNumber: randomMonsterNUmber,
    };

    Promise.all([
      socket.write(createMonsterSpawnPacket(monsterSpawnPacket)),
      opponentUser.socket.write(createEnemyMonsterSpawnPacket(monsterSpawnPacket)),
    ]);
  } catch (error) {
    console.error(error);
  }
};

export default monsterSpawnHandler;
