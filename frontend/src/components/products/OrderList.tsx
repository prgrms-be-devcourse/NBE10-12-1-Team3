import type { CartItem } from "@/app/products/page";

interface Props {
  cart: CartItem[];
  onBack: () => void;
}

export default function OrderList({ cart, onBack }: Props) {
  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">상품 목록</h2>
        <button
          onClick={onBack}
          className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {cart.map((item) => (
          <div
            key={item.product.productId}
            className="flex items-center gap-3"
          >
            <img
              src={item.product.productImage}
              alt={item.product.productName}
              className="w-16 h-16 object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {item.product.productName}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.product.productPrice.toLocaleString()}원
              </p>
            </div>
            <span className="text-sm shrink-0">{item.quantity}개</span>
          </div>
        ))}
      </div>
    </div>
  );
}
