import { getProtoMessages } from '../../init/loadProto.js';
import { config } from '../../config/config.js';
import { getProtoTypeByHandlerId } from '../../handler/index.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();
  const commonPacket = protoMessages.common.Packet;
  let packet;

  try {
    packet = commonPacket.decode(data);
  } catch (e) {
    console.error('Socket Decode ' + e);
  }

  const packetType = packet.packetType;
  const version = packet.versionLength;
  const sequence = packet.sequence;
  const payloadData = packet.payload;

  if (version != config.client.version) {
    throw Error();
  }

  const protoType = getProtoTypeByHandlerId(packetType);
  if (!protoType) {
    throw Error();
  }
  //-----------------------------------------------------
  const [namespace, typeName] = protoType.split('.');
  const payloadType = protoMessages[namespace][typeName];

  let payload;

  try {
    payload = payloadType.decode(payloadData);
  } catch (e) {
    console.error('decode Error : ' + e);
  }

  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    throw Error();
  }

  return payloadData;
};
