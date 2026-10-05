import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Prefer AVIF, fall back to WebP — Cloudinary handles this via f_auto
    formats: ["image/avif", "image/webp"],
  },

  // Neon serverless driver must only run on the server
  serverExternalPackages: ["@neondatabase/serverless"],
};

export default nextConfig;
