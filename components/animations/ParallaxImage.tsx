"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export default function ParallaxImage({
  src,
  alt,
  className,
  fill = true,
  width,
  height,
}: ParallaxImageProps) {
  return (
    <div className={cn("overflow-hidden relative", className)}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width!}
          height={height!}
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
}
