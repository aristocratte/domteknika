import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-brand/35 bg-background py-7 md:py-16">
      <Container
        size="wide"
        className="grid gap-6"
      >
        <Logo variant="footer" className="w-[96px] md:w-[132px]" />

        <div className="grid items-start gap-5 sm:grid-cols-3 sm:gap-8">
          <address className="grid gap-1 not-italic text-[11px] font-medium leading-[1.42] text-muted-foreground md:text-[13px] md:leading-[1.55]">
            <span className="font-extrabold text-foreground">
              {t("addressLabel")}
            </span>
            <span>Chem. de Saint-Joux 16B</span>
            <span>2520, La Neuveville, {t("country")}</span>
          </address>

          <p className="text-[11px] font-medium leading-[1.42] text-muted-foreground sm:self-end sm:text-center md:text-[13px] md:leading-[1.55]">
            © 2026 DOMTEKNIKA
            <br />
            {t("rights")}
          </p>

          <address className="grid gap-1 not-italic text-[11px] font-medium leading-[1.42] text-muted-foreground sm:text-right md:text-[13px] md:leading-[1.55]">
            <span className="font-extrabold text-foreground">
              {t("contactLabel")}
            </span>
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
        </div>
      </Container>
    </footer>
  );
}
