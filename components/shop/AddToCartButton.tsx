"use client";

import { useState, useCallback } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import { cn } from "@/lib/utils/cn";

interface AddToCartButtonProps {
  variantId: string;
  photoId: string;
  photoTitle: string;
  photoSlug: string;
  thumbnailUrl: string;
  sizeLabel: string;
  price: number;
  disabled?: boolean;
  className?: string;
}

export default function AddToCartButton({
  variantId,
  photoId,
  photoTitle,
  photoSlug,
  thumbnailUrl,
  sizeLabel,
  price,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const t = useTranslations("product");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    if (disabled || added) return;

    addItem({
      variantId,
      photoId,
      photoTitle,
      photoSlug,
      thumbnailUrl,
      sizeLabel,
      price,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [
    disabled,
    added,
    addItem,
    variantId,
    photoId,
    photoTitle,
    photoSlug,
    thumbnailUrl,
    sizeLabel,
    price,
  ]);

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className={cn(
        "relative flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wider transition-all duration-300 active:scale-[0.98]",
        added
          ? "bg-emerald-600 text-white"
          : disabled
            ? "cursor-not-allowed bg-surface text-text-muted"
            : "bg-gold text-background hover:bg-gold-dark",
        className
      )}
    >
      {added ? (
        <span className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          {t("added")}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          {t("addToCart")}
        </span>
      )}
    </button>
  );
}
