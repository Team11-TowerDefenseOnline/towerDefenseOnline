import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import dbPool from '../database.js';

// 왜 리스트에 넣었다가 [0]로 빼는 것일까..
export const findUserByDeviceID = async (deviceId) => {
    const [rows] = await dbPool.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId])
    return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
    await dbPool.query(SQL_QUERIES.CREATE_USER, [deviceId]);
    return { deviceId };
};

export const updateUserLogin = async (deviceId) => {
    await dbPool.query(SQL_QUERIES.UPDATE_USER_LOGIN, [deviceId]);
};

export const updateUserLocation = async (x, y, deviceId) => {
    await dbPool.query(SQL_QUERIES.UPDATE_USER_LOCATION, [x, y, deviceId])
};