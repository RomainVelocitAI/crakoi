"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  href: string;
}

// Demo slides — will be replaced by real data from Supabase
const DEMO_SLIDES: HeroSlide[] = [
  {
    id: "1",
    title: "Le Souffle",
    location: "Océan Indien, La Réunion",
    imageUrl: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1920&q=80",
    href: "/photos/le-souffle",
  },
  {
    id: "2",
    title: "Rencontre",
    location: "Au large de Saint-Gilles",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80",
    href: "/photos/rencontre",
  },
  {
    id: "3",
    title: "Profondeurs",
    location: "Récif corallien, La Réunion",
    imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1920&q=80",
    href: "/photos/profondeurs",
  },
  {
    id: "4",
    title: "L'Envol",
    location: "Piton de la Fournaise",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80",
    href: "/photos/l-envol",
  },
  {
    id: "5",
    title: "Danse Bleue",
    location: "Passe de l'Hermitage",
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&q=80",
    href: "/photos/danse-bleue",
  },
];

const SLIDE_DURATION = 6000; // 6 seconds per slide

export default function HeroSection({
  slides = DEMO_SLIDES,
}: {
  slides?: HeroSlide[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const progressInterval = useRef<ReturnType<typeof setInterval>>();
  const autoAdvanceTimeout = useRef<ReturnType<typeof setTimeout>>();

  const total = slides.length;

  // Navigate to slide
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex(index);
        setProgress(0);
        setIsTransitioning(false);
      }, 450);
    },
    [currentIndex, isTransitioning]
  );

  // Auto-advance
  useEffect(() => {
    const startProgress = () => {
      setProgress(0);
      clearInterval(progressInterval.current);

      let elapsed = 0;
      progressInterval.current = setInterval(() => {
        elapsed += 50;
        setProgress(elapsed / SLIDE_DURATION);

        if (elapsed >= SLIDE_DURATION) {
          clearInterval(progressInterval.current);
          const nextIndex = (currentIndex + 1) % total;
          goToSlide(nextIndex);
        }
      }, 50);
    };

    startProgress();

    return () => {
      clearInterval(progressInterval.current);
      clearTimeout(autoAdvanceTimeout.current);
    };
  }, [currentIndex, total, goToSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Images with crossfade */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === currentIndex ? 1 : 0 }}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* Cinematic overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Film grain effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Slide Counter — top left */}
      <div className="absolute top-28 left-8 md:left-12 z-20">
        <div className="flex items-baseline gap-1 font-mono text-sm tracking-wider">
          <motion.span
            key={`num-${currentIndex}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-gold text-lg font-medium"
          >
            {String(currentIndex + 1).padStart(2, "0")}
          </motion.span>
          <span className="text-text-muted mx-1">/</span>
          <span className="text-text-muted">
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Navigation Dots — bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative h-[2px] transition-all duration-500",
              index === currentIndex ? "w-16" : "w-8 hover:w-12"
            )}
            aria-label={`Slide ${index + 1}`}
          >
            {/* Background track */}
            <div className="absolute inset-0 bg-white/20 rounded-full" />
            {/* Progress fill */}
            {index === currentIndex && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-gold rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            )}
            {/* Completed indicator */}
            {index < currentIndex && (
              <div className="absolute inset-0 bg-white/50 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-white/30" />
      </motion.div>

      {/* Decorative vertical line — left */}
      <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Decorative vertical line — right */}
      <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}
