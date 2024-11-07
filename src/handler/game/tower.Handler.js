// 다른 핸들러를 복붙해두고 시작해도 좋을듯?
// 모방은 창조의 마덜
import { getProtoMessages } from '../../init/loadProto.js';
import { getGameSession } from '../../session/game.session.js';
import { serializer } from '../../utils/notification/game.notification.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { getTowerDataById } from '../../game/tower.js'; // 타워 데이터 가져오기
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import CustomError from '../../utils/errors/customError.js';
import { PACKET_TYPE, PACKET_TYPE_LENGTH } from '../../constants/header.js';

// 타워 추가 요청 처리 핸들러

const towerId = Math.floor(Math.random() * 4) + 1; 

export const addTowerHandler = async ({ socket, payloadData }) => {
  try {
    const { x, y } = payloadData; // x,y 좌표를 클라로부터 받는다.
    // 타워 추가 응답 생성
    const protoMessages = getProtoMessages();
    const response = protoMessages.common.GamePacket;
    const packet = response.encode(towerId).finish();

    // 타워 추가 응답을 클라이언트에게 전송
    socket.write(serializer(packet, 6, 1));

  } catch (error) {
    console.error(`${socket} : ${error}`);
    handleError(socket, error);
  }
};

// 타워 판매 요청 처리 핸들러
const sellTowerHandler = async ({ socket, payloadData }) => {
  try {
    const { towerId } = payloadData;

    // 게임 세션에서 해당 타워를 가져옴
    const session = getGameSession(socket);
    const tower = session.getTowerById(towerId);

    // 타워가 존재하지 않으면 오류 처리
    if (!tower) {
      throw new CustomError(ErrorCodes.INVALID_TOWER_ID, '타워가 존재하지 않습니다.');
    }

    // 타워 판매 처리
    const refundAmount = Math.floor(tower.cost * 0.8); // 판매 가격은 80% 반환
    session.addResources(refundAmount); // 자원 반환
    session.removeTower(tower); // 타워 제거

    // 타워 판매 응답 생성
    const protoMessages = getProtoMessages();
    const response = protoMessages.common.GamePacket;
    const packet = response
      .encode({
        towerSellNotification: {
          towerId: tower.towerId,
          refundAmount: refundAmount,
        },
      })
      .finish();

    // 타워 판매 응답을 클라이언트에게 전송
    socket.write(serializer(packet, 6, 1));

  } catch (error) {
    console.error(`${socket} : ${error}`);
    handleError(socket, error);
  }
};

// 타워 업그레이드 요청 처리 핸들러
const upgradeTowerHandler = async ({ socket, payloadData }) => {
  try {
    const { towerId } = payloadData;

    // 게임 세션에서 해당 타워를 가져옴
    const session = getGameSession(socket);
    const tower = session.getTowerById(towerId);

    // 타워가 존재하지 않으면 오류 처리
    if (!tower) {
      throw new CustomError(ErrorCodes.INVALID_TOWER_ID, '타워가 존재하지 않습니다.');
    }

    // 타워 업그레이드 처리
    const towerData = getTowerDataById(towerId);

    // 업그레이드에 필요한 자원 확인 (고정 비용 500)
    const upgradeCost = 500; // 업그레이드 비용을 500으로 고정
    const currentResources = session.getResources(); // 플레이어의 현재 자원

    // 자원이 부족하면 오류 처리
    if (currentResources < upgradeCost) {
      throw new CustomError(ErrorCodes.NOT_ENOUGH_RESOURCES, '자원이 부족합니다.');
    }

    // 자원 차감
    session.subtractResources(upgradeCost);

    // 타워 레벨 업그레이드
    tower.power += towerData.powerPerLv; // 타워의 공격력을 레벨당 증가
    tower.range += towerData.extraPerLv; // 타워의 범위를 레벨당 증가
    tower.cooldown -= 10; // 타워의 쿨타임을 조금 줄임 (임의의 값)

    // 업그레이드된 타워의 데이터 저장
    session.updateTower(tower);

    // 타워 업그레이드 응답 생성
    const protoMessages = getProtoMessages();
    const response = protoMessages.common.GamePacket;
    const packet = response
      .encode({
        towerUpgradeNotification: {
          towerId: tower.towerId,
          newPower: tower.power,
          newRange: tower.range,
          newCooldown: tower.cooldown,
          refundAmount: upgradeCost, // 소모된 자원 (업그레이드 비용)
        },
      })
      .finish();

    // 타워 업그레이드 응답을 클라이언트에게 전송
    socket.write(serializer(packet, 6, 1));

  } catch (error) {
    console.error(`${socket} : ${error}`);
    handleError(socket, error);
  }
};

// 요청에 맞는 타워 처리를 담당하는 메인 핸들러
const towerHandler = async (socket, payloadData) => {
  const { action } = payloadData; // action 값에 따라 처리
  switch (action) {
    case 'add':
      await addTowerHandler({ socket, payloadData });
      break;
    case 'sell':
      await sellTowerHandler({ socket, payloadData });
      break;
    case 'upgrade':
      await upgradeTowerHandler({ socket, payloadData });
      break;
    default:
      throw new CustomError(ErrorCodes.INVALID_ACTION, '유효하지 않은 액션입니다.');
  }
};

export { towerHandler };
