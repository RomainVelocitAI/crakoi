"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import { useRouter } from "@/lib/i18n/navigation";
import { createCheckoutSession } from "./actions";

const COUNTRIES = [
  { value: "FR", label: "France" },
  { value: "RE", label: "La Reunion" },
  { value: "BE", label: "Belgique" },
  { value: "CH", label: "Suisse" },
  { value: "CA", label: "Canada" },
  { value: "LU", label: "Luxembourg" },
  { value: "MC", label: "Monaco" },
  { value: "DE", label: "Allemagne" },
  { value: "ES", label: "Espagne" },
  { value: "IT", label: "Italie" },
  { value: "GB", label: "Royaume-Uni" },
  { value: "US", label: "Etats-Unis" },
];

const inputClassName =
  "w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 transition-colors font-sans";

export default function CheckoutForm() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "FR",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to cart if empty (after mount to avoid SSR mismatch)
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, items.length, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createCheckoutSession({
        ...form,
        items: items.map((item) => ({
          variantId: item.variantId,
          photoId: item.photoId,
          photoTitle: item.photoTitle,
          sizeLabel: item.sizeLabel,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      if (result.success && result.orderNumber) {
        clearCart();
        router.push(
          `/order-confirmation?order_number=${result.orderNumber}`
        );
      }
    } catch {
      setIsSubmitting(false);
    }
  }

  // Don't render until mounted (avoid hydration mismatch with localStorage cart)
  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text-primary mb-10">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Left column -- Shipping form (60%) */}
            <div className="lg:col-span-3">
              <div className="bg-surface rounded-xl border border-border p-6 sm:p-8">
                <h2 className="font-serif text-xl font-semibold text-text-primary mb-6">
                  {t("shipping")}
                </h2>

                <div className="space-y-5">
                  {/* First + Last name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm text-text-secondary mb-1.5 font-sans"
                      >
                        {t("firstName")}
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder={t("firstName")}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm text-text-secondary mb-1.5 font-sans"
                      >
                        {t("lastName")}
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder={t("lastName")}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm text-text-secondary mb-1.5 font-sans"
                      >
                        {t("email")}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t("email")}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm text-text-secondary mb-1.5 font-sans"
                      >
                        {t("phone")}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder={t("phone")}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm text-text-secondary mb-1.5 font-sans"
                    >
                      {t("address")}
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={form.address}
                      onChange={handleChange}
                      placeholder={t("address")}
                      className={inputClassName}
                    />
                  </div>

                  {/* Address line 2 */}
                  <div>
                    <label
                      htmlFor="addressLine2"
                      className="block text-sm text-text-secondary mb-1.5 font-sans"
                    >
                      {t("addressLine2")}
                    </label>
                    <input
                      id="addressLine2"
                      name="addressLine2"
                      type="text"
                      value={form.addressLine2}
                      onChange={handleChange}
                      placeholder={t("addressLine2")}
                      className={inputClassName}
                    />
                  </div>

                  {/* City + Postal code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm text-text-secondary mb-1.5 font-sans"
                      >
                        {t("city")}
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={form.city}
                        onChange={handleChange}
                        placeholder={t("city")}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm text-text-secondary mb-1.5 font-sans"
                      >
                        {t("postalCode")}
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        required
                        value={form.postalCode}
                        onChange={handleChange}
                        placeholder={t("postalCode")}
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm text-text-secondary mb-1.5 font-sans"
                    >
                      {t("country")}
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={form.country}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit button -- visible on mobile below form */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full bg-gold hover:bg-gold-light text-background font-semibold py-3.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans text-base lg:hidden"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      {t("pay")}...
                    </span>
                  ) : (
                    `${t("pay")} — ${subtotal.toFixed(2)} \u20AC`
                  )}
                </button>
              </div>
            </div>

            {/* Right column -- Order summary (40%) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28">
                <div className="bg-surface rounded-xl border border-border p-6 sm:p-8">
                  <h2 className="font-serif text-xl font-semibold text-text-primary mb-6">
                    {t("summary")}
                  </h2>

                  {/* Items list */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.variantId}
                        className="flex gap-4 items-start"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-light">
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.photoTitle}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                          {/* Quantity badge */}
                          {item.quantity > 1 && (
                            <span className="absolute -top-1 -right-1 bg-gold text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                              {item.quantity}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary font-medium truncate">
                            {item.photoTitle}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {item.sizeLabel}
                            {item.quantity > 1 && ` x${item.quantity}`}
                          </p>
                        </div>

                        {/* Line total */}
                        <p className="text-sm text-text-primary font-medium whitespace-nowrap">
                          {(item.price * item.quantity).toFixed(2)} &euro;
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border pt-4 space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {tCart("subtotal")}
                      </span>
                      <span className="text-text-primary">
                        {subtotal.toFixed(2)} &euro;
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {tCart("shipping")}
                      </span>
                      <span className="text-text-muted italic">
                        &Agrave; calculer
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-text-primary">
                          {tCart("total")}
                        </span>
                        <span className="text-base font-semibold text-gold">
                          {subtotal.toFixed(2)} &euro;
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit button -- desktop only */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 w-full bg-gold hover:bg-gold-light text-background font-semibold py-3.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans text-base hidden lg:block"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        {t("pay")}...
                      </span>
                    ) : (
                      t("pay")
                    )}
                  </button>

                  {/* Guest checkout hint */}
                  <p className="mt-4 text-xs text-text-muted text-center">
                    {t("guestCheckout")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
