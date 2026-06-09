"use client";

import type { Product, CartItem } from "@/app/products/page";
import { STRING_A } from "@/lib/constants";

interface Props {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onQuantityChange: (product: Product, quantity: number) => void;
  onHover: (product: Product | null) => void;
}

export default function ProductGrid({
  products,
  cart,
  onAddToCart,
  onQuantityChange,
  onHover,
}: Props) {
  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">상품 목록</h2>
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto">
        {products.map((product) => {
          const cartItem = cart.find(
            (i) => i.product.productId === product.productId
          );
          const inCart = !!cartItem;
          return (
            <div
              key={product.productId}
              onClick={() => onAddToCart(product)}
              onMouseEnter={() => onHover(product)}
              onMouseLeave={() => onHover(null)}
              className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                inCart ? "border-blue-500 ring-1 ring-blue-500" : "border-border"
              }`}
            >
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-full aspect-square object-cover rounded-lg mb-2"
              />
              <p className="text-sm font-medium">{product.productName}</p>
              <div className="flex items-center justify-between mt-1">
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      onQuantityChange(product, (cartItem?.quantity ?? 1) - 1)
                    }
                    className="w-5 h-5 rounded border text-xs hover:bg-muted"
                  >
                    -
                  </button>
                  <span className="text-xs min-w-[1rem] text-center">
                    {cartItem?.quantity ?? 0}
                  </span>
                  <button
                    onClick={() =>
                      onQuantityChange(product, (cartItem?.quantity ?? 0) + 1)
                    }
                    className="w-5 h-5 rounded border text-xs hover:bg-muted"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm">
                  {product.productPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{STRING_A}</p>
    </div>
  );
}
