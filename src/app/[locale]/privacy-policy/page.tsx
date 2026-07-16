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
    namespace: "LegalPages.privacyPolicy",
  });

  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    path: "/privacy-policy",
    title: t("metaTitle"),
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LegalPages.privacyPolicy");
  const content = getLegalPages(locale).privacyPolicy;

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
