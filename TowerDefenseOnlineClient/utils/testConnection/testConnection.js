import dbPool from "../../db/database.js"
import { config } from "../../config/config.js";

export const testConnection = async () => {
    try {
        const [rows] = await dbPool.query('SELECT 1 + 1 AS solution')
        console.log(`${config.database.database} 테스트 쿼리 결과:`, rows[0].solution);
    } catch (e) {
        console.error('test 쿼리 실행 실패 : ' + e)
    }
};