import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "./logo";
import { Container } from "@/components/layout/container";

/**
 * Footer — reusable across all pages.
 * Columns: Company, Expertise, Legal + contact block, Swiss-made mention.
 */
export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("columns.company.title"),
      links: [
        { label: t("columns.company.links.about"), href: "/about" },
        { label: t("columns.company.links.projects"), href: "/#projects" },
        { label: t("columns.company.links.careers"), href: "/careers" },
        { label: t("columns.company.links.contact"), href: "/contact" },
      ],
    },
    {
      title: t("columns.services.title"),
      links: [
        { label: t("columns.services.links.design"), href: "/services/design" },
        {
          label: t("columns.services.links.engineering"),
          href: "/services/engineering",
        },
        {
          label: t("columns.services.links.prototyping"),
          href: "/services/prototyping",
        },
        {
          label: t("columns.services.links.production"),
          href: "/services/production",
        },
      ],
    },
    {
      title: t("columns.legal.title"),
      links: [
        { label: t("columns.legal.links.privacy"), href: "/privacy" },
        { label: t("columns.legal.links.terms"), href: "/terms" },
        { label: t("columns.legal.links.cookies"), href: "/cookies" },
      ],
    },
  ] as const;

  return (
    <footer className="relative border-t border-border bg-background">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          {/* Brand + tagline */}
          <div className="col-span-2 md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <LinkedinIcon />
              </SocialLink>
              <SocialLink href="https://instagram.com" label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="https://github.com" label="GitHub">
                <GithubIcon />
              </SocialLink>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav
              key={col.title}
              className="md:col-span-2"
              aria-label={col.title}
            >
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as never}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-sm font-semibold text-foreground">
              {t("contact.title")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-brand" />
                <a
                  href="mailto:hello@domteknika.com"
                  className="transition-colors hover:text-brand"
                >
                  hello@domteknika.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-brand" />
                <a
                  href="tel:+41000000000"
                  className="transition-colors hover:text-brand"
                >
                  +41 00 000 00 00
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>Chasseral, Suisse</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Domteknika. {t("rights")}
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Image
              src="/assets/swiss-flag.png"
              alt="Swiss flag"
              width={16}
              height={16}
              className="size-4 rounded-[2px] object-cover"
            />
            <span>{t("madeIn")}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand"
    >
      {children}
    </a>
  );
}

/* Brand glyphs as inline SVG (lucide-react removed brand icons). */
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}
