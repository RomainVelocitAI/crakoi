"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export interface PhotoCardData {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  location: string | null;
  minPrice: number;
  categoryIds: string[];
}

interface PhotoCardProps {
  photo: PhotoCardData;
  className?: string;
}

export default function PhotoCard({ photo, className }: PhotoCardProps) {
  const t = useTranslations("gallery");

  const displayImage = photo.thumbnailUrl || photo.imageUrl;

  return (
    <div className={cn("group", className)}>
      <Link href={`/photos/${photo.slug}`} className="block">
        <div className="relative overflow-hidden rounded-sm bg-surface">
          {/* Image container */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={displayImage}
              alt={photo.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/40" />

            {/* Hover text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-white border border-white/40 px-5 py-2.5 backdrop-blur-sm">
                {t("viewPhoto")}
              </span>
            </div>
          </div>

          {/* Bottom gradient for text readability */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

          {/* Info overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {photo.location && (
              <p className="font-mono text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-1">
                {photo.location}
              </p>
            )}
            <h3 className="font-serif text-lg text-white font-medium leading-tight mb-1">
              {photo.title}
            </h3>
            {photo.minPrice > 0 && (
              <p className="font-sans text-sm text-text-muted">
                A partir de {photo.minPrice} &euro;
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
