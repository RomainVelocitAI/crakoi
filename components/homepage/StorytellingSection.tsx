"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface StoryBlockProps {
  heading: string;
  text: string;
  imageSrc: string;
  imagePosition: "left" | "right";
  index: number;
}

function StoryBlock({
  heading,
  text,
  imageSrc,
  imagePosition,
  index,
}: StoryBlockProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-24 lg:py-32",
        imagePosition === "right" && "lg:[direction:rtl]"
      )}
    >
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, clipPath: imagePosition === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0%)" }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        className={cn(
          "relative overflow-hidden aspect-[3/4] lg:aspect-[4/5]",
          "lg:[direction:ltr]"
        )}
      >
        <img
          src={imageSrc}
          alt={heading}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </motion.div>

      {/* Text */}
      <div className="lg:[direction:ltr] flex flex-col justify-center">
        {/* Index number */}
        <span className="font-mono text-xs text-gold/50 tracking-[0.4em] uppercase mb-6">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Heading */}
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-primary font-medium leading-tight mb-8"
        >
          {heading}
        </motion.h2>

        {/* Text */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <p className="text-base lg:text-lg text-text-secondary leading-relaxed font-sans">
            {text}
          </p>
          {/* Decorative line */}
          <div className="mt-8 w-16 h-[1px] bg-gradient-to-r from-gold/60 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

// Placeholder images for storytelling
const STORY_IMAGES = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
  "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80",
  "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&q=80",
];

export default function StorytellingSection() {
  const t = useTranslations("homepage.storytelling");

  const blocks = [
    { heading: t("block1.heading"), text: t("block1.text") },
    { heading: t("block2.heading"), text: t("block2.text") },
    { heading: t("block3.heading"), text: t("block3.text") },
    { heading: t("block4.heading"), text: t("block4.text") },
  ];

  return (
    <section className="relative bg-background">
      {/* Top separator — gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-gold/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-32">
        {blocks.map((block, i) => (
          <StoryBlock
            key={i}
            heading={block.heading}
            text={block.text}
            imageSrc={STORY_IMAGES[i]}
            imagePosition={i % 2 === 0 ? "left" : "right"}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
