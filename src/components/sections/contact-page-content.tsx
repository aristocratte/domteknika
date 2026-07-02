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
    secure: t("Form.secure"),
    success: t("Form.success"),
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-background pb-[72px] pt-[122px] md:min-h-[900px] md:pb-[92px] md:pt-[152px]"
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
          className="pointer-events-none absolute right-[-30vw] top-[244px] z-0 h-auto w-[88vw] max-w-[700px] opacity-[0.68] sm:right-[-20vw] md:right-[-9vw] md:top-[236px] md:w-[52vw] lg:right-[-5vw] xl:right-[1vw] xl:w-[38vw]"
        />

        <Container size="wide" className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[390px_minmax(440px,560px)_1fr] lg:items-start lg:gap-[54px] xl:gap-[78px]">
            <div>
              <Reveal>
                <div className="flex items-center gap-3 text-[14px] font-extrabold leading-none text-brand">
                  <span className="h-[2px] w-[29px] bg-brand" aria-hidden />
                  {t("Hero.eyebrow")}
                </div>

                <h1
                  id="contact-page-title"
                  className="domtek-text-shadow mt-11 text-[48px] font-extrabold leading-none text-foreground sm:whitespace-nowrap sm:text-[58px] md:text-[60px] xl:text-[72px]"
                >
                  {t("Hero.title")}
                  <span className="text-brand">.</span>
                </h1>

                <p className="mt-[118px] max-w-[410px] text-[17px] font-medium leading-[1.55] text-muted-foreground md:mt-[126px]">
                  {t("Hero.lead")}
                </p>
              </Reveal>

              <div className="mt-14 grid gap-[18px]">
                {CONTACT_CARDS.map((card, index) => (
                  <Reveal key={card.key} delay={0.08 * (index + 1)}>
                    <article className="group/contact-card relative grid min-h-[128px] transform-gpu grid-cols-[76px_1fr] items-center rounded-[10px] border border-border bg-white/85 px-8 py-6 pr-16 shadow-[0_16px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-brand/25 hover:bg-white hover:shadow-[0_18px_42px_rgba(0,0,0,0.07)] motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]">
                      <a
                        href={card.href}
                        aria-label={t(`Cards.${card.key}.action`)}
                        target={card.external ? "_blank" : undefined}
                        rel={card.external ? "noreferrer" : undefined}
                        className="absolute right-4 top-4 grid size-8 place-items-center rounded-full border border-border bg-white/90 text-foreground shadow-[0_8px_18px_rgba(0,0,0,0.06)] transition-[transform,background-color,color,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_10px_22px_rgba(227,6,19,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 motion-reduce:transition-none [transition-timing-function:var(--ease-smooth)]"
                      >
                        <ArrowUpRight className="size-4" aria-hidden />
                      </a>
                      <Image
                        src={`/assets/contact-page/${card.icon}.png`}
                        alt=""
                        width={card.width}
                        height={card.height}
                        className="h-auto w-[44px] object-contain transition-transform duration-300 group-hover/contact-card:-translate-y-1 motion-reduce:transition-none"
                      />
                      <div>
                        <h2 className="text-[17px] font-extrabold leading-tight text-foreground">
                          {t(`Cards.${card.key}.title`)}
                        </h2>
                        <p className="mt-3 whitespace-pre-line text-[15px] font-medium leading-[1.45] text-muted-foreground">
                          {t(`Cards.${card.key}.body`)}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal className="lg:pt-[124px]" delay={0.08}>
              <ContactForm copy={formCopy} />
            </Reveal>

            <div className="hidden min-h-[580px] lg:block" aria-hidden />
          </div>
        </Container>
      </section>

      <section
        className="bg-background pb-[92px] pt-[8px] md:pb-[116px]"
        aria-labelledby="contact-map-title"
      >
        <Container size="wide">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[390px_1fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3 text-[15px] font-medium text-muted-foreground">
                  <span className="h-[2px] w-[29px] bg-brand" aria-hidden />
                  {t("Map.eyebrow")}
                </div>
                <h2
                  id="contact-map-title"
                  className="mt-6 max-w-[420px] text-[34px] font-extrabold leading-[1.05] text-foreground md:text-[46px]"
                >
                  {t("Map.title")}
                  <span className="text-brand">.</span>
                </h2>
                <p className="mt-5 max-w-[420px] text-[15px] font-medium leading-[1.55] text-muted-foreground md:text-[16px]">
                  {t("Map.body")}
                </p>
              </div>

              <div className="relative h-[420px] overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
                <ContactMap label={t("Map.marker")} />
                <div className="pointer-events-none absolute bottom-5 left-5 rounded-[7px] border border-border bg-white/92 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                  <p className="text-[12px] font-extrabold uppercase tracking-wide text-brand">
                    {t("Map.marker")}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-[13px] font-medium leading-[1.35] text-muted-foreground">
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
