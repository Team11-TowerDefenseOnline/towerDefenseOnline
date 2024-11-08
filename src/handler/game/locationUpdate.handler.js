import { getProtoMessages } from "../../init/loadProto.js";
import { getGameSession } from "../../session/game.session.js";
import { userSessions } from "../../session/sessions.js";

// 자신의 위치를 갱신
// 클라이언트에게 다른 유저의 위치를 반환함.
const locationUpdateHandler = ({socket, userId, payload}) => {
    try {
        const { x, y } = payload; //받은 데이터 구조 분해 할당
        const gameSession = getGameSession(); //세션
    
        if (!gameSession) { // 없을때 에러 
          console.error('게임 세션을 찾지 못 했습니다.')
        }
    
        const user = gameSession.getUser(userId); //유저
        if (!user) { // 없을때 에러
          console.error('유저를 찾을 수 없습니다.');
        }
        user.updatePosition(x, y); // 둘다 체크후, 위치 동기화

        user.updateUser

        const location = gameSession.getAllLocation(userId) // 로케이션에 유저를 제외한 모두의 위치.
    
        socket.write(location); //모두의 위치를 뿌려준다
      } catch (error) {
        console.error("LocationUpdate : " + error);
      }
    };

    
export default locationUpdateHandler