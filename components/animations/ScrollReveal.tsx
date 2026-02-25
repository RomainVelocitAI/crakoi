"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Preset = "fadeUp" | "scaleIn" | "slideLeft" | "slideRight";

const presetVariants: Record<Preset, { initial: Record<string, number>; animate: Record<string, number> }> = {
  fadeUp: { initial: { y: 60, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  scaleIn: { initial: { scale: 0.85, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
  slideLeft: { initial: { x: -80, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  slideRight: { initial: { x: 80, opacity: 0 }, animate: { x: 0, opacity: 1 } },
};

interface ScrollRevealProps {
  children: React.ReactNode;
  preset?: Preset;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  preset = "fadeUp",
  delay = 0,
  duration = 1,
  className,
}: ScrollRevealProps) {
  const v = presetVariants[preset];

  return (
    <motion.div
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
