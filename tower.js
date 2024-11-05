// 타워 클래스
export class Tower {
    constructor(
        rcode,
        displayName,
        description,
        power,
        powerPerLv,
        range,
        cooldown,
        duration,
        cost,
        extra,
        extraPerLv,
        x,
        y,
        towerId,
        img
    ) {
        this.rcode = rcode; // 리소스 코드
        this.displayName = displayName; // 타워 이름
        this.description = description; // 타워 설명
        this.power = power; // 타워 기본 공격력
        this.powerPerLv = powerPerLv; // 레벨 업 시 공격력 증가
        this.range = range; // 타워 사거리
        this.cooldown = cooldown; // 타워 쿨타임 (ms 단위)
        this.duration = duration; // 타워의 지속 시간
        this.cost = cost; // 타워 구입 비용
        this.extra = extra; // 추가 효과 (예: 화염 타워는 데미지 증가, 얼음 타워는 속도 감소)
        this.extraPerLv = extraPerLv; // 레벨 업 시 추가 효과 증가

        this.x = x; // 타워 이미지 x 좌표
        this.y = y; // 타워 이미지 y 좌표
        this.width = 78; // 타워 이미지 가로 길이
        this.height = 150; // 타워 이미지 세로 길이
        this.cooldownRemaining = 0; // 남은 쿨타임
        this.target = null; // 타워의 목표 (적)
        this.beamDuration = 0; // 광선 지속 시간
        this.towerId = towerId; // 타워 ID
        this.img = new Image(); // 타워 이미지 객체
        this.img.src = img; // 이미지 파일 경로
    }

    // 타워 공격 메소드
    attack(monster) {
        // 타워가 몬스터를 공격하는 메소드
        if (monster.hp > 0) {
            monster.hp -= this.power; // 공격력만큼 몬스터 체력 감소
            if (monster.hp < 0) monster.hp = 0; // 체력은 0 이하로 내려가지 않음
            this.cooldownRemaining = this.cooldown; // 쿨타임 시작
            this.beamDuration = this.duration; // 광선 지속 시간 설정
            this.target = monster; // 광선의 목표 설정
    
            // 서버로 공격 요청을 보냄 (C2S)
            this.sendAttackRequest(this.towerId, monster.rcode);
        }
    }

    // 타워 공격 요청을 서버로 전송
    sendAttackRequest(towerId, monsterId) {
        const request = {
            type: 'TOWER_ATTACK_REQUEST',
            data: {
                towerId: towerId,
                monsterId: monsterId,
            },
        };
        sendMessageToServer(request); // 서버로 메시지 전송
    }

    // 타워의 범위 내 몬스터 공격 여부를 확인하는 메소드
    isInRange(monster) {
        const distance = Math.sqrt(Math.pow(this.x - monster.x, 2) + Math.pow(this.y - monster.y, 2));
        return distance <= this.range; // 타워 범위 내에 몬스터가 있는지 체크
    }

    // 타워가 범위 내 몬스터를 공격하는 메소드 (매 프레임마다 호출)
    updateAttackTargets(monsters) {
        for (let monster of monsters) {
            if (this.isInRange(monster)) {
                this.attack(monster); // 범위 내 몬스터 공격
            }
        }
    }

    // 타워 쿨타임 상태 업데이트
    updateCooldown() {
        if (this.cooldownRemaining > 0) {
            this.cooldownRemaining--; // 남은 쿨타임 차감
        }
    }

    // 타워 객체 생성 메소드
    static createTower(towerData, x, y) {
        return new Tower(
            towerData.rcode,
            towerData.displayName,
            towerData.description,
            towerData.power,
            towerData.powerPerLv,
            towerData.range,
            towerData.cooldown,
            towerData.duration,
            towerData.cost,
            towerData.extra,
            towerData.extraPerLv,
            x,
            y,
            towerData.towerId,
            towerData.img
        );
    }

    // 타워 판매 메소드 (게임에서 타워 제거 및 자원 반환)
    sellTower() {
        console.log(`${this.displayName} 타워가 판매되었습니다.`);
        
        // 80% 금액 반환
        const refundAmount = Math.floor(this.cost * 0.8);
        console.log(`반환된 금액: ${refundAmount}`);
        
        // 타워 제거 (게임 화면 및 게임 내 데이터에서 타워 제거)
        removeTowerFromGame(this); // 타워를 게임에서 제거하는 함수
        
        // 타워 제거 후 클라이언트 및 서버에서 타워 제거 처리 (필요에 따라 추가)
        sendTowerSellRequest(this.towerId); // 서버에 타워 판매 요청
    }
}

// 미리 정의된 타워 데이터 객체
const towerDatabase = {
    TOW00001: {
        rcode: "TOW00001",
        displayName: "일반타워",
        description: "평범한 타워",
        power: 40,
        powerPerLv: 10,
        range: 300,
        cooldown: 180,
        duration: 30,
        cost: 10,
        extra: 1,
        extraPerLv: 0.5,
        towerId: 1,
        img: "towerImage.png"
    },
    TOW00002: {
        rcode: "TOW00002",
        displayName: "화염타워",
        description: "화염 광역공격 타워",
        power: 60,
        powerPerLv: 15,
        range: 400,
        cooldown: 300,
        duration: 20,
        cost: 100,
        extra: 0,
        extraPerLv: 0,
        towerId: 2,
        img: "flameTowerImage.png"
    },
    TOW00003: {
        rcode: "TOW00003",
        displayName: "번개타워",
        description: "체인 라이트닝 타워",
        power: 20,
        powerPerLv: 5,
        range: 200,
        cooldown: 60,
        duration: 15,
        cost: 3,
        extra: 0,
        extraPerLv: 1,
        towerId: 3,
        img: "lightningTowerImage.png"
    },
    TOW00004: {
        rcode: "TOW00004",
        displayName: "얼음타워",
        description: "이동속도를 줄여주는 타워",
        power: 10,
        powerPerLv: 5,
        range: 300,
        cooldown: 120,
        duration: 8,
        cost: 10,
        extra: 1,
        extraPerLv: 1,
        towerId: 4,
        img: "iceTowerImage.png"
    }
};

// 타워 ID로 타워 데이터를 가져오는 함수
function getTowerDataById(towerId) {
    return towerDatabase[towerId]; // 타워 데이터를 반환
}

// 타워 구매 요청을 서버로 전송 (C2S)
function purchaseTower(x, y) {
    const towerData = {
        type: 'TOWER_PURCHASE_REQUEST',
        data: {
            x: x,
            y: y,
        },
    };
    sendMessageToServer(towerData); // 서버로 구매 요청 보내기
}

// 타워 구매 응답 (S2C)
function TOWER_PURCHASE_RESPONSE(response) {
    const { towerId } = response.data;
    // 타워 구매가 성공적으로 이루어진 후, 타워 객체를 생성하고 화면에 표시
    const towerData = getTowerDataById(towerId);
    const tower = Tower.createTower(towerData, response.data.x, response.data.y);
    addTowerToGame(tower); // 게임에 타워 추가
}

// 서버로부터 타워 구매 응답을 받는 부분
function onMessageReceived(response) {
    if (response.type === 'TOWER_PURCHASE_RESPONSE') {
        TOWER_PURCHASE_RESPONSE(response); // 타워 구매 응답 처리
    }
}

// 타워 공격 요청 처리 (C2S)
function sendTowerAttackRequest(towerId, monsterId) {
    const attackData = {
        type: 'TOWER_ATTACK_REQUEST',
        data: {
            towerId: towerId,
            monsterId: monsterId,
        },
    };
    sendMessageToServer(attackData); // 서버로 타워 공격 요청 전송
}

// 서버로 메시지를 전송하는 함수 (예시)
function sendMessageToServer(message) {
    // WebSocket 또는 HTTP 요청을 사용하여 서버로 메시지 전송
    console.log('Sending message to server:', message);
}

// 타워를 게임에 추가하는 함수
function addTowerToGame(tower) {
    // 게임 화면에 타워를 추가하는 로직을 구현
    console.log("Tower added to game:", tower);
}

// 타워를 게임에서 제거하는 함수
function removeTowerFromGame(tower) {
    // 게임에서 타워 제거하는 로직
    console.log(`${tower.displayName} 타워가 게임에서 제거되었습니다.`);
}
