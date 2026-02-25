"use client";

import Image from "next/image";
import type { MockupTemplate as MockupTemplateType } from "@/types/mockup";
import { cn } from "@/lib/utils/cn";

interface MockupTemplateProps {
  template: MockupTemplateType;
  photoUrl: string;
  photoAlt: string;
  sizeLabel?: string;
  price?: number;
  className?: string;
  onClick?: () => void;
}

export default function MockupTemplate({
  template,
  photoUrl,
  photoAlt,
  sizeLabel,
  price,
  className,
  onClick,
}: MockupTemplateProps) {
  const { frameZone, shadowConfig } = template;

  const photoStyle: React.CSSProperties = {
    position: "absolute",
    left: `${frameZone.x}%`,
    top: `${frameZone.y}%`,
    width: `${frameZone.width}%`,
    height: `${frameZone.height}%`,
    transform: [
      frameZone.perspective ? `perspective(${frameZone.perspective}px)` : "",
      frameZone.rotateX ? `rotateX(${frameZone.rotateX}deg)` : "",
      frameZone.rotateY ? `rotateY(${frameZone.rotateY}deg)` : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined,
    overflow: "hidden",
    boxShadow: shadowConfig
      ? `${shadowConfig.offsetX}px ${shadowConfig.offsetY}px ${shadowConfig.blur}px ${shadowConfig.color}`
      : undefined,
  };

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      {/* Template background (room scene) — natural aspect ratio */}
      <div className="relative w-full">
        <Image
          src={template.templateImageUrl}
          alt={template.label}
          width={template.imageWidth || 2720}
          height={template.imageHeight || 1568}
          className="w-full h-auto block"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Photo overlay positioned to match frame zone */}
        <div style={photoStyle}>
          <Image
            src={photoUrl}
            alt={photoAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Label */}
      {(sizeLabel || price) && (
        <div className="mt-3 flex items-center justify-between">
          {sizeLabel && (
            <span className="text-sm font-sans text-text-secondary">
              {template.label}{" "}
              <span className="text-text-muted">— {sizeLabel}</span>
            </span>
          )}
          {price && (
            <span className="text-sm font-sans text-gold">
              {price.toFixed(2)} €
            </span>
          )}
        </div>
      )}
    </div>
  );
}
