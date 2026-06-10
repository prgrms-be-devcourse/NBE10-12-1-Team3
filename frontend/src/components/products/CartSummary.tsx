"use client";

import type { Product, CartItem } from "@/app/products/page";
import ProductQuickView from "./ProductQuickView";
import { STRING_B } from "@/lib/constants";

interface Props {
  cart: CartItem[];
  totalPrice: number;
  hoveredProduct: Product | null;
  onProceed: () => void;
}

export default function CartSummary({
  cart,
  totalPrice,
  hoveredProduct,
  onProceed,
}: Props) {
  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">Cart</h2>
      <hr className="mb-4" />
      {hoveredProduct ? (
        <div className="flex-1 overflow-hidden">
          <ProductQuickView productId={hoveredProduct.productId} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {cart.map((item) => (
            <div
              key={item.product.productId}
              className="flex justify-between text-sm"
            >
              <span>{item.product.productName}</span>
              <span>{item.quantity}개</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t shrink-0">
        <p className="text-xs text-muted-foreground mb-3">{STRING_B}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">총 금액</span>
          <span className="font-semibold">{totalPrice.toLocaleString()}원</span>
        </div>
        <button
          onClick={onProceed}
          disabled={cart.length === 0}
          className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40"
        >
          선택완료
        </button>
      </div>
    </div>
  );
}
