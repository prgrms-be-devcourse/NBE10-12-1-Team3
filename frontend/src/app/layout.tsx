import type { Metadata } from "next";
import "./globals.css";
import MSWProvider from "@/components/MSWProvider";

export const metadata: Metadata = {
  title: "Store",
  description: "Online Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}
