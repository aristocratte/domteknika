import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/sections/contact-form";
import { ContactMap } from "@/components/sections/contact-map";
import { Reveal } from "@/components/providers/reveal";

const CONTACT_CARDS = [
  {
    key: "location",
    icon: "position",
    width: 48,
    height: 59,
    href: "https://www.google.com/maps/search/?api=1&query=Chemin%20de%20Saint-Joux%2016B%2C%202520%20La%20Neuveville%2C%20Switzerland",
    external: true,
  },
  {
    key: "email",
    icon: "mail",
    width: 44,
    height: 33,
    href: "mailto:info@domteknika.ch",
    external: false,
  },
  {
    key: "phone",
    icon: "tel",
    width: 43,
    height: 47,
    href: "tel:+41327517146",
    external: false,
  },
] as const;

export function ContactPageContent() {
  const t = useTranslations("ContactPage");

  const formCopy = {
    title: t("Form.title"),
    firstName: t("Form.firstName"),
    lastName: t("Form.lastName"),
    company: t("Form.company"),
    email: t("Form.email"),
    phone: t("Form.phone"),
    message: t("Form.message"),
    submit: t("Form.submit"),
    success: t("Form.success"),
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-background pb-[32px] pt-[132px] md:min-h-[640px] md:pb-[38px] md:pt-[152px]"
        aria-labelledby="contact-page-title"
      >
        <Image
          src="/assets/contact-page/technical-sketch.png"
          alt=""
          width={618}
          height={642}
          priority
          quality={100}
          sizes="(max-width: 1024px) 70vw, 660px"
          unoptimized
          className="pointer-events-none absolute right-[-30vw] top-[182px] z-0 h-auto w-[80vw] max-w-[630px] opacity-[0.68] sm:right-[-20vw] md:right-[-9vw] md:top-[176px] md:w-[46vw] lg:right-[-5vw] xl:right-[1vw] xl:w-[33vw]"
        />

        <Container size="wide" className="relative z-10">
          <div className="grid gap-7 lg:grid-cols-[340px_minmax(380px,500px)_1fr] lg:items-start lg:gap-10 xl:gap-[54px]">
            <div>
              <Reveal>
                <div className="flex items-center gap-3 text-[15px] font-medium leading-none text-muted-foreground md:text-[16px]">
                  <span className="h-[3px] w-[34px] shrink-0 bg-brand" aria-hidden />
                  {t("Hero.eyebrow")}
                </div>

                <h1
                  id="contact-page-title"
                  className="domtek-text-shadow mt-[38px] text-[42px] font-extrabold leading-none text-foreground sm:whitespace-nowrap sm:text-[60px] md:mt-[52px] md:text-[66px]"
                >
                  {t("Hero.title")}
                  <span className="text-brand">.</span>
                </h1>

                <p className="mt-[52px] max-w-[340px] text-[14px] font-medium leading-[1.46] text-muted-foreground md:mt-[56px] md:text-[14px]">
                  {t("Hero.lead")}
                </p>
              </Reveal>

              <div className="mt-6 grid gap-2.5">
                {CONTACT_CARDS.map((card, index) => (
                  <Reveal key={card.key} delay={0.08 * (index + 1)}>
                    <a
                      href={card.href}
                      aria-label={t(`Cards.${card.key}.action`)}
                      target={card.external ? "_blank" : undefined}
                      rel={card.external ? "noreferrer" : undefined}
                      className="group/contact-card relative grid min-h-[92px] transform-gpu grid-cols-[52px_1fr] items-center rounded-[10px] border border-border bg-white/85 px-5 py-3.5 pr-12 shadow-[0_12px_28px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-brand/25 hover:bg-white hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]"
                    >
                      <span
                        className="absolute right-4 top-4 grid size-8 place-items-center rounded-full border border-border bg-white/90 text-foreground shadow-[0_8px_18px_rgba(0,0,0,0.06)] transition-[transform,background-color,color,border-color,box-shadow] duration-300 group-hover/contact-card:-translate-y-0.5 group-hover/contact-card:border-brand group-hover/contact-card:bg-brand group-hover/contact-card:text-white group-hover/contact-card:shadow-[0_10px_22px_rgba(227,6,19,0.22)] motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]"
                        aria-hidden
                      >
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                      <Image
                        src={`/assets/contact-page/${card.icon}.png`}
                        alt=""
                        width={card.width}
                        height={card.height}
                        className="h-auto w-8 object-contain transition-transform duration-300 group-hover/contact-card:-translate-y-1 motion-reduce:transition-none"
                      />
                      <div>
                        <h2 className="text-[14px] font-extrabold leading-tight text-foreground">
                          {t(`Cards.${card.key}.title`)}
                        </h2>
                        <p className="mt-1.5 whitespace-pre-line text-[12px] font-medium leading-[1.38] text-muted-foreground">
                          {t(`Cards.${card.key}.body`)}
                        </p>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal className="lg:pt-[234px]" delay={0.08}>
              <ContactForm copy={formCopy} />
            </Reveal>

            <div className="hidden min-h-[410px] lg:block" aria-hidden />
          </div>
        </Container>
      </section>

      <section
        className="bg-background pb-[72px] pt-0 md:pb-[88px]"
        aria-labelledby="contact-map-title"
      >
        <Container size="wide">
          <Reveal>
            <div className="grid gap-7 lg:grid-cols-[360px_1fr] lg:items-start">
              <div>
                <div className="flex items-center gap-3 text-[15px] font-medium leading-none text-muted-foreground md:text-[16px]">
                  <span className="h-[3px] w-[34px] shrink-0 bg-brand" aria-hidden />
                  {t("Map.eyebrow")}
                </div>
                <h2
                  id="contact-map-title"
                  className="mt-5 max-w-[340px] text-[32px] font-extrabold leading-[1.05] text-foreground md:text-[40px]"
                >
                  {t("Map.title")}
                  <span className="text-brand">.</span>
                </h2>
              </div>

              <div className="relative h-[360px] overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_20px_56px_rgba(0,0,0,0.08)] md:h-[380px]">
                <ContactMap label={t("Map.marker")} />
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-[7px] border border-border bg-white/92 px-3.5 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand">
                    {t("Map.marker")}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-[12px] font-medium leading-[1.35] text-muted-foreground">
                    {t("Cards.location.body")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
