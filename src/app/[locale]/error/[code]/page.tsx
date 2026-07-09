import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ErrorPageContent } from "@/components/sections/error-page-content";
import { routing, type Locale } from "@/i18n/routing";
import { COMMON_ERROR_CODES } from "@/lib/error-pages";

export const dynamicParams = true;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    COMMON_ERROR_CODES.map((code) => ({
      locale,
      code: code.toString(),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const statusCode = parseStatusCode(code);

  return {
    title: `DOMTEKNIKA - Error ${statusCode ?? 404}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ErrorCodePage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const statusCode = parseStatusCode(code);

  if (!statusCode) notFound();

  setRequestLocale(locale);

  return <ErrorPageContent statusCode={statusCode} locale={locale as Locale} />;
}

function parseStatusCode(code: string) {
  if (!/^\d{3}$/.test(code)) return null;

  const statusCode = Number(code);
  if (statusCode < 100 || statusCode > 599) return null;

  return statusCode;
}
