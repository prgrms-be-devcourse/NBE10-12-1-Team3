"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminOrders, patchAdminOrderStatus, type AdminOrder } from "@/lib/api";
import { BADGE_COLORS, PRODUCT_NAMES } from "@/lib/constants";
import Pagination from "@/components/common/Pagination";
import ShippingResultModal from "./ShippingResultModal";

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

function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

export default function AdminOrderTable() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("desc");
  const [postStatus, setPostStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResult, setModalResult] = useState<"none" | "success" | "failure">("success");

  const fetchOrders = useCallback(async () => {
    const params: Parameters<typeof getAdminOrders>[0] = {
      page: page - 1,
      size: 10,
      sort,
    };
    if (postStatus) params.postStatus = postStatus;
    const trimmed = keyword.trim();
    if (trimmed) {
      if (isEmail(trimmed)) params.email = trimmed;
      else params.orderNumber = trimmed;
    }
    const data = await getAdminOrders(params);
    setOrders(data.orders);
    setTotalElements(data.totalElements);
    setTotalPages(data.totalPages);
  }, [page, sort, postStatus, keyword]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const totalByItem: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const order of orders) {
    for (const item of order.orderItems) {
      if (item.itemId in totalByItem) totalByItem[item.itemId] += item.quantity;
    }
  }

  async function handleShipping() {
    try {
      await patchAdminOrderStatus();
      setModalResult("success");
    } catch {
      setModalResult("failure");
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
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
        <select
          value={postStatus}
          onChange={(e) => { setPostStatus(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">발송여부별</option>
          <option value="ready">READY</option>
          <option value="shipped">SHIPPED</option>
          <option value="cancelled">CANCELLED</option>
        </select>
        <div className="flex-1 flex justify-end gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { setKeyword(searchInput); setPage(1); }
            }}
            placeholder="검색어"
            className="border rounded-lg px-3 py-2 text-sm w-56"
          />
          <button
            onClick={() => { setKeyword(searchInput); setPage(1); }}
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
                총 주문 {totalElements}건
              </th>
              {[1, 2, 3, 4].map((itemId, i) => (
                <th key={itemId} className="p-2 text-center font-medium">
                  {PRODUCT_NAMES[i]}: {totalByItem[itemId]}개
                </th>
              ))}
              <th className="p-2" />
            </tr>
            <tr className="border-b text-left text-muted-foreground">
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
            {orders.map((order) => (
              <tr
                key={order.orderId}
                className="border-b hover:bg-muted/40 transition-colors"
              >
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
                  return (
                    <td key={itemId} className="p-2 text-center">
                      {orderItem ? orderItem.quantity : <span className="text-muted-foreground">-</span>}
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
            onClick={handleShipping}
            className="px-4 py-2 rounded-lg bg-amber-400 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
          >
            발송처리
          </button>
        </div>
      </div>

      <ShippingResultModal
        open={modalOpen}
        result={modalResult}
        onClose={handleModalClose}
      />
    </div>
  );
}
