"use client";

import { motion } from "framer-motion";
import { fadeInViewVariants } from "@/lib/animations/variants";
import { cn } from "@/lib/utils/cn";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      variants={fadeInViewVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
