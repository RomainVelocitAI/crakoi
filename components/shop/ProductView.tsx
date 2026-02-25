"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { MapPin, Calendar, Camera } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { MOCKUP_TEMPLATES } from "@/lib/mockup/templates";
import MockupTemplate from "@/components/mockup/MockupTemplate";
import SizeSelector, { type SizeVariant } from "./SizeSelector";
import AddToCartButton from "./AddToCartButton";

// ---------- Types ----------

interface PhotoCategory {
  categories: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductPhoto {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string;
  location: string | null;
  taken_at: string | null;
  camera_info: string | null;
  meta_title: string | null;
  meta_description: string | null;
  photo_variants: SizeVariant[];
  photo_categories: PhotoCategory[];
}

export interface RelatedPhoto {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  thumbnail_url: string;
  location: string | null;
  photo_variants: Array<{ price: number }>;
}

interface ProductViewProps {
  photo: ProductPhoto;
  relatedPhotos: RelatedPhoto[];
}

// ---------- Component ----------

export default function ProductView({ photo, relatedPhotos }: ProductViewProps) {
  const t = useTranslations("product");

  const [activeTab, setActiveTab] = useState<"photo" | "mockup">("photo");
  const [selectedVariant, setSelectedVariant] = useState<SizeVariant | null>(
    photo.photo_variants.length > 0
      ? [...photo.photo_variants].sort((a, b) => a.price - b.price)[0]
      : null
  );

  // Mockup templates filtered to available variant sizes
  const availableMockups = useMemo(() => {
    const sizeNames = photo.photo_variants.map((v) => v.sizes.name);
    return MOCKUP_TEMPLATES.filter((tpl) => sizeNames.includes(tpl.sizeName));
  }, [photo.photo_variants]);

  // Currently selected mockup template (matching selected size)
  const selectedMockup = useMemo(() => {
    if (!selectedVariant) return availableMockups[0] || null;
    return (
      availableMockups.find(
        (tpl) => tpl.sizeName === selectedVariant.sizes.name
      ) ||
      availableMockups[0] ||
      null
    );
  }, [selectedVariant, availableMockups]);

  // Format taken_at date for display
  const formattedDate = useMemo(() => {
    if (!photo.taken_at) return null;
    try {
      return new Date(photo.taken_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return photo.taken_at;
    }
  }, [photo.taken_at]);

  return (
    <div className="pt-24">
      {/* Main product section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          {/* LEFT COLUMN — Photo / Mockup (60%) */}
          <div className="lg:col-span-3">
            {/* Tab navigation */}
            <div className="mb-6 flex gap-1 rounded-lg bg-surface p-1">
              <TabButton
                active={activeTab === "photo"}
                onClick={() => setActiveTab("photo")}
              >
                {t("tabPhoto")}
              </TabButton>
              <TabButton
                active={activeTab === "mockup"}
                onClick={() => setActiveTab("mockup")}
              >
                {t("tabMockup")}
              </TabButton>
            </div>

            {/* Tab content */}
            {activeTab === "photo" ? (
              <PhotoViewer imageUrl={photo.image_url} alt={photo.title} />
            ) : (
              <MockupPanel
                photoUrl={photo.image_url}
                photoAlt={photo.title}
                mockups={availableMockups}
                selectedMockup={selectedMockup}
                variants={photo.photo_variants}
              />
            )}
          </div>

          {/* RIGHT COLUMN — Info + Purchase (40%) */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 space-y-8">
              {/* Title */}
              <div>
                <h1 className="font-serif text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
                  {photo.title}
                </h1>

                {/* Categories */}
                {photo.photo_categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {photo.photo_categories.map((pc) => (
                      <Link
                        key={pc.categories.id}
                        href="/gallery"
                        className="rounded-full border border-border px-3 py-1 font-sans text-xs text-text-muted transition-colors hover:border-gold hover:text-gold"
                      >
                        {pc.categories.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Metadata — Location, Date, Camera */}
              {(photo.location || formattedDate || photo.camera_info) && (
                <div className="space-y-2">
                  {photo.location && (
                    <MetadataRow
                      icon={<MapPin className="h-4 w-4" />}
                      label={t("location")}
                      value={photo.location}
                    />
                  )}
                  {formattedDate && (
                    <MetadataRow
                      icon={<Calendar className="h-4 w-4" />}
                      label={t("date")}
                      value={formattedDate}
                    />
                  )}
                  {photo.camera_info && (
                    <MetadataRow
                      icon={<Camera className="h-4 w-4" />}
                      label={t("camera")}
                      value={photo.camera_info}
                    />
                  )}
                </div>
              )}

              {/* Description */}
              {photo.description && (
                <p className="font-sans text-sm leading-relaxed text-text-secondary">
                  {photo.description}
                </p>
              )}

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Size selector */}
              {photo.photo_variants.length > 0 && (
                <SizeSelector
                  variants={photo.photo_variants}
                  selectedVariantId={selectedVariant?.id ?? null}
                  onSelect={setSelectedVariant}
                />
              )}

              {/* Fine Art note */}
              <p className="font-sans text-xs italic text-text-muted">
                {t("fineArt")}
              </p>

              {/* Add to cart */}
              {selectedVariant && (
                <AddToCartButton
                  variantId={selectedVariant.id}
                  photoId={photo.id}
                  photoTitle={photo.title}
                  photoSlug={photo.slug}
                  thumbnailUrl={photo.thumbnail_url}
                  sizeLabel={selectedVariant.sizes.label}
                  price={selectedVariant.price}
                />
              )}

              {!selectedVariant && photo.photo_variants.length > 0 && (
                <AddToCartButton
                  variantId=""
                  photoId={photo.id}
                  photoTitle={photo.title}
                  photoSlug={photo.slug}
                  thumbnailUrl={photo.thumbnail_url}
                  sizeLabel=""
                  price={0}
                  disabled
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related photos */}
      {relatedPhotos.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          <h2 className="mb-10 font-serif text-2xl font-semibold text-text-primary">
            {t("relatedPhotos")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {relatedPhotos.map((related) => (
              <RelatedPhotoCard key={related.id} photo={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ---------- Sub-components ----------

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-md px-4 py-2.5 font-sans text-sm font-medium transition-colors duration-200",
        active
          ? "bg-surface-light text-text-primary"
          : "text-text-muted hover:text-text-secondary"
      )}
    >
      {children}
    </button>
  );
}

function PhotoViewer({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-surface">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>
    </div>
  );
}

function MockupPanel({
  photoUrl,
  photoAlt,
  mockups,
  selectedMockup,
  variants,
}: {
  photoUrl: string;
  photoAlt: string;
  mockups: typeof MOCKUP_TEMPLATES;
  selectedMockup: (typeof MOCKUP_TEMPLATES)[number] | null;
  variants: SizeVariant[];
}) {
  if (!selectedMockup || mockups.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-surface">
        <p className="font-sans text-sm text-text-muted">
          No mockup available
        </p>
      </div>
    );
  }

  const matchedVariant = variants.find(
    (v) => v.sizes.name === selectedMockup.sizeName
  );

  return (
    <div className="space-y-6">
      <MockupTemplate
        template={selectedMockup}
        photoUrl={photoUrl}
        photoAlt={photoAlt}
        sizeLabel={matchedVariant?.sizes.label}
        price={matchedVariant?.price}
        className="rounded-lg"
      />

      {mockups.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {mockups
            .filter((m) => m.id !== selectedMockup.id)
            .map((tpl) => {
              const variant = variants.find(
                (v) => v.sizes.name === tpl.sizeName
              );
              return (
                <MockupTemplate
                  key={tpl.id}
                  template={tpl}
                  photoUrl={photoUrl}
                  photoAlt={photoAlt}
                  sizeLabel={variant?.sizes.label}
                  className="rounded-md opacity-70 transition-opacity hover:opacity-100"
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

function MetadataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 font-sans text-sm">
      <span className="text-text-muted">{icon}</span>
      <span className="text-text-muted">{label}</span>
      <span className="text-text-secondary">{value}</span>
    </div>
  );
}

function RelatedPhotoCard({ photo }: { photo: RelatedPhoto }) {
  const prices = photo.photo_variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <Link href={`/photos/${photo.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface">
        <Image
          src={photo.thumbnail_url || photo.image_url}
          alt={photo.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-serif text-sm font-medium text-text-primary transition-colors group-hover:text-gold">
          {photo.title}
        </h3>
        {photo.location && (
          <p className="font-sans text-xs text-text-muted">{photo.location}</p>
        )}
        {minPrice !== null && (
          <p className="font-sans text-xs text-text-secondary">
            {minPrice.toFixed(2)} &euro;
          </p>
        )}
      </div>
    </Link>
  );
}
