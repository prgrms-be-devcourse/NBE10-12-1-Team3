"use client";

import { useState, useEffect } from "react";

const isMockEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_USE_MOCK === "true";

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!isMockEnabled);

  useEffect(() => {
    if (!isMockEnabled) return;
    import("../mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true));
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
