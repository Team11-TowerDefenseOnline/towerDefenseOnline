import { addGameSession } from '../session/game.session.js';
import { testConnection } from '../utils/testConnection/testConnection.js';
import { loadProtos } from './loadProto.js';
import { v4 as uuidv4 } from 'uuid';
import { connectRedis, redisClient } from './redisConnect.js';
import { loadGameAssets } from './loadAssets.js';

// protobuf의 패킷 정의를 로드
// 게임 세션을 생성
// DB 연결 상태를 테스트
const initServer = async () => {
  try {
    await loadProtos();
    await loadGameAssets();
    console.log(redisClient.status);
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);
    console.log(gameSession);
    await testConnection();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

export default initServer;
