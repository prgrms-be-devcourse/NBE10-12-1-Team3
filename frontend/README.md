# 프론트엔드 실행 방법
### 백엔드 연동

`frontend/.env.local` 파일을 직접 생성합니다.

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

```bash
cd frontend
pnpm dev (또는 npm run dev)
```

백엔드 서버(포트 8080)와 함께 실행하면 실제 API로 연동됩니다.

---
# 프론트 수정 요청 프롬프트 예시
Next.js + Tailwind CSS + shadcn/ui + TypeScript 프로젝트에서 추가 기능 구현을 위한 Claude Code 지시문 작성해줘

프로젝트 구조:
```text
frontend/
├── .env.local
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── products/page.tsx
    │   ├── orders/page.tsx
    │   ├── orders/complete/page.tsx
    │   └── admin/
    │       ├── verify-email/page.tsx
    │       └── orders/page.tsx
    ├── components/
    │   ├── common/ (StoreHeader, MainCard, OrderTable, Pagination)
    │   ├── products/ (ProductGrid, ProductQuickView, CartSummary, CheckoutForm, OrderList)
    │   ├── orders/ (OrderCompleteCard)
    │   └── admin/ (AdminOrderTable, ShippingResultModal)
    └── lib/
        ├── api.ts
        └── constants.ts
```
규칙:
- 항상 `작업 범위: frontend/ 폴더 안 파일만 생성/수정. 다른 폴더 절대 건드리지 말 것.` 을 앞에 붙여줘
- 코드 파일만 작성, 설명 없음, 주석 최소화
- 수정이 필요한 파일을 정확히 명시해줘