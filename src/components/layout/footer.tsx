import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-brand/35 bg-background py-7 sm:py-9 md:py-16">
      <Container
        size="wide"
        className="grid gap-5 sm:gap-6"
      >
        <Logo variant="footer" className="w-[104px] sm:w-[96px] md:w-[132px]" />

        <div className="grid items-start gap-5 min-[520px]:grid-cols-2 sm:grid-cols-3 sm:gap-8">
          <address className="grid gap-1 not-italic text-[12px] font-medium leading-[1.45] text-muted-foreground md:text-[13px] md:leading-[1.55]">
            <span className="font-extrabold text-foreground">
              {t("addressLabel")}
            </span>
            <span>Chem. de Saint-Joux 16B</span>
            <span>2520, La Neuveville, {t("country")}</span>
          </address>

          <p className="order-last border-t border-border/70 pt-4 text-center text-[12px] font-medium leading-[1.45] text-muted-foreground min-[520px]:col-span-2 sm:order-none sm:col-span-1 sm:self-end sm:border-t-0 sm:pt-0 md:text-[13px] md:leading-[1.55]">
            © 2026 DOMTEKNIKA
            <br />
            {t("rights")}
          </p>

          <address className="grid gap-1 not-italic text-[12px] font-medium leading-[1.45] text-muted-foreground min-[520px]:text-right md:text-[13px] md:leading-[1.55]">
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
