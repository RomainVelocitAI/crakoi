"use client";

import { cn } from "@/lib/utils/cn";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  splitBy?: "word" | "char";
  className?: string;
  delay?: number;
}

export default function TextReveal({
  text,
  as: Tag = "h2",
  className,
}: TextRevealProps) {
  return <Tag className={cn(className)}>{text}</Tag>;
}
