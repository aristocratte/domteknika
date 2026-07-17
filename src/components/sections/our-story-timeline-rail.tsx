"use client";

import {
  createContext,
  type RefObject,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  type MotionValue,
  type Variants,
  useMotionValueEvent,
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

interface RailContextValue {
  progress: MotionValue<number>;
  railRef: RefObject<HTMLDivElement | null>;
}

const railContext = createContext<RailContextValue | null>(null);
const stepContext = createContext(false);

const blockVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
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
    <railContext.Provider value={{ progress: scaleY, railRef: ref }}>
      <div ref={ref} className="relative mt-7 md:mt-9 min-[1800px]:!mt-14 min-[2400px]:!mt-16">
        <div
          className="pointer-events-none absolute bottom-0 left-[13px] top-1 z-0 w-[3px] overflow-hidden rounded-full md:left-1/2 md:-translate-x-1/2 min-[1800px]:!w-1"
          aria-hidden
        >
          <motion.div
            data-our-story-rail-fill
            className="h-full w-full origin-top rounded-full bg-brand shadow-[0_0_18px_rgba(237,0,13,0.2)]"
            style={{ scaleY: prefersReducedMotion ? 1 : scaleY }}
          />
        </div>

        <div className="relative z-10 grid gap-y-7 md:gap-y-8 min-[1800px]:!gap-y-12 min-[2400px]:!gap-y-16">{children}</div>
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
  const rail = useContext(railContext);
  const prefersReducedMotion = useReducedMotion();
  const [isReached, setIsReached] = useState(Boolean(prefersReducedMotion));
  const reachedRef = useRef(Boolean(prefersReducedMotion));
  const thresholdRef = useRef(1);

  if (!rail) {
    throw new Error(
      "OurStoryTimelineStep must be rendered inside OurStoryTimelineRail.",
    );
  }

  const setReached = useCallback((nextReached: boolean) => {
    if (reachedRef.current === nextReached) return;

    reachedRef.current = nextReached;
    setIsReached(nextReached);
  }, []);

  const updateThreshold = useCallback(() => {
    if (prefersReducedMotion) {
      setReached(true);
      return;
    }

    const railElement = rail.railRef.current;
    const dotElement = dotRef.current;
    const lineElement = railElement?.querySelector<HTMLElement>(
      "[data-our-story-rail-fill]",
    );
    const trackElement = lineElement?.parentElement;
    if (!railElement || !dotElement || !trackElement) return;

    const trackRect = trackElement.getBoundingClientRect();
    const dotRect = dotElement.getBoundingClientRect();
    const dotCenter = dotRect.top + dotRect.height / 2;
    const threshold =
      trackRect.height > 0
        ? Math.min(
            1,
            Math.max(0, (dotCenter - trackRect.top) / trackRect.height),
          )
        : 1;

    thresholdRef.current = threshold;
    setReached(rail.progress.get() + 0.002 >= threshold);
  }, [prefersReducedMotion, rail, setReached]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setReached(true);
      return;
    }

    let frame = 0;
    const queueCheck = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateThreshold);
    };

    queueCheck();
    window.addEventListener("resize", queueCheck);
    window.addEventListener("domtek:scroll-resize", queueCheck);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(queueCheck)
        : null;
    if (rail.railRef.current) observer?.observe(rail.railRef.current);
    if (dotRef.current) observer?.observe(dotRef.current);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", queueCheck);
      window.removeEventListener("domtek:scroll-resize", queueCheck);
      observer?.disconnect();
    };
  }, [prefersReducedMotion, rail, setReached, updateThreshold]);

  useMotionValueEvent(rail.progress, "change", (latest) => {
    if (!prefersReducedMotion) {
      setReached(latest + 0.002 >= thresholdRef.current);
    }
  });

  return (
    <stepContext.Provider value={prefersReducedMotion || isReached}>
      <div className={className}>
        <div className={dotClassName}>
          <span
            ref={dotRef}
            data-our-story-timeline-dot
            className="block size-[15px] rounded-full border-[3px] border-brand bg-white min-[1800px]:!size-[19px] min-[1800px]:!border-4 min-[2400px]:!size-[22px]"
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
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
