import Redis from 'ioredis';
import { config } from '../config/config.js';

export const redisClient = new Redis({
  port: config.redis.port, // Redis port
  host: config.redis.host, // Redis host
  family: config.redis.family, // 4(IPv4) or 6(IPv6)
  password: config.redis.password,
  db: 0,
});

redisClient.on('error', (err) => {
  console.error('Redis 클라이언트 오류:', err.errno);
  switch (err.errno) {
    case -4078:
      console.error('Redis DB와 연결할 수 없습니다. Redis 상태를 확인해주세요.');
      break;
    default:
      console.error('알 수 없는 오류코드:', JSON.stringify(err));
  }
  console.log('서버를 종료합니다.');
  process.exit(1);
});

// redisClient.on('connect', () => console.log('Redis에 연결되었습니다.'));
export const connectRedis = async () => {
  try {
    if (redisClient.status === 'ready') {
      console.log('Redis에 연결 준비 중.');
    }

    // 이미 연결되었거나 연결 중이라면 connect()를 호출하면 안돼
    if (!redisClient.status || redisClient.status === 'wait') {
      console.log('redisClient.status => ', redisClient.status);
      await redisClient.connect();
      console.log('Redis에 연결되었습니다.');
    } else {
      console.log('레디스 현재 상태 => ', redisClient.status);
    }
  } catch (error) {
    console.error('Redis에 연결할 수 없습니다:', error);
  }
};

await connectRedis();

export const RedisManager = {
  addMonster: async (monster) => {
    try {
      const monsterData = {
        socketId: monster.socketId,
        id: monster.id,
        number: monster.number,
      };

      await redisClient.set(`monster:${monster.id}`, JSON.stringify(monsterData));

      return monsterData;
    } catch (error) {
      console.error('Redis에 몬스터 정보 저장 중 오류 발생:', error);
    }
  },

  getMonster: async (monsterId) => {
    try {
      // Redis에서 저장된 유저 데이터를 가져옴
      const monsterDataString = await redisClient.get(`monster:${monsterId}`);
      // if (Object.keys(monsterDataString).length === 0) {
      //   console.log(`유저 정보가 Redis에 존재하지 않습니다: monster:${monsterId}`);
      //   return null;
      // }

      const monsterData = JSON.parse(monsterDataString);

      return monsterData;
    } catch (error) {
      console.error('Redis에서 유저 정보 불러오기 중 오류 발생:', error);
      return null;
    }
  },

  deleteMonster: async (monsterId) => {
    try {
      await redisClient.del(`monster:${monsterId}`);

      console.log(`몬스터 캐시가 삭제되었습니다: monster:${monsterId}`);
      return null;
    } catch (error) {
      console.error('Redis에서 유저 캐시 삭제 중 오류 발생: ', error);
      return null;
    }
  },

  deleteMonsterCacheMemory: async (socketId) => {
    try {
      // Redis에서 모든 몬스터 데이터를 조회
      const keys = await redisClient.keys('monster:*');

      for (const key of keys) {
        const monsterDataString = await redisClient.get(key);
        const monsterData = JSON.parse(monsterDataString);

        // socketId가 일치하는 몬스터를 삭제
        if (monsterData.socketId === socketId) {
          await redisClient.del(key);
          console.log(`몬스터 캐시가 삭제되었습니다: ${key}`);
        }
      }
      return null;
    } catch (error) {
      console.error('Redis에서 몬스터 캐시 삭제 중 오류 발생: ', error);
      return null;
    }
  },

  addUser: async (user) => {
    try {
      const userData = {
        socket: user.socket,
        userId: user.id,
        highScore: user.highScore,
        jwt: user.socket.token,
      };

      // Redis에 Hash 형식으로 저장
      await redisClient.hmset(`user:${user.userId}`, userData);

      await redisClient.set(`socket:${user.socket.id}`, user.id);
      console.log(`유저 정보가 Redis에 저장되었습니다: user:${user.userId}`);
    } catch (error) {
      console.error('Redis에 유저 정보 저장 중 오류 발생:', error);
    }
  },

  getUser: async (userId) => {
    try {
      // Redis에서 저장된 유저 데이터를 가져옴
      const userData = await redisClient.hgetall(`user:${userId}`);
      if (Object.keys(userData).length === 0) {
        console.log(`유저 정보가 Redis에 존재하지 않습니다: user:${userId}`);
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Redis에서 유저 정보 불러오기 중 오류 발생:', error);
      return null;
    }
  },
  getUserIdBySocket: async (socket) => {
    try {
      const userId = await redisClient.get(`socket:${socket.id}`);
      if (!userId) {
        console.log(`socket:${socket.id}에 대한 userId를 찾을 수 없습니다.`);
        return null;
      }
      return userId;
    } catch (error) {
      console.error(`socket:${socket.id}에 대한 userId를 찾을 수 없습니다.`);
      return null;
    }
  },
  getUserBySocket: async (socket) => {
    try {
      const userId = getUserIdBySocket(socket);

      // userId로 유저 데이터 불러오기
      // 이부분 아직테스트 못함 안되면 redisClient.hegetall써야함
      const userData = getUser(userId);
      if (Object.keys(userData).length === 0) {
        console.log(`유저 정보가 Redis에 존재하지 않습니다: user:${userId}`);
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Redis에서 유저 정보 불러오기 중 오류 발생:', error);
      return null;
    }
  },
  deleteUserCacheMemory: async (socket) => {
    try {
      const userId = getUserIdBySocket(socket);

      Promise.all([redisClient.del(`user:${userId}`), redisClient.del(`socket:${socket.id}`)]);

      console.log(`유저 캐시가 삭제되었습니다: user:${userId} 및 socket:${socket.id}`);
      return true;
    } catch (error) {
      console.error('Redis에서 유저 캐시 삭제 중 오류 발생: ', error);
      return false;
    }
  },

  updateCacheExpiration: async (key, expiration = 3600) => {
    try {
      await redisClient.expire(key, expiration);
      console.log(`캐시 만료 시간 업데이트 완료: ${key}`);
    } catch (error) {
      console.error('캐시 만료 시간 업데이트 중 오류 발생:', error);
    }
  },
};
