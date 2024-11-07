// 타워 클래스
export class Tower {
    constructor({
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
    }) {
        this.rcode = rcode;
        this.displayName = displayName;
        this.description = description;
        this.power = power;
        this.powerPerLv = powerPerLv;
        this.range = range;
        this.cooldown = cooldown;
        this.duration = duration;
        this.cost = cost;
        this.extra = extra;
        this.extraPerLv = extraPerLv;
        this.x = x;
        this.y = y;
        this.width = 78;
        this.height = 150;
        this.cooldownRemaining = 0;
        this.target = null;
        this.beamDuration = 0;
        this.towerId = towerId;
        this.img = new Image();
        this.img.src = img;
    }

    // 타워 공격 메소드
    attack(monster) {
        if (this.cooldownRemaining <= 0 && monster.hp > 0) {
            monster.hp -= this.power;
            if (monster.hp < 0) monster.hp = 0;
            this.cooldownRemaining = this.cooldown;
            this.beamDuration = this.duration;
            this.target = monster;
            this.sendAttackRequest(this.towerId, monster.rcode);
        }
    }

    // 서버로 타워 공격 요청 전송
    sendAttackRequest(towerId, monsterId) {
        const request = {
            type: 'TOWER_ATTACK_REQUEST',
            data: { towerId, monsterId }
        };
        sendMessageToServer(request);
    }

    // 타워 범위 내 몬스터 공격 여부 확인
    isInRange(monster) {
        const distance = Math.sqrt(Math.pow(this.x - monster.x, 2) + Math.pow(this.y - monster.y, 2));
        return distance <= this.range;
    }

    // 범위 내 몬스터를 공격하는 메소드
    updateAttackTargets(monsters) {
        monsters.forEach(monster => {
            if (this.isInRange(monster)) this.attack(monster);
        });
    }

    // 타워 쿨타임 상태 업데이트
    updateCooldown() {
        if (this.cooldownRemaining > 0) {
            this.cooldownRemaining--;
        }
    }

    // 타워 객체 생성 메소드
    static createTower(towerData, x, y) {
        return new Tower({
            rcode: towerData.id,
            displayName: towerData.DisplayName,
            description: towerData.Description,
            power: towerData.Power,
            powerPerLv: towerData.PowerPerLv,
            range: towerData.Range,
            cooldown: towerData.Cooldown,
            duration: towerData.Duration,
            cost: towerData.Cost,
            extra: towerData.Extra,
            extraPerLv: towerData.ExtraPerLv,
            x,
            y,
            towerId: towerData.id, // ID가 그대로 사용됩니다.
            img: `assets/images/towers/${towerData.id}.png` // 타워 이미지를 경로로 지정 (추가된 이미지 규칙에 맞게 수정)
        });
    }

    // 타워 판매 메소드
    sellTower() {
        console.log(`${this.displayName} 타워가 판매되었습니다.`);
        const refundAmount = Math.floor(this.cost * 0.8); // 80% 반환
        console.log(`반환된 금액: ${refundAmount}`);
        removeTowerFromGame(this); // 타워 제거 - 게임 화면 및 게임 내 데이터 타워 제거
        sendTowerSellRequest(this.towerId); // 타워 제거 후 - 클라이언트 및 서버 타워 제거 처리
    }
}

// 타워 데이터 로딩 및 타워 생성
function loadTowerDataFromJson(json) {
    const towers = json.data.map(towerData => {
        return Tower.createTower(towerData, 0, 0); // 초기 위치는 (0, 0)으로 설정
    });
    return towers;
}

// 타워 판매 요청을 서버로 전송
function sendTowerSellRequest(towerId) {
    const sellRequest = {
        type: 'TOWER_SELL_REQUEST',
        data: { towerId }
    };
    sendMessageToServer(sellRequest);
}

// 서버로부터 타워 판매 응답을 처리하는 함수
function handleTowerSellResponse(response) {
    if (response.success) {
        console.log(`타워 판매 성공! 반환된 금액: ${response.refundAmount}`);
    } else {
        console.log(`타워 판매 실패: ${response.message}`);
    }
}

// 타워 ID로 타워 데이터를 가져오는 함수
function getTowerDataById(towerId) {
    // 타워 데이터는 클라이언트에서 관리되는 구조입니다.
    // 여기서는 이미 로딩된 JSON 데이터를 기준으로 가져오는 방식입니다.
    return towerDataFromJson.find(tower => tower.rcode === towerId);
}

// 타워 구매 요청을 서버로 전송
function purchaseTower(x, y) {
    const towerData = { type: 'TOWER_PURCHASE_REQUEST', data: { x, y } };
    sendMessageToServer(towerData);
}

// 타워 구매 응답 처리
function TOWER_PURCHASE_RESPONSE(response) {
    const { towerId, x, y } = response.data;
    const towerData = getTowerDataById(towerId);  // 서버에서 towerId만 받음
    const tower = Tower.createTower(towerData, x, y);
    addTowerToGame(tower);
}

// 서버로부터 타워 구매 응답을 받는 부분
function onMessageReceived(response) {
    if (response.type === 'TOWER_PURCHASE_RESPONSE') {
        TOWER_PURCHASE_RESPONSE(response);
    }
}

// 타워 공격 요청 처리
function sendTowerAttackRequest(towerId, monsterId) {
    const attackData = {
        type: 'TOWER_ATTACK_REQUEST',
        data: { towerId, monsterId }
    };
    sendMessageToServer(attackData);
}

// 서버로 메시지를 전송하는 함수 
function sendMessageToServer(message) {
    console.log('Sending message to server:', message);
}

// 타워를 게임에 추가하는 함수
function addTowerToGame(tower) {
    console.log("Tower added to game:", tower);
}

// 타워를 게임에서 제거하는 함수
function removeTowerFromGame(tower) {
    console.log(`${tower.displayName} 타워가 게임에서 제거되었습니다.`);
}

// 타워 데이터는 클라이언트에서 관리되는 구조
let towerDataFromJson = [];

// JSON 파일을 로드하고 파싱 - 서버환경에 맞게 수정 ++++
fetch('assets/tower.json')
    .then(response => response.json())
    .then(json => {
        towerDataFromJson = loadTowerDataFromJson(json);
        console.log("타워 데이터 로딩 완료", towerDataFromJson);
    })
    .catch(error => {
        console.error("타워 데이터 로딩 실패:", error);
    });
