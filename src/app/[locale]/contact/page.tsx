import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactPageContent } from "@/components/sections/contact-page-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage.Meta" });

  return buildPageMetadata({
    description: t("description"),
    locale,
    path: "/contact",
    title: t("title"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactPageContent />;
}
