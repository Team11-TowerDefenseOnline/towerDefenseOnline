import { HANDLER_IDS } from '../constants/handlerIds.js';
import locationUpdateHandler from './game/locationUpdate.handler.js';
import matchHandler from './game/match.handler.js';
import initialHandler from './user/initial.handler.js';
import loginHandler from './user/login.handler.js';
import registerHandler from './user/register.handler.js';
import monsterSpawnHandler from './monster/monsterSpawn.handler.js';
import { towerAttackHandler, towerPurchaseHandler } from './game/tower.handler.js';
import stateSyncNotificationHandler from './game/stateSyncNotification.handler.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },
  [HANDLER_IDS.REGISTER]: {
    handler: registerHandler,
    protoType: 'common.C2SRegisterRequest',
  },
  [HANDLER_IDS.LOGIN]: {
    handler: loginHandler,
    protoType: 'common.C2SLoginRequest',
  },
  [HANDLER_IDS.MATCH]: {
    handler: matchHandler,
    protoType: 'common.matchRequest',
  },
  [HANDLER_IDS.SYNC]: {
    handler: stateSyncNotificationHandler,
    protoType: 'common.S2CStateSyncNotification',
  },
  [HANDLER_IDS.PURCHASE]: {
    handler: towerPurchaseHandler,
    protoType: 'common.C2STowerPurchaseRequest',
  },
  [HANDLER_IDS.MONSTER_SPAWN]: {
    handler: monsterSpawnHandler,
    protoType: 'common.S2CSpawnMonsterResponse',
  },
  [HANDLER_IDS.TOWER_ATTACK]: {
    handler: towerAttackHandler,
    protoType: 'common.C2STowerAttackRequest',
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
