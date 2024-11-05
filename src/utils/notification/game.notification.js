import { config } from "../../config/config.js";
import { getProtoMessages } from "../../init/loadProto.js";

export const serializer = (message, type, sequenceData) => {
  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.packetTypeLength);
  packetType.writeUIntBE(type, 0, config.packet.packetTypeLength);

  const versionLength = Buffer.alloc(config.packet.versionLength);
  versionLength.writeUintBE(config.client.version.length, 0, config.packet.versionLength);

  const version = Buffer.alloc(config.client.version.length);
  version.write(config.client.version, 0, config.client.version.length);

  const sequence = Buffer.alloc(config.packet.sequenceLength);
  sequence.writeUintBE(sequenceData+1, 0, config.packet.sequenceLength);

  const payloadLength = Buffer.alloc(config.packet.payloadLength);
  payloadLength.writeUintBE(message.length, 0, config.packet.payloadLength);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetType, versionLength, version, sequence, payloadLength, message]);
};

export const createLocationPacket = (users) => {
  const protoMessage = getProtoMessages();
  const location = protoMessage.gameNotification.LocationUpdate;

  const payload = { users };
  const message = location.create(payload);
  const locationPacket = location.encode(message).finish();
  return serializer(locationPacket, config.packetType.location);
};

export const createPingPacket = (timestamp) => {
  const protoMessage = getProtoMessages();
  const ping = protoMessage.common.Ping;

  const payload = { timestamp };
  const message = ping.create(payload);
  const pingPacket = ping.encode(message).finish();
  return serializer(pingPacket, config.packetType.ping);
};
