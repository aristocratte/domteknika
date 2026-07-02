import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import {
  getOurStoryMeta,
  OurStoryPageContent,
} from "@/components/sections/our-story-page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = getOurStoryMeta(locale);

  return {
    title: meta.title,
    description: meta.description,
  };
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
