import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import { PACKET_TYPE_LENGTH, PACKET_TYPE, PAYLOAD_LENGTH, VERSION_LENGTH, SEQUENCE } from '../constants/header.js';
import {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} from '../constants/env.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    payloadLength: PAYLOAD_LENGTH,
    packetTypeLength: PACKET_TYPE_LENGTH,
    versionLength : VERSION_LENGTH,
    sequenceLength : SEQUENCE,
    totalLength : PACKET_TYPE_LENGTH + PAYLOAD_LENGTH + VERSION_LENGTH + SEQUENCE
  },
  packetType: {
    /*
    ping: PACKET_TYPE.PING,
    nomal: PACKET_TYPE.NORMAL,
    location: PACKET_TYPE.LOCATION,
    */
    registerRequest: PACKET_TYPE.REGISTER_REQUEST,
    registerResponse: PACKET_TYPE.REGISTER_RESPONSE,
    loginRequest: PACKET_TYPE.LOGIN_REQUEST,
    loginResponse: PACKET_TYPE.LOGIN_RESPONSE,

    matchRequest: PACKET_TYPE.MATCH_REQUEST,
    matchStartNotification: PACKET_TYPE.MATCH_START_NOTIFICATION,

    stateSyncNotification: PACKET_TYPE.STATE_SYNC_NOTIFICATION,

    towerPurchaseRequest: PACKET_TYPE.TOWER_PURCHASE_REQUEST,
    towerPurchaseResponse: PACKET_TYPE.TOWER_PURCHASE_RESPONSE,
    addEnemyTowerNotification: PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION,

    spawnMonsterRequest: PACKET_TYPE.SPAWN_MONSTER_REQUEST,
    spawnMonsterResponse: PACKET_TYPE.SPAWN_MONSTER_RESPONSE,
    spawnEnemyMonsterNotification: PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION,

    towerAttackRequest: PACKET_TYPE.TOWER_ATTACK_REQUEST,
    enemyTowerAttackNotification: PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION,
    monsterAttackBaseRequest: PACKET_TYPE.MONSTER_ATTACK_BASE_REQUEST,

    updateBaseHpNotification: PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION,
    gameOverNotification: PACKET_TYPE.GAME_OVER_NOTIFICATION,

    gameEndRequest: PACKET_TYPE.GAME_END_REQUEST,

    monsterDeathNotification: PACKET_TYPE.MONSTER_DEATH_NOTIFICATION,
    enemyMonsterDeathNotification: PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION,
  },
  database: {
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
  },
};