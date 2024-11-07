import { HANDLER_IDS } from '../constants/handlerIds.js';
import locationUpdateHandler from './game/locationUpdate.handler.js';
import matchHandler from './game/match.handler.js';
import initialHandler from './user/initial.handler.js';
import loginHandler from './user/login.handler.js';
import registerHandler from './user/register.handler.js';
import monsterSpawnHandler from './monster/monsterSpawn.handler.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.registerResponse',
  },
  [HANDLER_IDS.REGISTER]: {
    handler: registerHandler,
    protoType: 'common.S2CLoginResponse',
  },
  [HANDLER_IDS.LOGIN]: {
    handler: loginHandler,
    protoType: 'common.C2SLoginRequest',
  },
  [HANDLER_IDS.MATCH]: {
    handler: matchHandler,
    protoType: 'common.S2CMatchStartNotification',
  },
  [HANDLER_IDS.MONSTER_SPAWN]: {
    handler: monsterSpawnHandler,
    protoType: 'common.S2CSpawnMonsterResponse',
  },
};

export const getProtoTypeByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    console.log('handlerId : ' + handlerId);
    throw Error();
  }

  return handlers[handlerId].protoType;
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    console.log(handlerId + ' not found');
    throw new Error();
  }
  return handlers[handlerId].handler;
};
