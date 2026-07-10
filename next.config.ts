import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const localDevOrigins = Object.values(networkInterfaces())
  .flatMap((entries) => entries ?? [])
  .filter((entry) => entry.family === "IPv4" && !entry.internal)
  .map((entry) => entry.address);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: localDevOrigins,
  experimental: {
    cpus: 1,
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
  },
  turbopack: {
    // Explicit root so Next.js doesn't misdetect the workspace root
    // (a stray lockfile exists in a parent directory).
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
