"use client";

import { useState, useEffect, useCallback } from "react";
import { /* getAdminOrders, */ patchAdminOrderStatus, type AdminOrder } from "@/lib/api"; // TODO: API 연결 시 getAdminOrders 주석 해제

// TODO: API 연결 시 아래 mockOrders 블록 전체 삭제
const mockOrders: AdminOrder[] = [
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
import { BADGE_COLORS, PRODUCT_NAMES } from "@/lib/constants";
import Pagination from "@/components/common/Pagination";
import ShippingResultModal from "./ShippingResultModal";

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<string, string> = {
  READY: "발송전",
  SHIPPED: "발송완료",
  CANCELLED: "취소됨",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function AdminOrderTable() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [sort, setSort] = useState("createdAt");
  const [postStatus, setPostStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [localQty, setLocalQty] = useState<Record<string, number>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const fetchOrders = useCallback(async () => {
    // TODO: API 연결 시 아래 5줄 주석 해제하고 mockOrders 줄 삭제
    // const params: { sort?: string; postStatus?: string; keyword?: string } = { sort };
    // if (postStatus) params.postStatus = postStatus;
    // if (keyword) params.keyword = keyword;
    // const data = await getAdminOrders(params);
    // setOrders(data.orders);
    setOrders(mockOrders);
    setPage(1);
    setSelectedId(null);
    setLocalQty({});
  }, [sort, postStatus, keyword]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pageOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalByItem: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const order of orders) {
    for (const item of order.orderItems) {
      if (item.itemId in totalByItem) totalByItem[item.itemId] += item.quantity;
    }
  }

  function getQty(orderId: number, itemId: number, original: number) {
    const key = `${orderId}-${itemId}`;
    return key in localQty ? localQty[key] : original;
  }

  function handleQtyChange(orderId: number, itemId: number, original: number, delta: number) {
    const key = `${orderId}-${itemId}`;
    const next = Math.max(0, getQty(orderId, itemId, original) + delta);
    setLocalQty((prev) => ({ ...prev, [key]: next }));
  }

  async function handleShipping() {
    try {
      await patchAdminOrderStatus();
      setModalSuccess(true);
    } catch {
      setModalSuccess(false);
    }
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    fetchOrders();
  }

  return (
    <div>
      <div className="flex items-center gap-3 py-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="createdAt">정렬: 날짜</option>
          <option value="orderNumber">정렬: 주문번호</option>
        </select>
        <select
          value={postStatus}
          onChange={(e) => setPostStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">발송여부별</option>
          <option value="READY">READY</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <div className="flex-1 flex justify-end gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") setKeyword(searchInput); }}
            placeholder="검색어"
            className="border rounded-lg px-3 py-2 text-sm w-56"
          />
          <button
            onClick={() => setKeyword(searchInput)}
            className="border rounded-lg px-4 py-2 text-sm hover:bg-accent"
          >
            검색
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-amber-50 border-b">
              <th colSpan={5} className="p-2 text-left font-medium">
                총 주문 {orders.length}건
              </th>
              {[1, 2, 3, 4].map((itemId, i) => (
                <th key={itemId} className="p-2 text-center font-medium">
                  {PRODUCT_NAMES[i]}: {totalByItem[itemId]}개
                </th>
              ))}
              <th className="p-2" />
            </tr>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-2 w-8" />
              <th className="p-2">발송여부</th>
              <th className="p-2">주문번호</th>
              <th className="p-2 whitespace-nowrap">날짜</th>
              <th className="p-2">주문자</th>
              {PRODUCT_NAMES.map((name) => (
                <th key={name} className="p-2 text-center">{name}</th>
              ))}
              <th className="p-2 text-right">총금액</th>
            </tr>
          </thead>
          <tbody>
            {pageOrders.map((order) => (
              <tr
                key={order.orderId}
                className={`border-b hover:bg-muted/40 transition-colors ${
                  selectedId === order.orderId ? "bg-muted/60" : ""
                }`}
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedId === order.orderId}
                    onChange={() =>
                      setSelectedId(selectedId === order.orderId ? null : order.orderId)
                    }
                  />
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs text-white ${
                      BADGE_COLORS[STATUS_LABEL[order.postStatus]] ?? "bg-gray-400"
                    }`}
                  >
                    {STATUS_LABEL[order.postStatus] ?? order.postStatus}
                  </span>
                </td>
                <td className="p-2">{order.orderNumber}</td>
                <td className="p-2 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                <td className="p-2">{order.email}</td>
                {[1, 2, 3, 4].map((itemId) => {
                  const orderItem = order.orderItems.find((i) => i.itemId === itemId);
                  const qty = orderItem
                    ? getQty(order.orderId, itemId, orderItem.quantity)
                    : null;
                  const changed = orderItem && `${order.orderId}-${itemId}` in localQty;
                  return (
                    <td
                      key={itemId}
                      className={`p-2 text-center transition-all ${
                        changed ? "font-bold bg-yellow-50 ring-1 ring-yellow-300" : ""
                      }`}
                    >
                      {orderItem ? (
                        <div className="flex items-center justify-center gap-1">
                          {order.postStatus === "READY" && (
                            <button
                              onClick={() =>
                                handleQtyChange(order.orderId, itemId, orderItem.quantity, -1)
                              }
                              className="w-5 h-5 rounded text-xs border hover:bg-muted leading-none"
                            >
                              -
                            </button>
                          )}
                          <span className="min-w-[1.5rem] text-center">{qty}</span>
                          {order.postStatus === "READY" && (
                            <button
                              onClick={() =>
                                handleQtyChange(order.orderId, itemId, orderItem.quantity, 1)
                              }
                              className="w-5 h-5 rounded text-xs border hover:bg-muted leading-none"
                            >
                              +
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="p-2 text-right">{order.totalPrice.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center py-4">
        <div className="flex-1" />
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
        <div className="flex-1 flex justify-end">
          <button
            disabled={selectedId === null}
            onClick={handleShipping}
            className="px-4 py-2 rounded-lg bg-amber-400 text-white text-sm font-medium hover:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            발송처리
          </button>
        </div>
      </div>

      <ShippingResultModal
        open={modalOpen}
        success={modalSuccess}
        onClose={handleModalClose}
      />
    </div>
  );
}
