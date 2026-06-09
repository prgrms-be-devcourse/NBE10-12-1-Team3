# 프론트엔드 실행 방법

### 백엔드 연동 시 (실제 API 사용)

`frontend/.env.local` 파일을 직접 생성합니다.

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

```bash
cd frontend
pnpm install
pnpm dev
```

백엔드 서버(포트 8080)와 함께 실행하면 실제 API로 연동됩니다.

---

### 프론트 단독 테스트 시 (Mock 사용)

MSW(Mock Service Worker)를 사용합니다. 아래 순서대로 설정하세요.

**1. MSW 서비스 워커 파일 생성**

```bash
cd frontend
pnpm dlx msw init public/
```

**2. `.env.local` 파일 생성**

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK=true
```

**3. 실행**

```bash
pnpm install
pnpm dev
```
