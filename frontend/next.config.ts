import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration minimale - le badge n'apparaîtra plus
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: process.env.NODE_ENV === "development", // Seulement en dev
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anshen - lms - subscribe.t3.storageapi.dev",
        port: "",
      },
      // ... autres domaines
    ],
  },
};

export default nextConfig;
