"use client";

import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import { useState } from "react";

import CardSwapModule, { Card as CardModule } from "@/components/CardSwap";

type CardSwapProps = {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  manualSwapSignal?: number;
  skewAmount?: number;
  easing?: "elastic" | string;
  children: ReactNode;
};

type CardProps = {
  customClass?: string;
  className?: string;
  children?: ReactNode;
};

const CardSwap = CardSwapModule as ComponentType<CardSwapProps>;
const Card = CardModule as ComponentType<CardProps>;

const BRAINSTORMING_CARDS = [
  {
    image: "/assets/expertise-page/brainstorming/brainstorming-numedico-sliding-speculum.webp",
    title: "Sliding speculum",
  },
  {
    image: "/assets/expertise-page/brainstorming/brainstorming-numedico-pump-skin-solution.webp",
    title: "Pump solution",
  },
  {
    image: "/assets/expertise-page/brainstorming/brainstorming-ikitty-capsule-rack.webp",
    title: "Capsule rack",
  },
  {
    image: "/assets/expertise-page/brainstorming/brainstorming-ikitty-one-way.webp",
    title: "One-way flow",
  },
  {
    image: "/assets/expertise-page/brainstorming/brainstorming-ikitty-closed-loop.webp",
    title: "Closed loop",
  },
] as const;

export function BrainstormingCardSwap() {
  const [manualSwapSignal, setManualSwapSignal] = useState(0);
  const triggerSwap = () => setManualSwapSignal((signal) => signal + 1);

  return (
    <div
      className="domtek-card-swap relative h-[440px] cursor-pointer overflow-hidden bg-transparent sm:h-[500px] lg:h-[560px]"
      role="button"
      tabIndex={0}
      aria-label="Faire avancer les cartes de brainstorming"
      onPointerDown={triggerSwap}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          triggerSwap();
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12px_12px,rgba(227,6,19,0.08)_1.2px,transparent_1.3px)] bg-[length:28px_28px] opacity-45" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-white to-transparent" />

      <CardSwap
        width={460}
        height={360}
        cardDistance={64}
        verticalDistance={46}
        delay={3200}
        manualSwapSignal={manualSwapSignal}
        skewAmount={3}
        easing="elastic"
      >
        {BRAINSTORMING_CARDS.map((item) => (
          <Card
            key={item.image}
            customClass="brainstorming-swap-card overflow-hidden bg-white shadow-[0_18px_44px_rgba(0,0,0,0.11)] ring-1 ring-brand/35"
          >
            <div className="flex size-full flex-col bg-white">
              <div className="border-b border-brand/75 px-4 pb-2 pt-3">
                <p className="text-[13px] font-extrabold leading-none text-foreground">
                  {item.title}
                </p>
              </div>
              <div className="relative min-h-0 flex-1">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 420px, 460px"
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </Card>
        ))}
      </CardSwap>
    </div>
  );
}
