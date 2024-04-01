# Socket Test Client

- STOMP 프로토콜을 사용하여 실시간 통신을 구현하고 테스트하기 위한 클라이언트
- [algobaro-api](https://github.com/1e5i-Shark/algobaro-api) 웹 소켓 기본 연결 테스트를 목적으로 함

## Installation

```bash
npm install
```

## Setting

`/src/config.js` 설정 파일을 수정하여 사용

- `baseUrl`: 서버 주소
- `pubPrefix`: publication prefix
- `subPrefix`: subscription prefix
- `roomIndices`: 방 목록, 필요한 경우 서버 Database에 저장된 방 정보를 가져와 사용
- `bearerToken`: 인증 토큰

## Usage

```bash
npm start
```
