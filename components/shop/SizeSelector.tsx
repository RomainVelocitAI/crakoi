"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export interface SizeVariant {
  id: string;
  price: number;
  sizes: {
    id: string;
    name: string;
    label: string;
    width_cm: number;
    height_cm: number;
  };
}

interface SizeSelectorProps {
  variants: SizeVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: SizeVariant) => void;
}

export default function SizeSelector({
  variants,
  selectedVariantId,
  onSelect,
}: SizeSelectorProps) {
  const t = useTranslations("product");

  // Sort by price ascending (S < M < L < XL)
  const sorted = [...variants].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-3">
      <h3 className="font-sans text-sm font-medium uppercase tracking-wider text-text-secondary">
        {t("selectSize")}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {sorted.map((variant) => {
          const isSelected = selectedVariantId === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant)}
              className={cn(
                "relative flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-all duration-200 active:scale-[0.97]",
                isSelected
                  ? "border-gold border-2 bg-gold/5"
                  : "border-border bg-surface hover:border-text-muted"
              )}
            >
              {/* Size name */}
              <span
                className={cn(
                  "font-serif text-lg font-semibold",
                  isSelected ? "text-gold" : "text-text-primary"
                )}
              >
                {variant.sizes.label}
              </span>

              {/* Dimensions */}
              <span className="font-sans text-xs text-text-muted">
                {t("dimensions", {
                  width: variant.sizes.width_cm,
                  height: variant.sizes.height_cm,
                })}
              </span>

              {/* Price */}
              <span
                className={cn(
                  "mt-1 font-sans text-sm font-medium",
                  isSelected ? "text-gold" : "text-text-secondary"
                )}
              >
                {variant.price.toFixed(2)} &euro;
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
