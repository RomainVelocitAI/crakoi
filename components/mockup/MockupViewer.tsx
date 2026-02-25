"use client";

import { MOCKUP_TEMPLATES } from "@/lib/mockup/templates";
import MockupTemplate from "./MockupTemplate";
import { cn } from "@/lib/utils/cn";

interface MockupViewerProps {
  photoUrl: string;
  photoAlt: string;
  /** Available variants with size info */
  variants?: Array<{
    sizeName: string;
    sizeLabel: string;
    price: number;
  }>;
  className?: string;
}

export default function MockupViewer({
  photoUrl,
  photoAlt,
  variants = [],
  className,
}: MockupViewerProps) {
  // Filter templates to only show sizes that have available variants
  const availableTemplates = variants.length > 0
    ? MOCKUP_TEMPLATES.filter((t) =>
        variants.some((v) => v.sizeName === t.sizeName)
      )
    : MOCKUP_TEMPLATES;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {availableTemplates.map((template) => {
        const variant = variants.find((v) => v.sizeName === template.sizeName);

        return (
          <MockupTemplate
            key={template.id}
            template={template}
            photoUrl={photoUrl}
            photoAlt={photoAlt}
            sizeLabel={variant?.sizeLabel}
            price={variant?.price}
          />
        );
      })}
    </div>
  );
}
