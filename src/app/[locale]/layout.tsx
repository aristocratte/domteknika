import type { Metadata } from "next";
import { Asta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

// 42dot Sans has been renamed "Asta Sans" on Google Fonts.
// next/font self-hosts the files — no external request at runtime, 0 layout shift.
// Asta Sans is a variable font (wght 300-800): loaded in variable mode so the
// full weight range is available via font-weight utilities.
const astaSans = Asta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  // Asta Sans fallback metrics aren't shipped in @next/font yet; disable the
  // automatic fallback-size adjustment to avoid the build warning. The font is
  // self-hosted and served with font-display: swap, so impact is negligible.
  adjustFontFallback: false,
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
    <html lang={locale} className={`${astaSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <NextIntlClientProvider>
          <SmoothScrollProvider>
            <Navbar />
            <main className="relative">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
