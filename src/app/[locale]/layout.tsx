import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RouteRecovery } from "@/components/providers/route-recovery";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

// 42dot Sans, self-hosted and subsetted for DOMTEKNIKA Latin/French copy.
// The local files add French accented glyphs as 42dot-style composites so
// French text keeps the same weight and personality as the Figma font.
const domtekSans = localFont({
  src: [
    { path: "../fonts/42dot-domteknika-300.woff2", weight: "300" },
    { path: "../fonts/42dot-domteknika-400.woff2", weight: "400" },
    { path: "../fonts/42dot-domteknika-500.woff2", weight: "500" },
    { path: "../fonts/42dot-domteknika-600.woff2", weight: "600" },
    { path: "../fonts/42dot-domteknika-700.woff2", weight: "700" },
    { path: "../fonts/42dot-domteknika-800.woff2", weight: "800" },
  ],
  variable: "--font-domtek-sans",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://domteknika.com"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${domtekSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <NextIntlClientProvider>
          <SmoothScrollProvider>
            <RouteRecovery />
            <Navbar />
            <main className="relative">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
