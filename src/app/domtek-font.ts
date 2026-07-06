import localFont from "next/font/local";

// 42dot Sans, self-hosted and subsetted for DOMTEKNIKA Latin/French copy.
// The local files add French accented glyphs as 42dot-style composites so
// French text keeps the same weight and personality as the Figma font.
export const domtekSans = localFont({
  src: [
    { path: "./fonts/42dot-domteknika-300.woff2", weight: "300" },
    { path: "./fonts/42dot-domteknika-400.woff2", weight: "400" },
    { path: "./fonts/42dot-domteknika-500.woff2", weight: "500" },
    { path: "./fonts/42dot-domteknika-600.woff2", weight: "600" },
    { path: "./fonts/42dot-domteknika-700.woff2", weight: "700" },
    { path: "./fonts/42dot-domteknika-800.woff2", weight: "800" },
  ],
  variable: "--font-domtek-sans",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});
