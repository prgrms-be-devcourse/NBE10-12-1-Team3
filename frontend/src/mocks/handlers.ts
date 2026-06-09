import { http, HttpResponse } from "msw";
import { mockProducts, mockProductDetails } from "@/lib/mockProducts";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const mockOrders = [
  {
    orderId: 1,
    orderNumber: 20260601001,
    totalPrice: 33000,
    postStatus: "READY",
    email: "user1@example.com",
    createdAt: "2026-06-01T10:00:00",
    updatedAt: "2026-06-01T10:00:00",
    orderItems: [
      { orderItemId: 1, itemId: 1, quantity: 1 },
      { orderItemId: 2, itemId: 2, quantity: 1 },
    ],
  },
  {
    orderId: 2,
    orderNumber: 20260603001,
    totalPrice: 32000,
    postStatus: "SHIPPED",
    email: "user1@example.com",
    createdAt: "2026-06-03T14:30:00",
    updatedAt: "2026-06-03T14:30:00",
    orderItems: [
      { orderItemId: 3, itemId: 3, quantity: 1 },
    ],
  },
  {
    orderId: 3,
    orderNumber: 20260605001,
    totalPrice: 48000,
    postStatus: "READY",
    email: "user1@example.com",
    createdAt: "2026-06-05T09:15:00",
    updatedAt: "2026-06-05T09:15:00",
    orderItems: [
      { orderItemId: 4, itemId: 4, quantity: 1 },
    ],
  },
  {
    orderId: 4,
    orderNumber: 20260606001,
    totalPrice: 63000,
    postStatus: "SHIPPED",
    email: "user2@example.com",
    createdAt: "2026-06-06T11:00:00",
    updatedAt: "2026-06-06T11:00:00",
    orderItems: [
      { orderItemId: 5, itemId: 1, quantity: 2 },
      { orderItemId: 6, itemId: 2, quantity: 1 },
    ],
  },
  {
    orderId: 5,
    orderNumber: 20260607001,
    totalPrice: 15000,
    postStatus: "CANCELLED",
    email: "user2@example.com",
    createdAt: "2026-06-07T16:45:00",
    updatedAt: "2026-06-07T16:45:00",
    orderItems: [
      { orderItemId: 7, itemId: 2, quantity: 1 },
    ],
  },
];

const adminOrders = [...mockOrders];

export const handlers = [
  http.get(`${BASE_URL}/v1/products`, () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: mockProducts,
      message: "상품 조회 완료",
    });
  }),

  http.get(`${BASE_URL}/v1/products/:productId`, ({ params }) => {
    const id = Number(params.productId);
    const detail = mockProductDetails[id] ?? {
      productImage: mockProducts.items[0].productImage,
      detail: "커피 상세 정보입니다.",
    };
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: detail,
      message: "개별 상품 상세내용 조회 완료",
    });
  }),

  http.post(`${BASE_URL}/v1/orders`, () => {
    return HttpResponse.json(
      {
        statusCode: 201,
        resultType: "SUCCESS",
        data: { orderNumber: 20260101001 },
        message: "결제 요청이 성공했습니다.",
      },
      { status: 201 }
    );
  }),

  http.post(`${BASE_URL}/v1/orders/search`, async ({ request }) => {
    const { email, page = 0, size = 5 } = await request.json() as { email: string; page?: number; size?: number };
    const filtered = mockOrders.filter((o) => o.email === email);
    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const orders = filtered.slice(page * size, (page + 1) * size);
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: { orders, totalElements, totalPages },
      message: "사용자 주문 전체 조회 성공",
    });
  }),

  http.patch(`${BASE_URL}/v1/orders/items`, () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: { orders: mockOrders },
      message: "주문 수량이 변경되었습니다.",
    });
  }),

  http.delete(`${BASE_URL}/v1/orders/:orderId`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${BASE_URL}/v1/admin/verify-email`, () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: null,
      message: "인증 및 조회 성공",
    });
  }),

  http.get(`${BASE_URL}/v1/admin/orders`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const sort = url.searchParams.get("sort") ?? "createdAt";
    const postStatus = url.searchParams.get("postStatus");
    const email = url.searchParams.get("email");
    const orderNumber = url.searchParams.get("orderNumber");

    let filtered = [...adminOrders];
    if (postStatus) filtered = filtered.filter((o) => o.postStatus.toLowerCase() === postStatus);
    if (email) filtered = filtered.filter((o) => (o.email ?? "").includes(email));
    if (orderNumber) filtered = filtered.filter((o) => String(o.orderNumber).includes(orderNumber));

    if (sort === "orderNumber") {
      filtered.sort((a, b) => b.orderNumber - a.orderNumber);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const orders = filtered.slice(page * size, (page + 1) * size);

    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: { orders, totalElements, totalPages },
      message: "조회 성공",
    });
  }),

  http.patch(`${BASE_URL}/v1/admin/orders/status`, () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: null,
      message: "발송 처리 완료",
    });
  }),
];
