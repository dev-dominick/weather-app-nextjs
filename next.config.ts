import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/weather-demo",
  assetPrefix: "/weather-demo",
  images: { unoptimized: true },
};

export default nextConfig;
