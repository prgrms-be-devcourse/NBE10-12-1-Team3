"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postAdminVerifyEmail } from "@/lib/api";
import { STRING_ADMIN_INVALID_EMAIL, STRING_ADMIN_NO_ACCOUNT } from "@/lib/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminVerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setApiError("");

    if (!EMAIL_RE.test(email)) {
      setEmailError(STRING_ADMIN_INVALID_EMAIL);
      return;
    }

    try {
      await postAdminVerifyEmail(email);
      sessionStorage.setItem("adminEmail", email);
      router.push("/admin/orders");
    } catch {
      setApiError(STRING_ADMIN_NO_ACCOUNT);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6 text-center">관리자 인증</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-500">{emailError}</p>
            )}
            {apiError && (
              <p className="mt-1 text-xs text-red-500">{apiError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
          >
            접속
          </button>
        </form>
      </div>
    </main>
  );
}
