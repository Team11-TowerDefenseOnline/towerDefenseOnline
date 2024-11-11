# 박용현 md 파일

## 개발 일지

## 2024-11-05

로그인 부분을 구현하려고 하는데 JWT를 섞어서 써야한다 생각하니까 어떻게 보내야할까? 라는 고민이 생김 일단 그냥 시도를 먼저 해보고 생각하기로 했다.

npm install bcrypt 비밀번호 안전하게 해싱하기 위해 사용
npm install jsonwebtoken 토큰생성

게임세션에 user를 넣는 시점은 매칭이 성공 했을 때 게임 세션자체가 1개 만들어지고 그때 매칭이 성공한 user를 넣어준다.
매칭이 성공한 user는 어떻게 찾는가? 매칭 세션을 만들자.

## 2024-11-06

몬스터 핸들러 부분을 도와드리고 있습니다.
message S2CSpawnMonsterResponse {
int32 monsterId = 1;
int32 monsterNumber = 2;
}
monsterId는 고유한 값으로 관리를 위해서 보내주면 되고
monsterNumber는 1~5사이 값 아무거나 보내면 클라이언트에서 매핑해주셔가지고 MON00001 이런식으로 해결해주신다고 합니다.

## 2024-11-07

해당 유저의 몬스터 스폰 핸들러가 발생할 때 상대방에게는 적의 몬스터 스폰이 생성되었다는 것을 알려주는 것까지 작업 완료

match.handler.js부분이 클라이언트에서는 게임 시작 버튼을 누를때 발생하는 거라는 걸 테스트를 통해 알 수 있었습니다.

## 2024-11-08

플레이어들이 자신의 타워를 제대로 인지를 못하는 문제가 생겼다.
기본적으로 각 플레이어는 자신의 타워로만 자신의 필드에 생성된 몬스터를 공격해야하는데 현재 타워가 1, 2, 3, 4, 5, 6 생성이 되었을 때 1, 2, 3, 만 바라보고 있다.
따라서 타워가 초기 생성되었을 때 적에게 보낸 부분을 제대로 다시 확인해줘야 할 것 같다.

## 2024-11-11

인메모리 형식으로 저장하고 관리하던 것들을 이제 redis로 관리하기 위해서 저장해야할 것들을 미리 따로 빼놓고 정리해보도록 하겠습니다.

작성 하던 도중 시간 상의 문제로 user데이터를 저장하던 부분을 redis에 저장해서 불러오는 방식만 진행하기로 했습니다.

```javascript
클라이언트에서 request로 payloadData가 들어오면
 const { id, password } = requestMessage;
 이 두가지 정보가 들어오게 됩니다.

 그렇다면 회원가입 할때 DB에 user가 있는지 확인하고
 비밀 번호 같은 경우는 로그인에서 bcrypt를 사용해서 해쉬값으로 넣은것을 확인해줍니다.

 DB에 있는 아이라면
 로그인 시점을 갱신해주고 jwt를 생성해 준다.

 서버에 보내는 데이터는
 sendPayload = {
      success: true,
      message: '로그인 성공',
      token: token,
      failCode: failCode.values.NONE,
};
이렇게 4개를 보내주고 우리는 지금까지 인메모리 형식으로
const user = new User(socket, isExistUserInDB.userId, isExistUserInDB.highScore);
redis에 해당 user정보를 저장해둬야함
await addUser(user);
userSession에다가 socket과 userId(아이디임), 최고 점수를 저장해왔기 때문에

우선적으로 redis에 넣어야할 데이터는 socket, userId, highScore, jwt입니다.
```

```javascript
그럼 어떻게 사용하는지 redisConnect.js에 적어보게습니다.
export const RedisManager = {
  addUser: async (user) => {
    try {
      const userData = {
        socketId: user.socket.id,
        userId: user.id,
        highScore: user.highScore,
        jwt: user.socket.token,
      };

      // Redis에 Hash 형식으로 저장
      await redisClient.hmset(`user:${user.id}`, userData);
      console.log(`유저 정보가 Redis에 저장되었습니다: user:${user.id}`);
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
      console.log(`유저 정보 불러오기 성공: user:${userId}`, userData);
      return userData;
    } catch (error) {
      console.error('Redis에서 유저 정보 불러오기 중 오류 발생:', error);
      return null;
    }
  },
```
