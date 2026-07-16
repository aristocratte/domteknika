import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { OurStoryPageContent } from "@/components/sections/our-story-page-content";
import { getOurStoryMeta } from "@/components/sections/our-story-meta";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = getOurStoryMeta(locale);

  return buildPageMetadata({
    description: meta.description,
    locale,
    path: "/our-story",
    title: meta.title,
  });
}

export default async function OurStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OurStoryPageContent locale={locale} />;
}
