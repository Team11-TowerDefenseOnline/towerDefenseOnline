import { HANDLER_IDS } from "../constants/handlerIds.js"
import locationUpdateHandler from "./game/locationUpdate.handler.js"
import initialHandler from "./user/initial.handler.js"

const handlers = {
    [HANDLER_IDS.INITIAL] : {
        handler: initialHandler,
        protoType : 'initial.InitialPacket'
    },
    [HANDLER_IDS.UPDATE_LOCATION]: {
        handler: locationUpdateHandler,
        protoType: 'game.LocationUpdatePayload',
    },
}

export const getProtoTypeByHandlerId = (handlerId) => {
    if(!handlers[handlerId]){
        console.log("handlerId : " + handlerId)
        throw Error();
    }

    return handlers[handlerId].protoType;
}

export const getHandlerById = (handlerId) => {
    if (!handlers[handlerId]) {
        console.log(handlerId+" not found")
        throw new Error();
    }
    return handlers[handlerId].handler;
};