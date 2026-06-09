"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  STRING_SHIPPING_NONE,
  STRING_SHIPPING_SUCCESS,
  STRING_SHIPPING_FAIL_TITLE,
  STRING_SHIPPING_FAIL_DESC,
} from "@/lib/constants";

interface Props {
  open: boolean;
  result: "none" | "success" | "failure";
  onClose: () => void;
}

export default function ShippingResultModal({ open, result, onClose }: Props) {
  const bgColor =
    result === "success"
      ? "rgba(254, 240, 138, 0.8)"
      : result === "failure"
      ? "rgba(254, 202, 202, 0.8)"
      : "rgba(229, 231, 235, 0.9)";

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 rounded-xl p-10 shadow-xl focus:outline-none"
          style={{ backgroundColor: bgColor }}
        >
          {result === "success" ? (
            <p className="text-center text-lg font-medium">{STRING_SHIPPING_SUCCESS}</p>
          ) : result === "failure" ? (
            <>
              <p className="text-center text-xl font-bold mb-2">{STRING_SHIPPING_FAIL_TITLE}</p>
              <p className="text-center text-sm text-gray-500">{STRING_SHIPPING_FAIL_DESC}</p>
            </>
          ) : (
            <p className="text-center text-lg font-medium">{STRING_SHIPPING_NONE}</p>
          )}
          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-2 rounded-lg border bg-white/70 hover:bg-white text-sm font-medium transition-colors"
            >
              돌아가기
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
