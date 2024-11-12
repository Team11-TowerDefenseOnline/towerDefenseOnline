**1. 회원가입 및 로그인 관련**

- **C2SRegisterRequest**

  - 설명: 회원가입 요청 패킷
  - 필드:
    - id (string): 사용자 ID
    - password (string): 비밀번호
    - email (string): 이메일 주소

- **S2CRegisterResponse**

  - 설명: 회원가입 응답 패킷
  - 필드:
    - success (bool): 성공 여부
    - message (string): 응답 메시지
    - failCode (GlobalFailCode): 실패 코드

- **C2SLoginRequest**

  - 설명: 로그인 요청 패킷
  - 필드:
    - id (string): 사용자 ID
    - password (string): 비밀번호

- **S2CLoginResponse**

  - 설명: 로그인 응답 패킷
  - 필드:
    - success (bool): 성공 여부
    - message (string): 응답 메시지
    - token (string): 인증 토큰
    - failCode (GlobalFailCode): 실패 코드

**2. 매칭 관련**

- **C2SMatchRequest**

  - 설명: 매칭 요청 패킷

- **S2CMatchStartNotification**

  - 설명: 매칭 성공 후 게임 시작 알림
  - 필드:
  - initialGameState (InitialGameState): 초기 게임 상태 정보
  - playerData (GameState): 플레이어 게임 상태
  - opponentData (GameState): 상대방 게임 상태

**3. 상태 동기화 관련**

- **S2CStateSyncNotification**

  - 설명: 게임 상태 동기화 패킷
  - 필드:
    - userGold (int32): 현재 골드
    - baseHp (int32): 기지 HP
    - monsterLevel (int32): 몬스터 레벨
    - score (int32): 점수
    - towers (repeated TowerData): 타워 목록
    - monsters (repeated MonsterData): 몬스터 목록

**4. 타워 관련**

- **C2STowerPurchaseRequest**

  - 설명: 타워 구매 요청 패킷
  - 필드:
    - x (float): 타워의 x 좌표
    - y (float): 타워의 y 좌표

- **S2CTowerPurchaseResponse**

  - 설명: 타워 구매 응답 패킷
  - 필드:
  - towerId (int32): 타워 ID

- **S2CAddEnemyTowerNotification**

  - 설명: 적 타워 추가 알림 패킷
  - 필드:
    - towerId (int32): 타워 ID
    - x (float): 타워의 x 좌표
    - y (float): 타워의 y 좌표

**5. 몬스터 관련**

- **C2SSpawnMonsterRequest**

  - 설명: 몬스터 생성 요청 패킷

- **S2CSpawnMonsterResponse**

  - 설명: 몬스터 생성 응답 패킷
  - 필드:
    - monsterId (int32): 몬스터 ID
    - monsterNumber (int32): 몬스터 번호

- **S2CSpawnEnemyMonsterNotification**

  - 설명: 적 몬스터 생성 알림 패킷
  - 필드:
    - monsterId (int32): 몬스터 ID
    - monsterNumber (int32): 몬스터 번호

**6. 전투 액션 관련**

- **C2STowerAttackRequest**

  - 설명: 타워 공격 요청 패킷
  - 필드:
    - towerId (int32): 공격하는 타워 ID
    - monsterId (int32): 공격 대상 몬스터 ID

- **S2CEnemyTowerAttackNotification**

  - 설명: 적 타워 공격 알림 패킷
  - 필드:
    - towerId (int32): 적 타워 ID
    - monsterId (int32): 공격 대상 몬스터 ID

- **C2SMonsterAttackBaseRequest**

  - 설명: 몬스터가 기지를 공격하는 요청 패킷
  - 필드:
    - damage (int32): 공격 데미지

**7. 기지 HP 업데이트 및 게임 오버 관련**

- **S2CUpdateBaseHPNotification**

  - 설명: 기지 HP 업데이트 알림 패킷
  - 필드:
    - isOpponent (bool): 상대방 기지 업데이트 여부 (true 시 상대 기지)
    - baseHp (int32): 업데이트된 기지 HP

- **S2CGameOverNotification**

  - 설명: 게임 종료 알림 패킷
  - 필드:
    - isWin (bool): 승리 여부 (true 시 승리)

**8. 게임 종료**

- **C2SGameEndRequest**

  - 설명: 게임 종료 요청 패킷

**9. 몬스터 사망 통지**

- **C2SMonsterDeathNotification**

  - 설명: 몬스터 사망 통지 패킷
  - 필드:
    - monsterId (int32): 사망한 몬스터 ID

- **S2CEnemyMonsterDeathNotification**

  - 설명: 적 몬스터 사망 통지 패킷
  - 필드:
    - monsterId (int32): 사망한 적 몬스터 ID

**10. 최상위 GamePacket 메시지**

- **GamePacket**
  - 설명: 모든 요청/응답 패킷의 최상위 메시지로, 다양한 payload 타입을 하나의 패킷으로 묶어서 전송
  - 필드:
    - oneof payload: 다양한 요청 및 응답 메시지
