"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function AdminOrderTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState(() => searchParams.get("sortBy") ?? "createdAt");
  const [sortDir, setSortDir] = useState(() => searchParams.get("sort") ?? "desc");
  const [postStatus, setPostStatus] = useState(() => searchParams.get("postStatus") ?? "");
  const [searchType, setSearchType] = useState<"email" | "orderNumber">(() =>
    searchParams.get("orderNumber") ? "orderNumber" : "email"
  );
  const [keyword, setKeyword] = useState(() => searchParams.get("email") ?? searchParams.get("orderNumber") ?? "");
  const [searchInput, setSearchInput] = useState(() => searchParams.get("email") ?? searchParams.get("orderNumber") ?? "");
  const [page, setPage] = useState(() => Number(searchParams.get("page") ?? "1"));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResult, setModalResult] = useState<"none" | "success" | "failure">("success");

  const fetchOrders = useCallback(async () => {
    const params: Parameters<typeof getAdminOrders>[0] = {
      page: page - 1,
      size: 10,
      sort: sortDir,
      sortBy,
    };
    if (postStatus) params.postStatus = postStatus;
    const trimmed = keyword.trim();
    if (trimmed) {
      if (searchType === "email") params.email = trimmed;
      else params.orderNumber = trimmed;
    }
    const data = await getAdminOrders(params);
    setOrders(data.orders);
    setTotalElements(data.totalElements);
    setTotalPages(data.totalPages ?? data.orders.length);
  }, [page, sortBy, sortDir, postStatus, keyword, searchType]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sort", sortDir);
    params.set("sortBy", sortBy);
    if (postStatus) params.set("postStatus", postStatus);
    if (keyword) {
      if (searchType === "email") params.set("email", keyword.trim());
      else params.set("orderNumber", keyword.trim());
    }
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    router.replace(`/admin/orders${query ? `?${query}` : ""}`);
  }, [sortBy, sortDir, postStatus, keyword, searchType, page, router]);

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
    if (modalResult === "success") {
      fetchOrders();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 py-4">
        <div className="flex border rounded-lg bg-white overflow-hidden">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border-r bg-white focus:outline-none"
          >
            <option value="createdAt">주문일</option>
            <option value="orderNumber">주문번호</option>
          </select>
          <select
            value={sortDir}
            onChange={(e) => { setSortDir(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm bg-white focus:outline-none"
          >
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>
        <select
          value={postStatus}
          onChange={(e) => { setPostStatus(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">발송여부</option>
          <option value="ready">발송 전</option>
          <option value="shipped">발송완료</option>
          <option value="cancelled">취소완료</option>
        </select>
        <div className="flex-1 flex justify-end gap-2">
          <div className="flex border rounded-lg bg-white overflow-hidden">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "email" | "orderNumber")}
              className="px-2 py-2 text-sm border-r bg-white focus:outline-none"
            >
              <option value="email">이메일</option>
              <option value="orderNumber">주문번호</option>
            </select>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { setKeyword(searchInput); setPage(1); }
              }}
              placeholder="이메일 또는 주문번호"
              className="px-3 py-2 text-sm w-56 focus:outline-none"
            />
          </div>
          <button
            onClick={() => { setKeyword(searchInput); setPage(1); }}
            className="border rounded-lg px-4 py-2 text-sm bg-white hover:bg-accent"
          >
            검색
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-white rounded-lg">
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
              <th className="p-2 whitespace-nowrap">주문일</th>
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
