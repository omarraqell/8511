import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run on a separate port to isolate from the storefront
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
