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

const CARD_START_X = [-420, -315, -210] as const;

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
        className="relative lg:min-h-[185vh] motion-reduce:lg:min-h-0"
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
  const x = useTransform(progress, [0.08, 0.82], [CARD_START_X[index], 0]);
  const enabled = desktopMotion && !prefersReducedMotion;

  return (
    <motion.div
      className={cn("h-full lg:will-change-transform", className)}
      style={enabled ? { x } : undefined}
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
