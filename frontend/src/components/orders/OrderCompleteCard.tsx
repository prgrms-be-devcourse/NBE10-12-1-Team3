"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { STRING_ORDER_COMPLETE } from "@/lib/constants";

export default function OrderCompleteCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const num = searchParams.get("orderNumber");
    if (!num) {
      router.replace("/products");
      return;
    }
    setOrderNumber(num);
    router.replace("/orders/complete");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!orderNumber) return null;

  return (
    <div className="rounded-2xl shadow-lg flex items-center justify-center py-24 px-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-xl font-semibold">{STRING_ORDER_COMPLETE}</p>
        <p className="text-muted-foreground">주문번호: {orderNumber}</p>
        <button
          onClick={() => router.push("/products")}
          className="mt-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}
