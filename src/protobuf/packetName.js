export const packetNames = {
  common: {
    Packet: "common.Packet",
    Ping: "common.Ping",
    C2SRegisterRequest : "common.C2SRegisterRequest",
    S2CRegisterResponse: "common.S2CRegisterResponse",
    C2SLoginRequest : "common.C2SLoginRequest",
    S2CLoginResponse : "common.S2CLoginResponse"
  },
  response: {
    Response: "response.Response",
  },
  initial: {
    InitialPacket: "initial.InitialPacket",
  },
  gameNotification: {
    LocationUpdate: "gameNotification.LocationUpdate",
  },
  game: {
    LocationUpdatePayload: "game.LocationUpdatePayload",
  },
};
