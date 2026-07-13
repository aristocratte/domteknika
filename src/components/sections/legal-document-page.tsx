import { Container } from "@/components/layout/container";

type LegalSection = {
  title: string;
  body: string;
};

export const LEGAL_PLACEHOLDER_BODIES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
] as const;

export function LegalDocumentPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="bg-background pb-20 pt-[132px] md:pb-28 md:pt-[152px] min-[1800px]:!pb-36 min-[2400px]:!pb-44">
      <Container size="default">
        <div className="flex items-center gap-3 text-[15px] font-medium leading-none text-muted-foreground md:text-[16px] min-[2400px]:!gap-5 min-[2400px]:!text-[22px]">
          <span
            className="h-[3px] w-[34px] shrink-0 bg-brand min-[2400px]:!h-1 min-[2400px]:!w-[64px]"
            aria-hidden
          />
          {eyebrow}
        </div>

        <h1 className="domtek-text-shadow mt-[38px] text-balance text-[42px] font-extrabold leading-[1.02] text-foreground sm:text-[56px] md:mt-[52px] md:text-[64px] min-[1800px]:!text-[72px] min-[2400px]:!mt-[72px] min-[2400px]:!text-[86px]">
          {title}
          <span className="text-brand">.</span>
        </h1>

        <p className="mt-8 max-w-[720px] text-pretty rounded-[8px] border border-brand/20 bg-brand/[0.035] px-5 py-4 text-[14px] font-medium leading-[1.6] text-muted-foreground md:text-[16px] min-[1800px]:!max-w-[900px] min-[1800px]:!px-6 min-[1800px]:!py-5 min-[1800px]:!text-[18px] min-[2400px]:!max-w-[1080px] min-[2400px]:!text-[20px]">
          {intro}
        </p>

        <div className="mt-10 grid max-w-[820px] gap-8 md:mt-14 md:gap-10 min-[1800px]:!max-w-[1040px] min-[1800px]:!gap-12 min-[2400px]:!max-w-[1240px] min-[2400px]:!gap-14">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="text-balance text-[22px] font-extrabold leading-tight text-foreground md:text-[28px] min-[1800px]:!text-[34px] min-[2400px]:!text-[40px]">
                {section.title}
              </h2>
              <p className="mt-3 text-pretty text-[14px] font-medium leading-[1.75] text-muted-foreground md:text-[16px] min-[1800px]:!mt-4 min-[1800px]:!text-[18px] min-[2400px]:!text-[20px]">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
