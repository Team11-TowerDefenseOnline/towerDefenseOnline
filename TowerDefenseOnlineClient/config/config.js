import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import { TOTAL_LENGTH, PACKET_TYPE_LENGTH, PACKET_TYPE } from '../constants/header.js';
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
    totalLength: TOTAL_LENGTH,
    typeLength: PACKET_TYPE_LENGTH,
  },
  packetType: {
    ping: PACKET_TYPE.PING,
    nomal: PACKET_TYPE.NORMAL,
    location: PACKET_TYPE.LOCATION,
  },
  database: {
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
  },
};