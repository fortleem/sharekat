import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDocumentPreloading: true,
  },
};

export default nextConfig;
