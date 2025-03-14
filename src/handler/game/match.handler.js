import { getProtoMessages } from '../../init/loadProto.js';
import { addGameSession } from '../../session/game.session.js';
import { matchSessions } from '../../session/sessions.js';
import { serializer } from '../../utils/notification/game.notification.js';
import { getUserBySocket } from '../../session/user.session.js';
import { addUserInMatchSession } from '../../session/match.session.js';
import { initAddTower } from '../../session/tower.session.js';
import stateSyncNotificationHandler from './stateSyncNotification.handler.js';

let gameSessionIdCount = 1;

// 버튼을 누를때 matchHandler 작동을함
// 우리는 매칭이 완전히 둘다 되기 전에 한명씩 누르니까 gameSession의 id가 변하면 안돼
const matchHandler = async ({ socket, payloadData }) => {
  const protoMessages = getProtoMessages();
  const user = getUserBySocket(socket);

  // 유저 세션 전체 다들고와서 홀수면 gameSession 만들고 아닐 때는 추가만
  addUserInMatchSession(user);
  const userLength = matchSessions.length;

  if (userLength % 2) {
    // 유저가 홀수 일때
    return;
  } else {
    // 유저가 짝수일때
    const users = matchSessions.slice(-2);
    users[0].socket.gameId = gameSessionIdCount;
    users[1].socket.gameId = gameSessionIdCount;

    // 유저를 해당 게임 세션에 넣어줌
    let originGameSessionId = gameSessionIdCount;
    const session = await addGameSession(gameSessionIdCount++);

    session.addUser(users[0]);
    session.addUser(users[1]);

    session.addNewGameState(users[0].id);
    session.addNewGameState(users[1].id);

    // 임시코드
    try {
      const initialGameStateData = {
        baseHp: 200,
        towerCost: 200,
        initialGold: 10000,
        monsterSpawnInterval: 1000,
      };

      const baseData = {
        hp: 200,
        maxHp: 200,
      };

      const positionData = {
        x: 0,
        y: 0,
      };

      const PlayerData = {
        gold: 10000, // 현재 골드
        base: baseData, // 기지의 현재 HP, 최대 HP
        highScore: users[0].highScore, // 플레이어의 최고 점수
        towers: [
          // { towerId: 1, x: 900, y: 300 },
          // { towerId: 2, x: 700, y: 300 },
          // { towerId: 3, x: 500, y: 300 },
          await initAddTower(900, 300),
          await initAddTower(700, 300),
          await initAddTower(500, 300),
        ],
        monsters: [],
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

      const OpponentData = {
        gold: 10000, // 현재 골드
        base: baseData, // 기지의 현재 HP, 최대 HP
        highScore: users[1].highScore, // 플레이어의 최고 점수
        towers: [
          // { towerId: 4, x: 900, y: 300 },
          // { towerId: 5, x: 700, y: 300 },
          // { towerId: 6, x: 500, y: 300 },
          await initAddTower(600, 250),
          await initAddTower(300, 250),
          await initAddTower(500, 250),
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

      const packet2 = response
        .encode({
          matchStartNotification: {
            initialGameState: initialGameStateData,
            playerData: OpponentData,
            opponentData: PlayerData,
          },
        })
        .finish();

      console.log('matchHandler running');

      Promise.all([
        users[0].socket.write(serializer(packet, 6, 1)),
        users[1].socket.write(serializer(packet2, 6, 1)),
      ]).then(() => {
        users[0]
          .getIntervalManager()
          .addGame(
            originGameSessionId,
            () => stateSyncNotificationHandler({ socket: users[0].socket, payloadData: undefined }),
            100,
          );
        users[1]
          .getIntervalManager()
          .addGame(
            originGameSessionId,
            () => stateSyncNotificationHandler({ socket: users[1].socket, payloadData: undefined }),
            100,
          );
      });
    } catch (error) {
      console.error(`${socket} : ${error}`);
      // handleError(socket, error);
    }
  }
};

export default matchHandler;
