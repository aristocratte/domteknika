import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    // Explicit root so Next.js doesn't misdetect the workspace root
    // (a stray lockfile exists in a parent directory).
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
