"use client";

import { useState } from "react";
import type { AdminOrder } from "@/lib/api";
import { BADGE_COLORS, PRODUCT_NAMES } from "@/lib/constants";

export interface ItemChangeRecord {
  orderId: number;
  orderItemId: number;
  itemId: number;
  quantity: number;
}

interface Props {
  orders: AdminOrder[];
  onSelectionChange?: (orderId: number | null) => void;
  onItemChange?: (changes: ItemChangeRecord[]) => void;
}

const STATUS_LABEL: Record<string, string> = {
  // enum names (admin mock)
  READY: "발송전",
  DELIVERED: "발송완료",
  CANCELLED: "취소됨",
  // descriptions (user search API)
  "발송 전": "발송전",
  "발송 완료": "발송완료",
  "발송 취소": "취소됨",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function OrderTable({ orders, onSelectionChange, onItemChange }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [localQty, setLocalQty] = useState<Record<string, number>>({});
  const [changesMap, setChangesMap] = useState<Record<string, ItemChangeRecord>>({});

  function getQty(orderId: number, itemId: number, original: number) {
    const key = `${orderId}-${itemId}`;
    return key in localQty ? localQty[key] : original;
  }

  function handleSelect(orderId: number) {
    const next = selectedId === orderId ? null : orderId;
    setSelectedId(next);
    onSelectionChange?.(next);
  }

  function handleQtyChange(
    orderId: number,
    orderItemId: number,
    itemId: number,
    originalQty: number,
    delta: number
  ) {
    const key = `${orderId}-${itemId}`;
    const next = Math.max(0, getQty(orderId, itemId, originalQty) + delta);
    const nextLocalQty = { ...localQty, [key]: next };
    const nextChanges = { ...changesMap };
    if (next === originalQty) {
      delete nextChanges[key];
    } else {
      nextChanges[key] = { orderId, orderItemId, itemId, quantity: next };
    }
    setLocalQty(nextLocalQty);
    setChangesMap(nextChanges);
    onItemChange?.(Object.values(nextChanges));
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg">
      <table className="w-full text-sm">
        <thead>
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
              onClick={() => handleSelect(order.orderId)}
              className={`border-b border-l-2 cursor-pointer transition-colors ${
                selectedId === order.orderId
                  ? "border-l-black bg-neutral-100"
                  : "border-l-transparent hover:bg-muted/40"
              }`}
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
                const qty = orderItem
                  ? getQty(order.orderId, itemId, orderItem.quantity)
                  : null;
                const changed =
                  orderItem && `${order.orderId}-${itemId}` in changesMap;
                return (
                  <td
                    key={itemId}
                    onClick={(e) => e.stopPropagation()}
                    className={`p-2 text-center transition-all ${
                      changed ? "font-bold bg-yellow-50 ring-1 ring-yellow-300" : ""
                    }`}
                  >
                    {orderItem ? (
                      <div className="flex items-center justify-center gap-1">
                        {STATUS_LABEL[order.postStatus] === "발송전" && (
                          <button
                            onClick={() =>
                              handleQtyChange(
                                order.orderId,
                                orderItem.orderItemId,
                                itemId,
                                orderItem.quantity,
                                -1
                              )
                            }
                            className="w-5 h-5 rounded text-xs border hover:bg-muted leading-none"
                          >
                            -
                          </button>
                        )}
                        <span className="min-w-[1.5rem] text-center">{qty}</span>
                        {STATUS_LABEL[order.postStatus] === "발송전" && (
                          <button
                            onClick={() =>
                              handleQtyChange(
                                order.orderId,
                                orderItem.orderItemId,
                                itemId,
                                orderItem.quantity,
                                1
                              )
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
              <td className="p-2 text-right">
                {order.totalPrice.toLocaleString()}원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
