/**
 * 각 클라이언트와 서버와의 통신 레이턴시를 측정
 * 각 클라이언트들을 관리하는 메니저 코드
 */
class LatencyManager {
  constructor() {
    this.intervals = new Map();
  }

  addUser(userId, callback, interval) {
    if (this.intervals.has(userId)) {
      console.error("중복된 인터벌 감지");
    }
    this.intervals.set(userId, setInterval(callback, interval));
  }

  removeUser(userId) {
    if (!this.intervals.has(userId)) {
      return;
    }
    clearInterval(this.intervals.get(userId));
  }

  clearAll() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
  }
}

export default LatencyManager;
