import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-brand/35 bg-background py-7 md:py-16">
      <Container
        size="wide"
        className="grid items-start gap-6 sm:grid-cols-3 sm:gap-8"
      >
        <div className="grid gap-4">
          <Logo variant="footer" className="w-[96px] md:w-[132px]" />
          <address className="not-italic text-[11px] font-medium leading-[1.42] text-muted-foreground md:text-[13px] md:leading-[1.55]">
            Chem. de Saint-Joux 16B
            <br />
            2520, La Neuveville
            <br />
            {t("country")}
          </address>
        </div>

        <p className="text-[11px] font-medium leading-[1.42] text-muted-foreground sm:text-center md:text-[13px] md:leading-[1.55]">
          © 2026 DOMTEKNIKA
          <br />
          {t("rights")}
        </p>

        <address className="grid gap-1 not-italic text-[11px] font-medium leading-[1.42] text-muted-foreground sm:text-right md:text-[13px] md:leading-[1.55]">
          <a className="transition-colors hover:text-brand" href="tel:+41327517146">
            +41 32 751 71 46
          </a>
          <a
            className="transition-colors hover:text-brand"
            href="mailto:info@domteknika.ch"
          >
            info@domteknika.ch
          </a>
        </address>
      </Container>
    </footer>
  );
}
