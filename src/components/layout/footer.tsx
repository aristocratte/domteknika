import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-brand/35 bg-background py-6 sm:py-9 md:py-16 min-[1800px]:!pb-8 min-[1800px]:!pt-16 min-[2400px]:!pb-8 min-[2400px]:!pt-16">
      <Container
        size="wide"
        className="grid items-start gap-5 sm:gap-6 min-[1800px]:!gap-8"
      >
        <Logo variant="footer" className="w-[86px] sm:w-[96px] md:w-[132px] min-[1800px]:!w-[180px] min-[2400px]:!w-[204px]" />

        <div className="grid min-w-0 grid-cols-2 items-start gap-x-6 gap-y-4 sm:gap-x-8 md:gap-x-12 min-[1800px]:!gap-x-24 min-[1800px]:!gap-y-5 min-[2400px]:!gap-x-32">
          <address className="grid min-w-0 gap-1 not-italic text-[12px] font-medium leading-[1.4] text-muted-foreground md:text-[13px] md:leading-[1.55] min-[1800px]:!gap-1.5 min-[1800px]:!text-[18px] min-[2400px]:!text-[20px]">
            <span className="font-extrabold text-foreground">
              {t("addressLabel")}
            </span>
            <span>Chem. de Saint-Joux 16B</span>
            <span>2520, La Neuveville, {t("country")}</span>
          </address>

          <address className="grid min-w-0 gap-1 text-right not-italic text-[12px] font-medium leading-[1.4] text-muted-foreground md:text-[13px] md:leading-[1.55] min-[1800px]:!gap-1.5 min-[1800px]:!text-[18px] min-[2400px]:!text-[20px]">
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

          <p className="col-span-2 border-t border-border/70 pt-4 text-center text-[12px] font-medium leading-[1.4] text-muted-foreground md:text-[13px] md:leading-[1.55] min-[1800px]:!pt-5 min-[1800px]:!text-[17px] min-[2400px]:!text-[19px]">
            © 2026 DOMTEKNIKA
            <br />
            {t("rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
