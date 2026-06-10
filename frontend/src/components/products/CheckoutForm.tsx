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
    postalCode: string;
  }) => Promise<void>;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function CheckoutForm({ cart, totalPrice, onCheckout }: Props) {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalAddress] = useState("");
  const [touched, setTouched] = useState({ email: false, address: false, postalCode: false });
  const [loading, setLoading] = useState(false);

  const emailError = touched.email && email.length > 0 && !isValidEmail(email)
    ? "이메일 형식이 올바르지 않습니다." : "";
  const addressError = touched.address && address.length === 0
    ? "주소를 입력해주세요." : "";
  const postalError = touched.postalCode && postalCode.length > 0 && !/^\d{5}$/.test(postalCode)
    ? "숫자 5자리로 입력해주세요." : "";

  const isValid =
    isValidEmail(email) &&
    address.length > 0 &&
    /^\d{5}$/.test(postalCode);

  function blur(field: keyof typeof touched) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await onCheckout({ email, address, postalCode });
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
  const inputError = "border-red-400 focus:ring-red-400";

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
      <div className="flex-1 space-y-1">
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => blur("email")}
            className={`${inputBase} ${emailError ? inputError : ""}`}
          />
          {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="주소"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => blur("address")}
            className={`${inputBase} ${addressError ? inputError : ""}`}
          />
          {addressError && <p className="mt-1 text-xs text-red-500">{addressError}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="우편번호"
            value={postalCode}
            onChange={(e) => setPostalAddress(e.target.value)}
            onBlur={() => blur("postalCode")}
            className={`${inputBase} ${postalError ? inputError : ""}`}
          />
          {postalError && <p className="mt-1 text-xs text-red-500">{postalError}</p>}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t shrink-0">
        <p className="text-xs text-muted-foreground mb-3">{STRING_B}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">총 금액</span>
          <span className="font-semibold">{totalPrice.toLocaleString()}원</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40"
        >
          {loading ? "처리중..." : "결제하기"}
        </button>
      </div>
    </div>
  );
}
