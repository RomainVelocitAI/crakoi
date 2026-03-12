"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import SortableList, { type DragHandleProps, DragHandle } from "./SortableList";

interface HeaderPhoto {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  image_url: string | null;
  header_order: number | null;
}

interface HeaderPhotosClientProps {
  photos: HeaderPhoto[];
  reorderAction: (orderedIds: string[]) => Promise<{ success?: boolean; error?: string }>;
}

export default function HeaderPhotosClient({
  photos,
  reorderAction,
}: HeaderPhotosClientProps) {
  return (
    <SortableList
      items={photos}
      onReorder={reorderAction}
      renderItem={(photo, dragHandleProps) => (
        <HeaderPhotoCard photo={photo} dragHandleProps={dragHandleProps} />
      )}
    />
  );
}

function HeaderPhotoCard({
  photo,
  dragHandleProps,
}: {
  photo: HeaderPhoto;
  dragHandleProps: DragHandleProps;
}) {
  const displayImage = photo.thumbnail_url || photo.image_url;

  return (
    <div className="flex items-center gap-4 bg-surface border border-border rounded-lg p-3 hover:border-border/80 transition-colors">
      <DragHandle {...dragHandleProps} />

      {/* Thumbnail */}
      <div className="relative w-40 aspect-video rounded overflow-hidden bg-background shrink-0">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={photo.title}
            fill
            className="object-cover"
            sizes="160px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-6 w-6 text-text-muted" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {photo.title}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{photo.slug}</p>
      </div>

      {/* Order badge */}
      <div className="shrink-0 text-xs text-text-muted bg-background px-2 py-1 rounded">
        #{(photo.header_order ?? 0) + 1}
      </div>
    </div>
  );
}
