import { defineRouting } from "next-intl/routing";

/**
 * Domteknika — i18n routing configuration.
 * French is the default locale; additional translated routes are prefixed.
 */
export const locales = ["fr", "en", "de", "es", "ko", "zh"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  localePrefix: "always",
});
