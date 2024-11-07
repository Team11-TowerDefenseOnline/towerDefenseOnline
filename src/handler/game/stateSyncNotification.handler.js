import { getProtoMessages } from '../../init/loadProto.js';
import { addGameSession, getGameSession } from '../../session/game.session.js';
import { gameSessions, userSessions } from '../../session/sessions.js';
import { serializer } from '../../utils/notification/game.notification.js';


// message S2CStateSyncNotification {
//   int32 userGold = 1;
//   int32 baseHp = 2;
//   int32 monsterLevel = 3;
//   int32 score = 4;
//   repeated TowerData towers = 5;
//   repeated MonsterData monsters = 6;
// }


const stateSyncNotificationHandler = async({socket, payloadData}) =>{ // 여기 이걸 받는게 아닐지도? 다른 핸들러 후에 호출되어야하는걸지도?

  const protoMessages = getProtoMessages();
 
   try{
 
     const {userGold, baseHp, monsterLevel, score, towers=[], monsters=[]} = payloadData; //페이로드 데이터 풀기
 
     const gameSession = gameSessions.getGameSession(socket.id); // 소켓 아이디로 세션 찾기
 
     if (!gameSession) {
         throw new Error('해당 유저의 게임 세션을 찾지 못했습니다.');
     }
 
     const opponentUser = gameSession.users.find((user) => user.socket !== socket);
 
     if (!opponentUser) {
         throw new Error('상대 유저를 찾지 못했습니다.');
     }
     // 메인 동기화.
     user.userGold = userGold;
     user.baseHp = baseHp;
     user.monsterLevel = monsterLevel;
     user.score = score;
     gameSession.updateTowers(user, towers); 
     gameSession.updateMonsters(user, monsters);
 
     const response = protoMessages.common.S2CStateSyncNotification; 
     const packet = response.encode({ 
 
     S2CStateSyncNotification: {
     userGold : userGold,
     baseHp : baseHp,
     monsterLevel : monsterLevel,
     score : score,
     towers : towers,
     monsters : monsters
     }
     })
     .finish(); //인코드로 패킷뭉치기
 
     socket.write(serializer(packet, 7, 1)); // 클라이언트한테 패킷 던지기.
     //opponentUser.socket.write(serializer(packet,7,1)); // 상대 유저한테도 패킷 던지기.
 
     } catch(e){
         console.err('');
     }
 }

 export default stateSyncNotificationHandler






// // message S2CMatchStartNotification {
// //     InitialGameState initialGameState = 1;
// //     GameState playerData = 2;
// //     GameState opponentData = 3;
// // }
// let count = 0;

// const monsterAttackNotification = async ({ socket, payloadData }) => {
//   const protoMessages = getProtoMessages();
//   const user = userSessions;

//   /*
//   message MonsterData {
//   int32 monsterId = 1;
//   int32 monsterNumber = 2;
//   int32 level = 3;
// }
//    */
//   // 유저 세션 전체 다들고와서 홀수면 gameSession 만들고 아닐 때는 추가만

//   try {
//     const monsterAttackData = {
//       monsterId: 1,
//       monsterNumber: 1,
//       level: 1,
//     };

//     const response = protoMessages.common.GamePacket;
//     const packet = response
//       .encode({
//         monsterAttackNotification: monsterAttackData,
//       })
//       .finish();

//     user.socket.write(serializer(packet, 16, 1));
//   } catch (error) {
//     console.error(`${socket} : ${error}`);
//     // handleError(socket, error);
//   }
// };

