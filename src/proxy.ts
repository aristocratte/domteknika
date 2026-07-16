import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const countryLocaleMap = {
  AD: "es",
  AR: "es",
  AT: "de",
  BE: "fr",
  BO: "es",
  CL: "es",
  CN: "zh",
  CO: "es",
  CR: "es",
  CU: "es",
  DE: "de",
  DO: "es",
  EC: "es",
  ES: "es",
  FR: "fr",
  GT: "es",
  HN: "es",
  HK: "zh",
  LI: "de",
  LU: "fr",
  MC: "fr",
  MO: "zh",
  MX: "es",
  NI: "es",
  PA: "es",
  PE: "es",
  PY: "es",
  SV: "es",
  TW: "zh",
  UY: "es",
  VE: "es",
  KR: "ko",
  AU: "en",
  CA: "en",
  GB: "en",
  IE: "en",
  NZ: "en",
  US: "en",
} as const;

const countryHeaderNames = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-geo-country",
  "x-appengine-country",
  "x-forwarded-country",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocalePrefix) {
    const locale = detectPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next)
  // - static files (assets, images, favicons…)
  matcher: ["/((?!api|_next|_vercel|social-image|.*\\..*).*)"],
};

function detectPreferredLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (isSupportedLocale(cookieLocale)) return cookieLocale;

  const countryLocale = getLocaleFromCountry(request);
  if (countryLocale) return countryLocale;

  return routing.defaultLocale;
}

function getLocaleFromCountry(request: NextRequest) {
  for (const headerName of countryHeaderNames) {
    const country = request.headers.get(headerName)?.split(",")[0]?.trim();
    if (!country) continue;

    const locale =
      countryLocaleMap[country.toUpperCase() as keyof typeof countryLocaleMap];
    if (locale) return locale;
  }

  return null;
}

function isSupportedLocale(locale: string | undefined): locale is (typeof routing.locales)[number] {
  return Boolean(locale && routing.locales.includes(locale as never));
}
