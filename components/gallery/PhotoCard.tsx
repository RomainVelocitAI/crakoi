"use client";

import Image from "next/image";
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
  onClick?: () => void;
}

export default function PhotoCard({ photo, className, onClick }: PhotoCardProps) {
  const displayImage = photo.thumbnailUrl || photo.imageUrl;

  return (
    <div className={cn("group cursor-pointer", className)} onClick={onClick}>
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
          <h3 className="font-serif text-lg text-white font-medium leading-tight">
            {photo.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
