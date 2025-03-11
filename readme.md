# Tower Defense Online Project

![image](https://github.com/user-attachments/assets/786cb6c2-668e-4c5e-b0d3-d0d18836858b)


## 소개

스파르타 내일배움캠프 Node.js 6기 게임서버 Tower Defense Online Project 11팀 '롤 내전 구하는 조'의 TowerDefenseOnlineProject는 게임 개발 프로젝트에서 주어진 Client와 패킷 명세서를 통해 데이터를 잘 주고 받아 서버와 클라가 잘 구동되게 만드는 것을 목표로 합니다.

- [과제 링크](https://teamsparta.notion.site/Node-6-CH-5-0f673366fadd440a9f22c8813ec6280c)
- [깃 허브 링크](https://github.com/orgs/Team11-TowerDefenseOnline/repositories)

## 패킷 명세서

- [패킷 명세서 링크](packet.md)

## 트러블 슈팅

- [이상한 페이로드 출력](https://dydgustmdfl1231.tistory.com/75)
- [DB 연결이 안되는 경우 계속 시도하는 문제](https://dydgustmdfl1231.tistory.com/76)
- [상대 게임 탈주시 상태동기화 인터벌이 날뛰는 문제](https://dydgustmdfl1231.tistory.com/77)
- [한판 한 뒤 끝내면 서버 에러](https://dydgustmdfl1231.tistory.com/78)
- [게임 종료 후 인터벌 매니저가 남아 발생하는 오류](https://dydgustmdfl1231.tistory.com/79)

## 디렉토리 구조

```javascript
src
    ├───classes
    │   ├───managers
    │   └───models
    ├───config
    ├───constants
    ├───db
    │   ├───migrations
    │   ├───sql
    │   └───user
    ├───events
    ├───handler
    │   ├───game
    │   ├───monster
    │   └───user
    ├───init
    ├───protobuf
    │   ├───notification
    │   ├───request
    │   └───response
    ├───session
    └───utils
        ├───errors
        ├───notification
        ├───parser
        ├───response
        ├───testConnection
        └───validation
```

## 팀원 소개

| 이름   | 역할   | 담당 업무                                                               | 깃허브                                |
| ------ | ------ | ----------------------------------------------------------------------- | ------------------------------------- |
| 임동혁 | 팀장   | 회원가입, 로그인, 매칭, 초반 코드 스켈레톤 구조, 팀원들과 라이브코딩    | https://github.com/skybanana          |
| 박용현 | 부팀장 | 회원가입, 로그인, 매칭, 초반 코드 스켈레톤 구조, 팀원들과 라이브코딩    | https://github.com/YongHyeon1231      |
| 김진수 | 팀원   | 상태 동기화, 넥서스 HP 업데이트, 게임 오버, 게임 종료                   | https://github.com/qui2dty/           |
| 정준엽 | 팀원   | 몬스터 생성, 상대 몬스터 생성, 몬스터 공격, 몬스터 처치, 적 몬스터 처치 | https://github.com/JungJaeU           |
| 이민석 | 팀원   | 타워 구매, 상대 타워 생성, 타워 공격, 적 타워 공격                      | https://github.com/haru0726           |
| 문민철 | 팀원   | 큰 문제가 발생했을 때 지니고 있는 많은 지식을 토대로 도와주기           | https://github.com/vxbdfsg/codingtest |
