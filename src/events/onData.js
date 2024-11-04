import { config } from "../config/config.js";
import { PACKET_TYPE } from "../constants/header.js";
import { packetParser } from "../utils/parser/packetParser.js";
import { getHandlerById } from "../handler/index.js";
import { getProtoMessages } from "../init/loadProto.js";
import { getUserBySocket } from "../session/user.session.js";

// 클라이언트의 패킷이 도착했을 때 파싱함.
// 핸들러를 통해 패킷 타입에 맞는 함수를 동작시킴.
export const onData = (socket) => async (data) => {
  console.log(socket.buffer.readUInt32BE(0))
  socket.buffer = Buffer.concat([socket.buffer, data]);
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);

      try {
        switch (packetType) {
          case PACKET_TYPE.PING: {
            const protoMessages = getProtoMessages();
            const Ping = protoMessages.common.Ping;
            const pingMessage = Ping.decode(packet);
            const user = getUserBySocket(socket);
            if (!user) {
              console.error("PING Error : 유저를 찾을 수 없습니다.");
            }
            user.handlePong(pingMessage);
            break;
          }
          case PACKET_TYPE.NORMAL: {
            const { handlerId, userId, payload } = packetParser(packet);
            const handler = getHandlerById(handlerId);

            handler({ socket, userId, payload });
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
    }
  }
};
