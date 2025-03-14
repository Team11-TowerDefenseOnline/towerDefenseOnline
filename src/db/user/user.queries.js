export const SQL_QUERIES = {
  FIND_USER_BY_USER_ID: 'SELECT * FROM user WHERE user_id = ?',
  FIND_USER_BY_ID: 'SELECT * FROM user WHERE id = ?',
  CREATE_USER: 'INSERT INTO user (user_id, password, email) VALUES (?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
  UPDATE_USER_SCORE: 'UPDATE user SET score = ? WHERE user_id = ? ',
};
