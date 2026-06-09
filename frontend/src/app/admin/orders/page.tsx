"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminOrderTable from "@/components/admin/AdminOrderTable";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminEmail");
    if (!stored) {
      router.replace("/admin/verify-email");
    } else {
      setEmail(stored);
    }
  }, [router]);

  if (!email) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <h1 className="text-lg font-semibold">Grid &amp; Circle 관리자 페이지</h1>
        <span className="text-sm text-muted-foreground">{email} 님</span>
      </div>
      <div className="px-8 py-2 flex-1">
        <Suspense>
          <AdminOrderTable />
        </Suspense>
      </div>
    </div>
  );
}
