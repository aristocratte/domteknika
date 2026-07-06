import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand/35 bg-background py-7 md:py-16">
      <Container
        size="wide"
        className="grid grid-cols-[96px_minmax(0,1fr)_minmax(0,1fr)] items-start gap-4 md:grid-cols-[190px_1fr_1fr] md:gap-10"
      >
        <Logo variant="footer" className="w-[96px] md:w-[132px]" />

        <address className="not-italic text-[11px] font-medium leading-[1.42] text-muted-foreground md:text-[13px] md:leading-[1.55]">
          Chem. de Saint-Joux 16B
          <br />
          2520, La Neuveville
          <br />
          {t("country")}
        </address>

        <p className="text-[11px] font-medium leading-[1.42] text-muted-foreground md:text-center md:text-[13px] md:leading-[1.55]">
          © {year} DOMTEKNIKA
          <br />
          {t("rights")}
        </p>
      </Container>
    </footer>
  );
}
