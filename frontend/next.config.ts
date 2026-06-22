import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.100.6'],
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react']
  }
};

export default nextConfig;
