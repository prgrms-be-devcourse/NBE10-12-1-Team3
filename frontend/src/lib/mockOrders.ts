import type { AdminOrder } from "@/lib/api";

// TODO: API 연결 시 이 파일 전체 삭제
export const mockOrders: AdminOrder[] = [
  {
    orderId: 1,
    createdAt: "2026-06-09T10:00:00",
    updatedAt: "2026-06-09T10:00:00",
    deletedAt: null,
    postStatus: "READY",
    orderNumber: 20260609001,
    email: "user1@example.com",
    totalPrice: 33000,
    orderItems: [
      { orderItemId: 1, itemId: 1, quantity: 1 },
      { orderItemId: 2, itemId: 2, quantity: 1 },
    ],
  },
  {
    orderId: 2,
    createdAt: "2026-06-09T11:30:00",
    updatedAt: "2026-06-09T12:00:00",
    deletedAt: null,
    postStatus: "SHIPPED",
    orderNumber: 20260609002,
    email: "user2@example.com",
    totalPrice: 80000,
    orderItems: [
      { orderItemId: 3, itemId: 3, quantity: 1 },
      { orderItemId: 4, itemId: 4, quantity: 1 },
    ],
  },
  {
    orderId: 3,
    createdAt: "2026-06-09T13:00:00",
    updatedAt: "2026-06-09T13:00:00",
    deletedAt: null,
    postStatus: "CANCELLED",
    orderNumber: 20260609003,
    email: "user3@example.com",
    totalPrice: 48000,
    orderItems: [
      { orderItemId: 5, itemId: 4, quantity: 1 },
    ],
  },
];
