"use client";

import { motion } from "framer-motion";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";
import { cn } from "@/lib/utils/cn";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

export default function StaggerReveal({
  children,
  className,
  delay = 0,
  stagger = 0.08,
}: StaggerRevealProps) {
  return (
    <motion.div
      variants={{
        ...staggerContainerVariants,
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}
