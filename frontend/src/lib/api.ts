const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export interface OrderItem {
  orderItemId: number;
  itemId: number;
  quantity: number;
}

export interface Order {
  orderId: number;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  postStatus: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

export interface AdminOrder {
  orderId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  postStatus: string;
  orderNumber: number;
  email: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const text = await res.text();
  if (!text) return undefined as T;
  const json = JSON.parse(text);
  return (json?.data !== undefined ? json.data : json) as T;
}

export function getProducts(): Promise<{
  items: {
    productId: number;
    productName: string;
    productPrice: number;
    productImage: string;
  }[];
}> {
  return request("/v1/products");
}

export function getProductDetail(
  productId: number
): Promise<{ productImage: string; detail: string }> {
  return request(`/v1/products/${productId}`);
}

export function postOrder(body: {
  info: { email: string; address: string; postalAddress: string };
  orders: { productId: number; quantity: number }[];
  totalPrice: number;
}): Promise<{ orderNumber: number }> {
  return request("/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function searchOrders(
  email: string,
  page: number,
  size: number
): Promise<{ orders: Order[]; totalPages: number; totalElements: number }> {
  return request("/v1/orders/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, page, size }),
  });
}

export function patchOrderItems(body: {
  orders: {
    orderId: number;
    orderItems: OrderItem[];
  }[];
}): Promise<{ orders: Order[] }> {
  return request("/v1/orders/items", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function deleteOrder(orderId: number): Promise<void> {
  return request(`/v1/orders/${orderId}`, { method: "DELETE" });
}

export function postAdminVerifyEmail(email: string): Promise<void> {
  return request("/v1/admin/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export function getAdminOrders(params: {
  page: number;
  size: number;
  sort?: string;
  postStatus?: string;
  email?: string;
  orderNumber?: string;
}): Promise<{ orders: AdminOrder[]; totalElements: number; totalPages: number }> {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return request(`/v1/admin/orders${query ? "?" + query : ""}`);
}

export function patchAdminOrderStatus(): Promise<void> {
  return request("/v1/admin/orders/status", { method: "PATCH" });
}
