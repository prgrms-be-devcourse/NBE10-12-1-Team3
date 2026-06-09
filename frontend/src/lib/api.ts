const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  if (res.status === 204) return undefined as T;
  return res.json();
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

export function searchOrders(email: string): Promise<{ orders: Order[] }> {
  return request("/v1/orders/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
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

export function getAdminOrders(params?: {
  sort?: string;
  postStatus?: string;
  keyword?: string;
}): Promise<{ orders: AdminOrder[] }> {
  const query = params
    ? "?" + new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined)
        ) as Record<string, string>
      ).toString()
    : "";
  return request(`/v1/admin/orders${query}`);
}

export function patchAdminOrderStatus(): Promise<void> {
  return request("/v1/admin/orders/status", { method: "PATCH" });
}
