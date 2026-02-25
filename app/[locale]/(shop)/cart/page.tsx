"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { ShoppingBag, Minus, Plus, X, ArrowRight, Tag } from "lucide-react";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-8">
              <ShoppingBag className="w-8 h-8 text-text-muted" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-4">
              {t("empty")}
            </h1>
            <p className="text-text-secondary font-sans text-lg mb-10 max-w-md">
              {t("emptySubtitle")}
            </p>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-background font-sans text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-lg transition-colors duration-300"
            >
              <span>{t("continueShopping")}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-20">
        {/* Page title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-medium mb-12 lg:mb-16"
        >
          {t("title")}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left column: Cart items */}
          <div className="lg:col-span-2">
            {/* Header row (desktop) */}
            <div className="hidden md:grid grid-cols-[1fr_120px_140px_40px] gap-4 pb-4 border-b border-border/50 mb-6">
              <span className="text-xs font-sans uppercase tracking-widest text-text-muted">
                {t("title")}
              </span>
              <span className="text-xs font-sans uppercase tracking-widest text-text-muted text-center">
                {t("quantity")}
              </span>
              <span className="text-xs font-sans uppercase tracking-widest text-text-muted text-right">
                {t("total")}
              </span>
              <span />
            </div>

            {/* Items list */}
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.variantId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                  className="group grid grid-cols-1 md:grid-cols-[1fr_120px_140px_40px] gap-4 md:gap-4 items-center py-6 border-b border-border/30"
                >
                  {/* Photo info */}
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/photos/${item.photoSlug}`}
                      className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-surface flex-shrink-0"
                    >
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.photoTitle}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="80px"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/photos/${item.photoSlug}`}
                        className="font-serif text-base md:text-lg text-white hover:text-gold transition-colors duration-300 line-clamp-1"
                      >
                        {item.photoTitle}
                      </Link>
                      <p className="font-sans text-sm text-text-muted mt-1">
                        {item.sizeLabel}
                      </p>
                      <p className="font-sans text-sm text-text-secondary mt-0.5 md:hidden">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-white hover:bg-surface transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 h-9 flex items-center justify-center font-sans text-sm text-white bg-surface/50 border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-white hover:bg-surface transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="hidden md:block text-right">
                    <span className="font-sans text-base text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove button */}
                  <div className="absolute right-0 md:relative md:right-auto flex justify-end">
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-surface"
                      aria-label={t("remove")}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue shopping link */}
            <div className="mt-8">
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-gold transition-colors duration-300"
              >
                <ArrowRight className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                <span>{t("continueShopping")}</span>
              </Link>
            </div>
          </div>

          {/* Right column: Order summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-surface rounded-2xl p-6 lg:p-8 border border-border/50 sticky top-28"
            >
              <h2 className="font-serif text-xl text-white font-medium mb-6">
                {t("summary")}
              </h2>

              {/* Promo code */}
              <div className="mb-6">
                <label className="block font-sans text-xs uppercase tracking-widest text-text-muted mb-2">
                  {t("promoCode")}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="CRACK20"
                      className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors font-sans"
                    />
                  </div>
                  <button className="bg-surface-light hover:bg-border text-text-secondary hover:text-white font-sans text-sm px-4 py-3 rounded-lg border border-border transition-colors duration-300">
                    {t("apply")}
                  </button>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-4 border-t border-border/50 pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-text-secondary">
                    {t("subtotal")}
                  </span>
                  <span className="font-sans text-sm text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-text-secondary">
                    {t("shipping")}
                  </span>
                  <span className="font-sans text-xs text-text-muted italic">
                    {t("shippingNote")}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-border/50">
                <span className="font-serif text-lg text-white font-medium">
                  {t("total")}
                </span>
                <span className="font-serif text-2xl text-white font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                className="group flex items-center justify-center gap-3 w-full bg-gold hover:bg-gold-light text-background font-sans text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-lg transition-colors duration-300 mt-8"
              >
                <span>{t("checkout")}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
