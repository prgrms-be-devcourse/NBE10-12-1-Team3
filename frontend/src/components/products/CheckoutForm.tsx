"use client";

import { useState } from "react";
import type { CartItem } from "@/app/products/page";
import { STRING_B } from "@/lib/constants";

interface Props {
  cart: CartItem[];
  totalPrice: number;
  onCheckout: (info: {
    email: string;
    address: string;
    postalAddress: string;
  }) => Promise<void>;
}

export default function CheckoutForm({ cart, totalPrice, onCheckout }: Props) {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await onCheckout({ email, address, postalAddress });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">Summary</h2>
      <hr className="mb-4" />
      <div className="space-y-1 mb-4">
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
      <div className="space-y-2 flex-1">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="우편번호"
          value={postalAddress}
          onChange={(e) => setPostalAddress(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="mt-4 pt-4 border-t shrink-0">
        <p className="text-xs text-muted-foreground mb-2">{STRING_B}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{totalPrice.toLocaleString()}원</span>
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !address || !postalAddress}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-40"
          >
            {loading ? "처리중..." : "결제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
