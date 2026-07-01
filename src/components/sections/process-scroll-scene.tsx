"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";

const ProcessScrollContext = createContext<MotionValue<number> | null>(null);

type CardReveal = {
  opacityInput: number[];
  opacityOutput: number[];
  xInput: number[];
  xOutput: number[];
};

const CARD_REVEALS: CardReveal[] = [
  {
    opacityInput: [0, 1],
    opacityOutput: [1, 1],
    xInput: [0, 1],
    xOutput: [0, 0],
  },
  {
    opacityInput: [0.3, 0.48, 1],
    opacityOutput: [0, 1, 1],
    xInput: [0.18, 0.48, 1],
    xOutput: [-520, 0, 0],
  },
  {
    opacityInput: [0.66, 0.8, 1],
    opacityOutput: [0, 1, 1],
    xInput: [0.5, 0.8, 1],
    xOutput: [-560, 0, 0],
  },
];

interface ProcessScrollSceneProps {
  children: ReactNode;
}

export function ProcessScrollScene({ children }: ProcessScrollSceneProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  return (
    <ProcessScrollContext.Provider value={scrollYProgress}>
      <div
        ref={targetRef}
        className="relative lg:min-h-[220vh] motion-reduce:lg:min-h-0"
      >
        <div className="lg:sticky lg:top-[104px] lg:flex lg:min-h-[calc(100vh-104px)] lg:items-center lg:py-[112px] motion-reduce:lg:static motion-reduce:lg:min-h-0">
          {children}
        </div>
      </div>
    </ProcessScrollContext.Provider>
  );
}

interface ProcessScrollCardProps {
  children: ReactNode;
  className?: string;
  index: 0 | 1 | 2;
}

export function ProcessScrollCard({
  children,
  className,
  index,
}: ProcessScrollCardProps) {
  const scrollYProgress = useContext(ProcessScrollContext);
  const prefersReducedMotion = useReducedMotion();
  const desktopMotion = useDesktopMotion();
  const fallbackProgress = useMotionValue(1);
  const progress = scrollYProgress ?? fallbackProgress;
  const reveal = CARD_REVEALS[index];
  const x = useTransform(progress, reveal.xInput, reveal.xOutput);
  const opacity = useTransform(
    progress,
    reveal.opacityInput,
    reveal.opacityOutput,
  );
  const enabled = desktopMotion && !prefersReducedMotion;

  return (
    <motion.div
      className={cn("h-full lg:will-change-transform", className)}
      data-process-card={index}
      style={enabled ? { opacity, x } : undefined}
    >
      {children}
    </motion.div>
  );
}

function useDesktopMotion() {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setMatches(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return matches;
}
