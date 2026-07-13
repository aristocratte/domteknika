import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  LEGAL_PLACEHOLDER_BODIES,
  LegalDocumentPage,
} from "@/components/sections/legal-document-page";

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

  return (
    <LegalDocumentPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      sections={[
        { title: t("publisher"), body: LEGAL_PLACEHOLDER_BODIES[0] },
        { title: t("hosting"), body: LEGAL_PLACEHOLDER_BODIES[1] },
        { title: t("intellectualProperty"), body: LEGAL_PLACEHOLDER_BODIES[2] },
      ]}
    />
  );
}
