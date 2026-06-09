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

> `NEXT_PUBLIC_API_BASE_URL`은 Mock 모드에서도 설정이 필요합니다.
> MSW 핸들러가 이 값을 기준으로 절대 URL을 매칭하기 때문입니다.
> 백엔드 포트가 다르다면 해당 포트로 변경하세요.

**3. 실행**

```bash
pnpm install
pnpm dev
```

**Mock 테스트 계정**

| 페이지 | 입력값 | 결과 |
|--------|--------|------|
| 주문 조회 | `user1@example.com` | 주문 3건 |
| 주문 조회 | `user2@example.com` | 주문 2건 |
| 관리자 로그인 | 아무 이메일 | 통과 |

**특정 API만 Mock으로 테스트하고 싶을 때**

MSW는 `onUnhandledRequest: "bypass"` 옵션으로 동작합니다.
`src/mocks/handlers.ts`에 핸들러가 등록된 경로만 Mock이 가로채고, 나머지는 실제 백엔드로 통과합니다.

따라서 Mock이 필요 없는 핸들러는 `handlers.ts`에서 주석 처리하면 해당 API는 백엔드로 연결됩니다.
Mock과 실제 API를 경로 단위로 혼용할 수 있습니다.

```ts
// src/mocks/handlers.ts 예시
export const handlers = [
  // http.get(`${BASE_URL}/v1/products`, handler) ← 주석 처리 시 실제 백엔드로 연결
  http.get(`${BASE_URL}/v1/admin/orders`, handler), // ← Mock 사용
];
```

---

### 프론트 단독 테스트 환경 제거 시

```bash
rm public/mockServiceWorker.js
```

`.env.local`에서 `NEXT_PUBLIC_USE_MOCK=true` 줄을 삭제합니다.
