"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import OrderTable, { ItemChangeRecord } from "@/components/common/OrderTable";
import Pagination from "@/components/common/Pagination";
import {
  searchOrders,
  deleteOrder,
  patchOrderItems,
  type Order,
  type AdminOrder,
} from "@/lib/api";
import {
  STRING_ORDERS_BEFORE_SEARCH,
  STRING_ORDERS_NO_RESULT,
  STRING_INVALID_EMAIL,
  STRING_DELETE_CONFIRM,
  STRING_ALREADY_SHIPPED,
} from "@/lib/constants";

const PAGE_SIZE = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toAdminOrder(order: Order): AdminOrder {
  return { ...order, deletedAt: null };
}

type SearchState = "idle" | "empty" | "results";

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [itemChanges, setItemChanges] = useState<ItemChangeRecord[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shippedOpen, setShippedOpen] = useState(false);
  const [patchSuccessOpen, setPatchSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchOrders(targetPage: number) {
    const data = await searchOrders(email, targetPage - 1, PAGE_SIZE);
    setOrders(data.orders);
    setTotalPages(data.totalPages);
    setSearchState(data.orders.length > 0 ? "results" : "empty");
  }

  async function handleSearch() {
    if (!EMAIL_RE.test(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setLoading(true);
    try {
      await fetchOrders(1);
      setPage(1);
      setSelectedOrderId(null);
      setItemChanges([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedOrderId) return;
    await deleteOrder(selectedOrderId);
    setSelectedOrderId(null);
    setItemChanges([]);
    setDeleteOpen(false);
    await fetchOrders(page);
  }

  async function handlePatch() {
    const grouped: Record<number, ItemChangeRecord[]> = {};
    for (const c of itemChanges) {
      if (!grouped[c.orderId]) grouped[c.orderId] = [];
      grouped[c.orderId].push(c);
    }
    try {
      await patchOrderItems({
        orders: Object.entries(grouped).map(([orderId, items]) => ({
          orderId: Number(orderId),
          orderItems: items.map(({ orderItemId, itemId, quantity }) => ({ orderItemId, itemId, quantity })),
        })),
      });
      setItemChanges([]);
      await fetchOrders(page);
      setPatchSuccessOpen(true);
    } catch {
      setShippedOpen(true);
    }
  }

  async function handlePageChange(newPage: number) {
    setPage(newPage);
    setSelectedOrderId(null);
    setItemChanges([]);
    await fetchOrders(newPage);
  }

  return (
    <div className="min-h-screen p-8 bg-stone-100">
      <h1 className="text-xl font-semibold mb-6">Grid & Circle 주문 조회</h1>

      <div className="mb-6">
        <div className="flex items-start gap-4">
          <label className="text-sm mt-1.5 whitespace-nowrap">사용자 이메일</label>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border rounded-md px-3 py-1.5 text-sm w-64 bg-white focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {emailError && (
              <p className="mt-1 text-sm text-destructive">{STRING_INVALID_EMAIL}</p>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            조회
          </button>
        </div>
      </div>

      {searchState === "idle" && (
        <p className="text-muted-foreground">{STRING_ORDERS_BEFORE_SEARCH}</p>
      )}
      {searchState === "empty" && (
        <p className="text-muted-foreground">{STRING_ORDERS_NO_RESULT}</p>
      )}
      {searchState === "results" && (
        <>
          <OrderTable
            key={page}
            orders={orders.map(toAdminOrder)}
            onSelectionChange={setSelectedOrderId}
            onItemChange={setItemChanges}
          />
          <div className="mt-4 relative flex items-center justify-center">
            <div className="absolute right-0 flex gap-2">
              <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
                <Dialog.Trigger asChild>
                  <button
                    disabled={!selectedOrderId}
                    className="px-4 py-1.5 rounded-md text-sm border bg-white hover:bg-accent disabled:opacity-40 disabled:pointer-events-none"
                  >
                    주문삭제
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-80 z-50">
                    <Dialog.Title className="text-base font-semibold mb-6">
                      {STRING_DELETE_CONFIRM}
                    </Dialog.Title>
                    <div className="flex justify-end gap-2">
                      <Dialog.Close asChild>
                        <button className="px-4 py-1.5 rounded-md text-sm border hover:bg-accent">
                          취소
                        </button>
                      </Dialog.Close>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-1.5 rounded-md text-sm bg-destructive text-destructive-foreground hover:opacity-90"
                      >
                        삭제
                      </button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <button
                disabled={itemChanges.length === 0}
                onClick={handlePatch}
                className="px-4 py-1.5 rounded-md text-sm border bg-white hover:bg-accent disabled:opacity-40 disabled:pointer-events-none"
              >
                주문수정
              </button>
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      <Dialog.Root open={patchSuccessOpen} onOpenChange={setPatchSuccessOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-80 z-50">
            <Dialog.Title className="text-base font-semibold mb-6">
              주문이 수정되었습니다.
            </Dialog.Title>
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-1.5 rounded-md text-sm border hover:bg-accent">
                  확인
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={shippedOpen} onOpenChange={setShippedOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-80 z-50">
            <Dialog.Title className="text-base font-semibold mb-6">
              {STRING_ALREADY_SHIPPED}
            </Dialog.Title>
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-1.5 rounded-md text-sm border hover:bg-accent">
                  확인
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
