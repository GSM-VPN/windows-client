# Windows Client

GSM-VPN에 접속하는 Windows용 앱입니다.

## 역할

- 게이트웨이에 로그인
- 사용 가능한 VPN 서버 조회
- 서버 선택 후 연결/해제
- 연결 상태와 할당 주소 표시
- WireGuard 설치와 터널 연결 자동화

## 기술 스택

- Electron
- TypeScript
- zaemoru UI 컴포넌트

## 실행 준비

1. `npm install`
2. `.env.example`을 `.env`로 복사
3. `GATEWAY_URL`을 게이트웨이 주소로 설정

## 개발 실행

```bash
npm run dev
```

## Windows 빌드

```bash
npm run build:win
```

## 주의사항

- 아이콘은 `assets/GSM_VPN.ico`를 사용합니다.
- WireGuard가 없으면 앱이 공식 설치 파일을 내려받아 설치를 시도합니다.
- 렌더러는 `hero`, `sidebar`, `server-list` 등 작은 모듈로 나눠져 있습니다.

