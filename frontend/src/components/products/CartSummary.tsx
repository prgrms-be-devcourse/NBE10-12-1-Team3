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
      {hoveredProduct ? (
        <div className="flex-1 overflow-hidden">
          <ProductQuickView productId={hoveredProduct.productId} />
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-2">Cart</h2>
          <hr className="mb-4" />
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
        </>
      )}
      <div className="mt-4 pt-4 border-t shrink-0">
        <p className="text-xs text-muted-foreground mb-2">{STRING_B}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{totalPrice.toLocaleString()}원</span>
          <button
            onClick={onProceed}
            disabled={cart.length === 0}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-40"
          >
            선택완료
          </button>
        </div>
      </div>
    </div>
  );
}
