import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { domtekSans } from "@/app/domtek-font";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RouteRecovery } from "@/components/providers/route-recovery";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

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

  const htmlLang = locale === "zh" ? "zh-Hans" : locale;

  return (
    <html lang={htmlLang} className={`${domtekSans.variable} h-full antialiased`}>
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
