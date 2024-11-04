import { removeUser } from '../session/user.session.js';

// 서버에 통신에 오류 발생시 작동하는 이벤트
export const onError = (socket) => (err) => {
  console.error('소켓 오류:', err);

  removeUser(socket); // 오류를 일으킨 유저를 세션에서 제거함.
};
