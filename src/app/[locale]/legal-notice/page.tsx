import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalDocumentPage } from "@/components/sections/legal-document-page";
import { getLegalPages } from "@/data/legal-pages";

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

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
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
