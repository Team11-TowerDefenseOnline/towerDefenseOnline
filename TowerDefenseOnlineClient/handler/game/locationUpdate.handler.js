import { getGameSession } from "../../session/game.session.js";

// 자신의 위치를 갱신
// 클라이언트에게 다른 유저의 위치를 반환함.
const locationUpdateHandler = ({socket, userId, payload}) => {
    try {
        const { x, y } = payload;
        const gameSession = getGameSession();
    
        if (!gameSession) {
          console.error('게임 세션을 찾지 못 했습니다.')
        }
    
        const user = gameSession.getUser(userId);
        if (!user) {
          console.error('유저를 찾을 수 없습니다.');
        }
        user.updatePosition(x, y);

        const location = gameSession.getAllLocation(userId)
    
        socket.write(location);
      } catch (error) {
        console.error("LocationUpdate : " + error);
      }
    };
    
export default locationUpdateHandler