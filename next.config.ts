import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/voice",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
