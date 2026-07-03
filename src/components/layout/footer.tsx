import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand/35 bg-background py-12 md:py-16">
      <Container
        size="wide"
        className="grid items-start gap-10 md:grid-cols-[190px_1fr_1fr]"
      >
        <Logo variant="footer" className="w-[132px]" />

        <address className="not-italic text-[13px] font-medium leading-[1.55] text-muted-foreground">
          Chem. de Saint-Joux 16B
          <br />
          2520, La Neuveville
          <br />
          {t("country")}
        </address>

        <p className="text-[13px] font-medium leading-[1.55] text-muted-foreground md:text-center">
          © {year} DOMTEKNIKA
          <br />
          {t("rights")}
        </p>
      </Container>
    </footer>
  );
}
