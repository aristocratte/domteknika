import { setRequestLocale } from "next-intl/server";

import { HeroSection } from "@/components/sections/hero-section";
import { TrustedBy } from "@/components/sections/trusted-by";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ValuesSection } from "@/components/sections/values-section";
import { ProcessSection } from "@/components/sections/process-section";
import { CtaSection } from "@/components/sections/cta-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <TrustedBy />
      <ProjectsSection />
      <ValuesSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
