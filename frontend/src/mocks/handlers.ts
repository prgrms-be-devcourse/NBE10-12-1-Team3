import { http, HttpResponse } from "msw";
import { mockProducts, mockProductDetails } from "@/lib/mockProducts";

const mockOrders = [
  {
    orderId: 1,
    orderNumber: 20260601001,
    totalPrice: 33000,
    postStatus: "READY",
    createdAt: "2026-06-01T10:00:00",
    orderItems: [
      { productId: 1, productName: "Colombia Nariño", quantity: 1, price: 18000 },
      { productId: 2, productName: "Brazil Serra do Caparaó", quantity: 1, price: 15000 },
    ],
  },
  {
    orderId: 2,
    orderNumber: 20260603001,
    totalPrice: 32000,
    postStatus: "SHIPPED",
    createdAt: "2026-06-03T14:30:00",
    orderItems: [
      { productId: 3, productName: "Ethiopia Gesha Village", quantity: 1, price: 32000 },
    ],
  },
  {
    orderId: 3,
    orderNumber: 20260605001,
    totalPrice: 48000,
    postStatus: "READY",
    createdAt: "2026-06-05T09:15:00",
    orderItems: [
      { productId: 4, productName: "Jamaica Blue Mountain No.1", quantity: 1, price: 48000 },
    ],
  },
];

const adminOrders = [
  ...mockOrders,
  {
    orderId: 4,
    orderNumber: 20260606001,
    totalPrice: 63000,
    postStatus: "SHIPPED",
    createdAt: "2026-06-06T11:00:00",
    orderItems: [
      { productId: 1, productName: "Colombia Nariño", quantity: 2, price: 36000 },
      { productId: 2, productName: "Brazil Serra do Caparaó", quantity: 1, price: 15000 },
      { productId: 3, productName: "Ethiopia Gesha Village", quantity: 1 - 1, price: 0 },
    ],
  },
  {
    orderId: 5,
    orderNumber: 20260607001,
    totalPrice: 15000,
    postStatus: "CANCELLED",
    createdAt: "2026-06-07T16:45:00",
    orderItems: [
      { productId: 2, productName: "Brazil Serra do Caparaó", quantity: 1, price: 15000 },
    ],
  },
];

export const handlers = [
  http.get("/v1/products", () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: mockProducts,
      message: "상품 조회 완료",
    });
  }),

  http.get("/v1/products/:productId", ({ params }) => {
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

  http.post("/v1/orders", () => {
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

  http.post("/v1/orders/search", () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: { orders: mockOrders },
      message: "사용자 주문 전체 조회 성공",
    });
  }),

  http.patch("/v1/orders/items", () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: { orders: mockOrders },
      message: "주문 수량이 변경되었습니다.",
    });
  }),

  http.delete("/v1/orders/:orderId", () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/v1/admin/verify-email", () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: null,
      message: "인증 및 조회 성공",
    });
  }),

  http.get("/v1/admin/orders", () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: { orders: adminOrders },
      message: "조회 성공",
    });
  }),

  http.patch("/v1/admin/orders/status", () => {
    return HttpResponse.json({
      statusCode: 200,
      resultType: "SUCCESS",
      data: null,
      message: "발송 처리 완료",
    });
  }),
];
