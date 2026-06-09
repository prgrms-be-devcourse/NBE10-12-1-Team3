"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainCard from "@/components/common/MainCard";
import StoreHeader from "@/components/common/StoreHeader";
import ProductGrid from "@/components/products/ProductGrid";
import CartSummary from "@/components/products/CartSummary";
import OrderList from "@/components/products/OrderList";
import CheckoutForm from "@/components/products/CheckoutForm";
import { /* getProducts, postOrder */ } from "@/lib/api"; // TODO: API 연결 시 getProducts, postOrder 주석 해제
import { mockProducts } from "@/lib/mockProducts";

export interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = "cart";

function loadCart(): CartItem[] {
  try {
    return JSON.parse(sessionStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function ProductsPage() {
  const router = useRouter();
  const [step, setStep] = useState<"step1" | "step2">("step1");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);

  useEffect(() => {
    setCart(loadCart());
    // TODO: API 연결 시 아래 주석 해제하고 mockProducts 줄 삭제
    // getProducts().then((data) => setProducts(data.items));
    setProducts(mockProducts.items);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (cart.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [cart.length]);

  function updateCart(product: Product, quantity: number) {
    setCart((prev) => {
      if (quantity <= 0)
        return prev.filter((i) => i.product.productId !== product.productId);
      const exists = prev.some((i) => i.product.productId === product.productId);
      if (exists)
        return prev.map((i) =>
          i.product.productId === product.productId ? { ...i, quantity } : i
        );
      return [...prev, { product, quantity }];
    });
  }

  function addToCart(product: Product) {
    if (!cart.some((i) => i.product.productId === product.productId)) {
      updateCart(product, 1);
    }
  }

  const totalPrice = cart.reduce(
    (sum, i) => sum + i.product.productPrice * i.quantity,
    0
  );

  async function handleCheckout(info: {
    email: string;
    address: string;
    postalAddress: string;
  }) {
    // TODO: API 연결 시 아래 주석 해제하고 mock result 줄 삭제
    // const result = await postOrder({
    //   info,
    //   orders: cart.map((i) => ({
    //     productId: i.product.productId,
    //     quantity: i.quantity,
    //   })),
    //   totalPrice,
    // });
    const result = { orderNumber: Date.now() };
    sessionStorage.removeItem(CART_KEY);
    setCart([]);
    router.push(`/orders/complete?orderNumber=${result.orderNumber}`);
  }

  return (
    <div className="min-h-screen p-6">
      <StoreHeader />
      <div className="relative max-w-5xl mx-auto">
        {step === "step1" && (
          <div className="absolute right-0 -top-8">
            <Link
              href="/orders"
              className="text-sm text-muted-foreground hover:underline"
            >
              비회원 주문조회
            </Link>
          </div>
        )}
        <MainCard
          left={
            step === "step1" ? (
              <ProductGrid
                products={products}
                cart={cart}
                onAddToCart={addToCart}
                onQuantityChange={updateCart}
                onHover={setHoveredProduct}
              />
            ) : (
              <OrderList cart={cart} onBack={() => setStep("step1")} />
            )
          }
          right={
            step === "step1" ? (
              <CartSummary
                cart={cart}
                totalPrice={totalPrice}
                hoveredProduct={hoveredProduct}
                onProceed={() => setStep("step2")}
              />
            ) : (
              <CheckoutForm
                cart={cart}
                totalPrice={totalPrice}
                onCheckout={handleCheckout}
              />
            )
          }
        />
      </div>
    </div>
  );
}
