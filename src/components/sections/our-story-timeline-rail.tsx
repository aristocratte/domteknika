"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import {
  motion,
  type Variants,
  useAnimationFrame,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface OurStoryTimelineRailProps {
  children: ReactNode;
}

interface OurStoryTimelineStepProps {
  children: ReactNode;
  className?: string;
  dotClassName?: string;
}

interface OurStoryTimelineBlockProps {
  children: ReactNode;
  className?: string;
}

const railContext = createContext<React.RefObject<HTMLDivElement | null> | null>(
  null,
);
const stepContext = createContext(false);

const blockVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

export function OurStoryTimelineRail({ children }: OurStoryTimelineRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 76%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  return (
    <railContext.Provider value={ref}>
      <div ref={ref} className="relative mt-7 md:mt-9">
        <div
          className="pointer-events-none absolute bottom-0 left-[13px] top-1 z-0 w-[3px] overflow-hidden rounded-full md:left-1/2 md:-translate-x-1/2"
          aria-hidden
        >
          <motion.div
            data-our-story-rail-fill
            className="h-full w-full origin-top rounded-full bg-brand shadow-[0_0_18px_rgba(237,0,13,0.2)]"
            style={{ scaleY: prefersReducedMotion ? 1 : scaleY }}
          />
        </div>

        <div className="relative z-10 grid gap-y-7 md:gap-y-8">{children}</div>
      </div>
    </railContext.Provider>
  );
}

export function OurStoryTimelineStep({
  children,
  className,
  dotClassName,
}: OurStoryTimelineStepProps) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const reachedRef = useRef(false);
  const railRef = useContext(railContext);
  const prefersReducedMotion = useReducedMotion();
  const [isReached, setIsReached] = useState(Boolean(prefersReducedMotion));

  useAnimationFrame(() => {
    if (prefersReducedMotion) {
      if (!reachedRef.current) {
        reachedRef.current = true;
        setIsReached(true);
      }
      return;
    }

    const dot = dotRef.current;
    const rail = railRef?.current;
    const line = rail?.querySelector<HTMLElement>("[data-our-story-rail-fill]");

    if (!dot || !line) {
      return;
    }

    const dotRect = dot.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();
    const dotCenter = dotRect.top + dotRect.height / 2;
    const nextReached = lineRect.bottom + 1 >= dotCenter;

    if (nextReached !== reachedRef.current) {
      reachedRef.current = nextReached;
      setIsReached(nextReached);
    }
  });

  return (
    <stepContext.Provider value={prefersReducedMotion || isReached}>
      <div className={className}>
        <div className={dotClassName}>
          <span
            ref={dotRef}
            data-our-story-timeline-dot
            className="block size-[15px] rounded-full border-[3px] border-brand bg-white"
          />
        </div>
        {children}
      </div>
    </stepContext.Provider>
  );
}

export function OurStoryTimelineBlock({
  children,
  className,
}: OurStoryTimelineBlockProps) {
  const isReached = useContext(stepContext);

  return (
    <motion.div
      data-our-story-timeline-block
      initial={false}
      animate={isReached ? "visible" : "hidden"}
      variants={blockVariants}
      transition={{
        duration: 0.62,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
