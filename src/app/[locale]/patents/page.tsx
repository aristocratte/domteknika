import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PatentPageContent, PatentPageCta } from "@/components/sections/patent-page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PatentPage.Meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PatentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PatentPageContent locale={locale} />
      <PatentPageCta locale={locale} />
    </>
  );
}
