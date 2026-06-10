import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/verify-email",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
