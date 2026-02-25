"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import TextReveal from "@/components/animations/TextReveal";
import { cn } from "@/lib/utils/cn";
import { ArrowRight } from "lucide-react";

interface FeaturedPhoto {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  location: string;
  minPrice: number;
}

const DEMO_PHOTOS: FeaturedPhoto[] = [
  {
    id: "1",
    title: "Le Souffle",
    slug: "le-souffle",
    imageUrl: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=600&q=80",
    location: "Océan Indien",
    minPrice: 89,
  },
  {
    id: "2",
    title: "Profondeurs",
    slug: "profondeurs",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80",
    location: "La Réunion",
    minPrice: 120,
  },
  {
    id: "3",
    title: "Danse Bleue",
    slug: "danse-bleue",
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&q=80",
    location: "Saint-Gilles",
    minPrice: 95,
  },
  {
    id: "4",
    title: "Rencontre",
    slug: "rencontre",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    location: "Passe de l'Hermitage",
    minPrice: 150,
  },
  {
    id: "5",
    title: "L'Aube",
    slug: "l-aube",
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80",
    location: "Piton de la Fournaise",
    minPrice: 110,
  },
];

function FeaturedPhotoCard({
  photo,
  position,
  isActive,
  onClick,
}: {
  photo: FeaturedPhoto;
  position: number; // -2, -1, 0, 1, 2
  isActive: boolean;
  onClick: () => void;
}) {
  // Calculate transform based on position
  const getTransform = (pos: number) => {
    const absPos = Math.abs(pos);
    return {
      x: pos * 140,
      y: absPos * 12,
      scale: 1 - absPos * 0.08,
      rotateZ: pos * 4,
      zIndex: 10 - absPos * 2,
      opacity: 1 - absPos * 0.25,
    };
  };

  const transform = getTransform(position);

  return (
    <motion.div
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[340px] md:w-[380px] cursor-pointer",
        isActive && "cursor-default"
      )}
      animate={{
        x: `calc(-50% + ${transform.x}px)`,
        y: `calc(-50% + ${transform.y}px)`,
        scale: transform.scale,
        rotateZ: transform.rotateZ,
        opacity: transform.opacity,
        zIndex: transform.zIndex,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 28,
        mass: 0.8,
      }}
      onClick={onClick}
      whileHover={isActive ? { y: `calc(-50% + ${transform.y - 8}px)` } : {}}
    >
      <div className="relative overflow-hidden rounded-sm bg-surface shadow-2xl shadow-black/40">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Card info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-mono text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-1">
            {photo.location}
          </p>
          <h3 className="font-serif text-xl text-white font-medium mb-1">
            {photo.title}
          </h3>
          <p className="font-sans text-sm text-text-muted">
            À partir de {photo.minPrice} €
          </p>
        </div>

        {/* Active indicator — gold border on bottom */}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold transition-opacity duration-300" />
        )}
      </div>
    </motion.div>
  );
}

export default function FeaturedPhotosSection({
  photos = DEMO_PHOTOS,
}: {
  photos?: FeaturedPhoto[];
}) {
  const t = useTranslations("homepage.featured");
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      if (direction === "next") {
        setActiveIndex((prev) => (prev + 1) % photos.length);
      } else {
        setActiveIndex(
          (prev) => (prev - 1 + photos.length) % photos.length
        );
      }
    },
    [photos.length]
  );

  return (
    <section className="relative bg-background py-32 lg:py-40 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.02] blur-[120px]" />
      </div>

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        {/* Section header */}
        <div className="mb-20 lg:mb-28 text-center">
          <span className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase mb-4 block">
            Sélection
          </span>
          <TextReveal
            text={t("heading")}
            as="h2"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-text-primary font-medium"
          />
          <p className="mt-4 text-text-secondary font-sans text-base">
            {t("subtitle")}
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative h-[520px] sm:h-[580px] md:h-[620px] mb-16">
          {photos.map((photo, i) => {
            // Calculate relative position to active
            let position = i - activeIndex;
            if (position > Math.floor(photos.length / 2)) position -= photos.length;
            if (position < -Math.floor(photos.length / 2)) position += photos.length;

            // Only render cards within range
            if (Math.abs(position) > 2) return null;

            return (
              <FeaturedPhotoCard
                key={photo.id}
                photo={photo}
                position={position}
                isActive={position === 0}
                onClick={() => setActiveIndex(i)}
              />
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => navigate("prev")}
            className="w-12 h-12 rounded-full border border-white/10 hover:border-gold/40 flex items-center justify-center text-text-secondary hover:text-gold transition-all duration-300"
            aria-label="Previous"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M16 6H2M2 6L7 1M2 6L7 11" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "bg-gold w-6"
                    : "bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate("next")}
            className="w-12 h-12 rounded-full border border-white/10 hover:border-gold/40 flex items-center justify-center text-text-secondary hover:text-gold transition-all duration-300"
            aria-label="Next"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M0 6H14M14 6L9 1M14 6L9 11" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 font-sans text-sm uppercase tracking-[0.2em] text-text-secondary hover:text-gold transition-colors duration-300"
          >
            <span>{t("cta")}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
