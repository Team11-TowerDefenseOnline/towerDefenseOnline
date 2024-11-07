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
