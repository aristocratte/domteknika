import type { MetadataRoute } from "next";

import { locales } from "@/i18n/routing";
import {
  INDEXABLE_ROUTES,
  languageAlternates,
  localizedUrl,
} from "@/lib/seo";

const ROUTE_SETTINGS: Record<
  (typeof INDEXABLE_ROUTES)[number],
  {
    changeFrequency: "monthly" | "yearly";
    priority: number;
  }
> = {
  "": { changeFrequency: "monthly", priority: 1 },
  "/projects": { changeFrequency: "monthly", priority: 0.9 },
  "/expertise": { changeFrequency: "monthly", priority: 0.9 },
  "/patents": { changeFrequency: "monthly", priority: 0.8 },
  "/our-story": { changeFrequency: "yearly", priority: 0.7 },
  "/contact": { changeFrequency: "yearly", priority: 0.7 },
  "/legal-notice": { changeFrequency: "yearly", priority: 0.3 },
  "/privacy-policy": { changeFrequency: "yearly", priority: 0.3 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.flatMap((path) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      alternates: {
        languages: languageAlternates(path),
      },
      ...ROUTE_SETTINGS[path],
    })),
  );
}
