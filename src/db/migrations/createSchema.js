import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbPool from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');
  try {
    const sql = fs.readFileSync(sqlDir + '/user_db.sql', 'utf8');
    const queries = sql
      .split(';')
      .map((query) => query.trim())
      .filter((query) => query.length > 0);

    for (const query of queries) {
      await dbPool.query(query);
    }

    console.log('데이터베이스 테이블 생성 성공');
  } catch (error) {
    console.error('데이터베이스 테이블 생성 에러: ', error);
  }
};

createSchemas()
  .then(() => {
    console.log('마이그레이션 완료');
    process.exit(0); // 마이그레이션 완료 후 프로세스 종료
  })
  .catch((error) => {
    console.error('마이그레이션 실행 오류: ', error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });