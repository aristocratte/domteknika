import { defineRouting } from "next-intl/routing";

/**
 * Domteknika — i18n routing configuration.
 * Two locales are supported: French (default) and English.
 */
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  localePrefix: "always",
});
