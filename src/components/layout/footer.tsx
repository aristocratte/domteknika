import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-brand/35 bg-background py-6 sm:py-9 md:py-16 canvas-lg:!py-36 canvas-mid:!py-48 canvas-xl:!pb-8 canvas-xl:!pt-16">
      <Container
        size="wide"
        className="grid items-start gap-5 sm:gap-6 canvas-lg:!gap-16 canvas-mid:!gap-[5.5rem] canvas-xl:!gap-8"
      >
        <Logo variant="footer" className="w-[86px] sm:w-[96px] md:w-[132px] canvas-lg:!w-[300px] canvas-mid:!w-[380px] canvas-xl:!w-[204px]" />

        <div className="grid min-w-0 grid-cols-2 items-start gap-x-6 gap-y-4 sm:gap-x-8 md:gap-x-12 canvas-lg:!gap-x-36 canvas-lg:!gap-y-14 canvas-mid:!gap-x-48 canvas-xl:!gap-x-32 canvas-xl:!gap-y-5">
          <address className="grid min-w-0 gap-1 not-italic text-[12px] font-medium leading-[1.4] text-muted-foreground md:text-[13px] md:leading-[1.55] canvas-lg:!gap-4 canvas-lg:!text-[30px] canvas-mid:!gap-5 canvas-mid:!text-[38px] canvas-xl:!gap-1.5 canvas-xl:!text-[20px]">
            <span className="font-extrabold text-foreground">
              {t("addressLabel")}
            </span>
            <span>Chem. de Saint-Joux 16B</span>
            <span>2520, La Neuveville, {t("country")}</span>
          </address>

          <address className="grid min-w-0 gap-1 text-right not-italic text-[12px] font-medium leading-[1.4] text-muted-foreground md:text-[13px] md:leading-[1.55] canvas-lg:!gap-4 canvas-lg:!text-[30px] canvas-mid:!gap-5 canvas-mid:!text-[38px] canvas-xl:!gap-1.5 canvas-xl:!text-[20px]">
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

          <p className="col-span-2 border-t border-border/70 pt-4 text-center text-[12px] font-medium leading-[1.4] text-muted-foreground md:text-[13px] md:leading-[1.55] canvas-lg:!pt-14 canvas-lg:!text-[28px] canvas-mid:!pt-16 canvas-mid:!text-[36px] canvas-xl:!pt-5 canvas-xl:!text-[19px]">
            © 2026 DOMTEKNIKA
            <br />
            {t("rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
