import { Suspense } from "react";
import OrderCompleteCard from "@/components/orders/OrderCompleteCard";

export default function OrderCompletePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Suspense>
          <OrderCompleteCard />
        </Suspense>
      </div>
    </div>
  );
}
