import { config } from '../config/config.js';
import { getHandlerById } from '../handler/index.js';

// 클라이언트의 패킷이 도착했을 때 파싱함.
// 핸들러를 통해 패킷 타입에 맞는 함수를 동작시킴.
export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  while (socket.buffer.length >= config.packet.totalLength) {
    let offset = config.packet.packetTypeLength;
    const packetType = socket.buffer.readUintBE(0, offset);

    const versionLength = socket.buffer.readUintBE(offset, config.packet.versionLength);
    offset += config.packet.versionLength;

    const version = socket.buffer.subarray(offset, offset + versionLength).toString();
    offset += versionLength;

    // 버전 검증

    const sequence = socket.buffer.readUintBE(offset, config.packet.sequenceLength);
    offset += config.packet.sequenceLength;

    const payloadLength = socket.buffer.readUintBE(offset, config.packet.payloadLength);
    offset += config.packet.payloadLength;

    let requiredLength = offset + payloadLength;
    if (socket.buffer.length >= requiredLength) {
      const payloadData = socket.buffer.subarray(offset, requiredLength);
      socket.buffer = socket.buffer.subarray(requiredLength);

      try {
        const handler = getHandlerById(packetType);
        handler({ socket, payloadData });
      } catch (e) {
        console.error(e);
      }
    } else {
      break;
    }
  }
};
