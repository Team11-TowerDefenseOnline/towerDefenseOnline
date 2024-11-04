class Tower {
  constructor(x, y, cost, attackPower, range, cooltime, towerId, img) {
      this.x = x; // 타워 이미지 x 좌표
      this.y = y; // 타워 이미지 y 좌표
      this.width = 78; // 타워 이미지 가로 길이
      this.height = 150; // 타워 이미지 세로 길이
      this.attackPower = attackPower; // 타워 공격력
      this.range = range; // 타워 사거리
      this.cost = cost; // 타워 구입 비용
      this.cooldown = 0; // 타워 공격 쿨타임
      this.cooltime = cooltime; // 타워 공격 쿨타임 설정값
      this.beamDuration = 0; // 타워 광선 지속 시간
      this.target = null; // 타워 광선의 목표
      this.towerId = towerId; // 타워 고유 ID
      this.img = new Image();
      this.img.src = img; // 타워 이미지 경로
  }

  draw(ctx) {
      if (this.img.complete) {
          ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
          if (this.beamDuration > 0 && this.target) {
              ctx.beginPath();
              ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
              ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
              ctx.strokeStyle = 'skyblue';
              ctx.lineWidth = 10;
              ctx.stroke();
              ctx.closePath();
              this.beamDuration--;
          }
      } else {
          this.img.onload = () => {
              ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
              if (this.beamDuration > 0 && this.target) {
                  ctx.beginPath();
                  ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
                  ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
                  ctx.strokeStyle = 'skyblue';
                  ctx.lineWidth = 10;
                  ctx.stroke();
                  ctx.closePath();
                  this.beamDuration--;
              }
          };
      }
  }

  attack(monster) {
      monster.hp -= this.attackPower;
      this.cooldown = this.cooltime; // 쿨타임 설정
      this.beamDuration = 30; // 광선 지속 시간
      this.target = monster; // 공격할 몬스터 설정
  }

  updateCooldown() {
      if (this.cooldown > 0) {
          this.cooldown--;
      }
  }
}

// 타워 구매 요청을 처리하는 함수
function purchaseTower(x, y, towerType) {
  let cost, attackPower, range, cooltime, towerId, img;

  // 타워 타입에 따라 속성 설정
  switch(towerType) {
      case 'basic':
          cost = 100;
          attackPower = 10;
          range = 150;
          cooltime = 180;
          towerId = 1; // 또는 서버에서 받아온 ID
          img = 'path/to/basic_tower/image.png';
          break;
      case 'advanced':
          cost = 200;
          attackPower = 20;
          range = 200;
          cooltime = 120;
          towerId = 2; // 또는 서버에서 받아온 ID
          img = 'path/to/advanced_tower/image.png';
          break;
      // 다른 타워 타입 추가
      default:
          console.error('잘못된 타워 타입입니다.');
          return;
  }

  // 타워 객체 생성
  const newTower = new Tower(x, y, cost, attackPower, range, cooltime, towerId, img);
  sendPurchaseRequest(newTower);
}

// 구매 요청을 서버에 보내는 함수
function sendPurchaseRequest(tower) {
  const requestPayload = {
      tower: {
          x: tower.x,
          y: tower.y,
          cost: tower.cost,
          towerId: tower.towerId,
      },
  };

  // Fetch API를 사용하여 서버에 POST 요청을 보냄
  fetch('/api/tower/purchase', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
  })
  .then(response => response.json())
  .then(handlePurchaseResponse)
  .catch(error => console.error('구매 요청 중 오류 발생:', error));
}

// 서버 응답을 처리하는 함수
function handlePurchaseResponse(response) {
  if (response.towerId) {
      console.log('타워 구매 성공! 타워 ID:', response.towerId);
      // 타워를 게임에 추가하는 로직
      // 예: 게임 내 타워 배열에 추가
      gameTowers.push(new Tower(/* 필요한 속성들 */));
  } else {
      console.error('타워 구매 실패:', response.message);
  }
}

// 예시: 타워 구매 호출
purchaseTower(1, 2, 'basic'); // 기본 타워 구매
