import { getProtoMessages } from "../../init/loadProto.js";
import { config } from "../../config/config.js";
import { getProtoTypeByHandlerId } from "../../handler/index.js";

export const packetParser = (data) => {
    const protoMessages = getProtoMessages();
    const commonPacket = protoMessages.common.Packet;
    let packet

    try {
        packet = commonPacket.decode(data);
    } catch (e) {
        console.error("Socket Decode " + e);
    }

    const handlerId = packet.handlerId;
    const userId = packet.userId;
    const clientVersion = packet.clientVersion;
    const sequence = packet.sequence;

    if(clientVersion != config.client.version){
        throw Error();
    }

    const protoType = getProtoTypeByHandlerId(handlerId);
    if(!protoType) {
        throw Error();
    }

    const [namespace, typeName] = protoType.split('.');
    const payloadType = protoMessages[namespace][typeName];
    
    let payload

    try{
        payload = payloadType.decode(packet.payload);
    } catch (e) {
        console.error("decode Error : " + e);
    }
    
    const expectedFields = Object.keys(payloadType.fields);
    const actualFields = Object.keys(payload);
    const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
    if (missingFields.length > 0) {
        throw Error();
    }

    return { handlerId, userId, payload }
};