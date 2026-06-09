"use client";

import { useEffect, useState } from "react";
// TODO: API 연결 시 아래 주석 해제하고 mockProductDetails import 삭제
// import { getProductDetail } from "@/lib/api";
import { mockProductDetails } from "@/lib/mockProducts";

interface Props {
  productId: number;
}

export default function ProductQuickView({ productId }: Props) {
  const [detail, setDetail] = useState<{
    productImage: string;
    detail: string;
  } | null>(null);

  useEffect(() => {
    setDetail(null);
    // TODO: API 연결 시 아래 두 줄을 getProductDetail(productId).then(setDetail); 로 교체
    const mock = mockProductDetails[productId] ?? null;
    setDetail(mock);
  }, [productId]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {detail ? (
        <>
          <div className="px-4 pt-4">
            <img
              src={detail.productImage}
              alt=""
              className="w-full object-contain"
            />
          </div>
          <p className="p-4 text-sm text-muted-foreground">{detail.detail}</p>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          불러오는 중...
        </div>
      )}
    </div>
  );
}
