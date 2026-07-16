import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalDocumentPage } from "@/components/sections/legal-document-page";
import { getLegalPages } from "@/data/legal-pages";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "LegalPages.legalNotice",
  });

  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    path: "/legal-notice",
    title: t("metaTitle"),
  });
}

export default async function LegalNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LegalPages.legalNotice");
  const content = getLegalPages(locale).legalNotice;

  return (
    <LegalDocumentPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={content.intro}
      updatedLabel={content.updatedLabel}
      updated={content.updated}
      sections={content.sections}
    />
  );
}
