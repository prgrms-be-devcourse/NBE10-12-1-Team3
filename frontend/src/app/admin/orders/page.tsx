"use client";

import { useState, useEffect } from "react";
import AdminOrderTable from "@/components/admin/AdminOrderTable";
import { ADMIN_EMAIL } from "@/lib/constants";

export default function AdminOrdersPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminEmail");
    if (stored) setEmail(stored);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <h1 className="text-lg font-semibold">Grid &amp; Circle 관리자 페이지</h1>
        <span className="text-sm text-muted-foreground">{email} 님</span>
      </div>
      <div className="px-8 py-2 flex-1">
        <AdminOrderTable />
      </div>
    </div>
  );
}
