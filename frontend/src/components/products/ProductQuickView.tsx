"use client";

import { useEffect, useState } from "react";
import { getProductDetail } from "@/lib/api";

interface Props {
  productId: number;
}

export default function ProductQuickView({ productId }: Props) {
  const [detail, setDetail] = useState<{
    productImage: string;
    detail: string;
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setDetail(null);
    setError(false);
    getProductDetail(productId).then(setDetail).catch(() => setError(true));
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
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          상세 정보를 불러올 수 없습니다.
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          불러오는 중...
        </div>
      )}
    </div>
  );
}
