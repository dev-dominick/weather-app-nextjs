import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/weather-app-nextjs",
  trailingSlash: true,
};

export default nextConfig;
