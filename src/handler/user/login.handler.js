import { findUserByUserID, updateUserLogin } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getProtoMessages } from '../../init/loadProto.js';
import { getGameSession } from '../../session/game.session.js';
import { config } from '../../config/config.js';
import { gameSessions, userSessions } from '../../session/sessions.js';
import { createLoginPacket, serializer } from '../../utils/notification/game.notification.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import User from '../../classes/models/user.class.js';
import { addUser } from '../../session/user.session.js';
import { redisClient } from '../../init/redisConnect.js';

// message C2SLoginRequest {
//     string id = 1;
//     string password = 2;
// }

// message S2CLoginResponse {
//     bool success = 1;
//     string message = 2;
//     string token = 3;
//     GlobalFailCode failCode = 4;
// }

const loginHandler = async ({ socket, payloadData }) => {
  const protoMessages = getProtoMessages();
  const request = protoMessages.common.C2SLoginRequest;
  const failCode = protoMessages.common.GlobalFailCode;
  let sendPayload;

  const requestMessage = request.decode(payloadData.subarray(2));
  console.log(requestMessage);

  const { id, password } = requestMessage;
  try {
    // DB에 user가 있는지 확인
    const isExistUserInDB = await findUserByUserID(id);
    console.log('isExistUser: ', isExistUserInDB);
    if (!isExistUserInDB) {
      // DB에 해당 유저가 없음
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, 'DB에 해당 유저가 없습니다.');
    }
    if (!(await bcrypt.compare(password, isExistUserInDB.password))) {
      // 비밀번호 틀림
      throw new CustomError(ErrorCodes.PASSWORD_NOT_MATCH, '비밀번호가 틀립니다.');
    }

    // 로그인 시점 갱신
    await updateUserLogin(isExistUserInDB.userId); // jwt 생성

    const token = jwt.sign(
      {
        id: isExistUserInDB.userId,
      },
      config.jwt.jwtSecret,
    );
    socket.token = token;
    socket.uuid = isExistUserInDB.userId;

    sendPayload = {
      success: true,
      message: '로그인 성공',
      token: token,
      failCode: failCode.values.NONE,
    };

    const user = new User(socket, isExistUserInDB.userId, isExistUserInDB.highScore);
    // redis에 해당 user정보를 저장해둬야함
    await addUser(user);

    // const response = protoMessages.common.GamePacket;
    // const packet = response.encode({ loginResponse: sendPayload }).finish();
  } catch (error) {
    sendPayload = {
      success: false,
      message: '로그인 실패',
      token: null,
      failCode: failCode.values.INVALID_REQUEST,
    };

    console.error(`${socket} : ${error}`);
    // handleError(socket, error);
  }

  socket.write(createLoginPacket(sendPayload));
};

export default loginHandler;
