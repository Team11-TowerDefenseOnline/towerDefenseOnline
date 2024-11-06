export const packetNames = {
  common: {
    Packet: 'common.Packet',
    Ping: 'common.Ping',
    C2SRegisterRequest: 'common.C2SRegisterRequest',
    S2CRegisterResponse: 'common.S2CRegisterResponse',
    C2SLoginRequest: 'common.C2SLoginRequest',
    S2CLoginResponse: 'common.S2CLoginResponse',
    GamePacket: 'common.GamePacket',
    BaseData: 'common.BaseData',
    TowerData: 'common.TowerData',
    MonsterData: 'common.MonsterData',
    Position: 'common.Position',
    GameState: 'common.GameState',
    C2SMatchRequest:'common.C2SMatchRequest',
    InitialGameState : 'common.InitialGameState',
    S2CMatchStartNotification:'common.S2CMatchStartNotification',
    S2CStateSyncNotification:'common.S2CStateSyncNotification',
    C2STowerPurchaseRequest:'common.C2STowerPurchaseRequest',
    S2CAddEnemyTowerNotification:'common.S2CAddEnemyTowerNotification',
    C2SSpawnMonsterRequest:'common.C2SSpawnMonsterRequest',
    S2CSpawnMonsterResponse:'common.S2CSpawnMonsterResponse',
    S2CSpawnEnemyMonsterNotification:'common.S2CSpawnEnemyMonsterNotification',
    C2STowerAttackRequest:'common.C2STowerAttackRequest',
    S2CEnemyTowerAttackNotification:'common.S2CEnemyTowerAttackNotification',
    C2SMonsterAttackBaseRequest:'common.C2SMonsterAttackBaseRequest',
    S2CUpdateBaseHPNotification:'common.S2CUpdateBaseHPNotification',
    S2CGameOverNotification:'common.S2CGameOverNotification',
    C2SGameEndRequest:'common.C2SGameEndRequest',
    C2SMonsterDeathNotification:'common.C2SMonsterDeathNotification',
    S2CEnemyMonsterDeathNotification:'common.S2CEnemyMonsterDeathNotification',
  },
  response: {
    Response: 'response.Response',
  },
  initial: {
    InitialPacket: 'initial.InitialPacket',
  },
  gameNotification: {
    LocationUpdate: 'gameNotification.LocationUpdate',
  },
  game: {
    LocationUpdatePayload: 'game.LocationUpdatePayload',
  },
};

export const enumNames = {
  common: {
    GlobalFailCode: 'common.GlobalFailCode',
  },
};
