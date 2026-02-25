"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import TextReveal from "@/components/animations/TextReveal";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImageUrl: string;
  photoCount?: number;
}

// Demo categories
const DEMO_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Sous l'eau",
    slug: "sous-leau",
    description: "Baleines, dauphins et vie marine",
    coverImageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    photoCount: 24,
  },
  {
    id: "2",
    name: "Sur terre",
    slug: "sur-terre",
    description: "Paysages et nature de La Réunion",
    coverImageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    photoCount: 18,
  },
  {
    id: "3",
    name: "Aérien",
    slug: "aerien",
    description: "La Réunion vue du ciel",
    coverImageUrl:
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80",
    photoCount: 12,
  },
];

function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  return (
    <Link href="/gallery">
      <motion.div
        className="group relative overflow-hidden cursor-pointer"
        style={{ aspectRatio: index === 0 ? "3/4" : "4/5" }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={category.coverImageUrl}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
          {/* Category number */}
          <span className="font-mono text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-2">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Name */}
          <h3 className="font-serif text-2xl lg:text-3xl text-white font-medium mb-2 transition-transform duration-500 group-hover:translate-x-2">
            {category.name}
          </h3>

          {/* Description + count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary font-sans opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              {category.description}
            </p>
            {category.photoCount && (
              <span className="font-mono text-xs text-text-muted">
                {category.photoCount} photos
              </span>
            )}
          </div>

          {/* Hover line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        </div>
      </motion.div>
    </Link>
  );
}

export default function CategoriesSection({
  categories = DEMO_CATEGORIES,
}: {
  categories?: Category[];
}) {
  const t = useTranslations("homepage.categories");

  return (
    <section className="relative bg-background py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 lg:mb-24 text-center">
          <span className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase mb-4 block">
            Collections
          </span>
          <TextReveal
            text={t("heading")}
            as="h2"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-text-primary font-medium"
          />
          <p className="mt-4 text-text-secondary font-sans text-base max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid: first card larger, others smaller */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className={cn(
                i === 0 && "md:col-span-2 lg:col-span-1 lg:row-span-2"
              )}
            >
              <CategoryCard category={cat} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
