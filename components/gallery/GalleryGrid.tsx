"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import PhotoCard, { type PhotoCardData } from "./PhotoCard";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface GalleryGridProps {
  photos: PhotoCardData[];
  categories: Category[];
  showFilters?: boolean;
}

export default function GalleryGrid({
  photos,
  categories,
  showFilters = true,
}: GalleryGridProps) {
  const t = useTranslations("gallery");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (categoryId: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const clearFilters = () => setActiveCategories(new Set());

  const filteredPhotos = useMemo(() => {
    if (activeCategories.size === 0) return photos;
    return photos.filter((photo) =>
      photo.categoryIds.some((id) => activeCategories.has(id))
    );
  }, [photos, activeCategories]);

  return (
    <div>
      {/* Category filter tabs */}
      {showFilters && categories.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* "All" tab */}
            <button
              onClick={clearFilters}
              className={cn(
                "relative font-mono text-xs tracking-[0.2em] uppercase px-4 py-2.5 border-b-2 transition-colors duration-300",
                activeCategories.size === 0
                  ? "text-gold border-gold"
                  : "text-text-secondary border-transparent hover:text-white"
              )}
            >
              {t("all")}
            </button>

            {categories.map((category) => {
              const isActive = activeCategories.has(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "relative font-mono text-xs tracking-[0.2em] uppercase px-4 py-2.5 border-b-2 transition-colors duration-300",
                    isActive
                      ? "text-gold border-gold"
                      : "text-text-secondary border-transparent hover:text-white"
                  )}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Subtle divider */}
          <div className="mt-4 h-px bg-white/5" />
        </div>
      )}

      {/* Photo grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="font-sans text-text-secondary text-base">
            {t("noResults")}
          </p>
        </div>
      )}
    </div>
  );
}
