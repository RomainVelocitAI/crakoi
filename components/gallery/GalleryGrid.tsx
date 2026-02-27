"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import PhotoCard, { type PhotoCardData } from "./PhotoCard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  coverImageUrl?: string | null;
  description?: string | null;
  photoCount?: number;
}

export type GalleryPhoto = PhotoCardData & { createdAt?: string };

interface GalleryGridProps {
  photos: GalleryPhoto[];
  categories: GalleryCategory[];
  showFilters?: boolean;
}

// ---------------------------------------------------------------------------
// Category grouping helpers
// ---------------------------------------------------------------------------

const SPECIES_KW = [
  "baleine",
  "cachalot",
  "dauphin",
  "tortue",
  "requin",
  "whale",
  "dolphin",
  "turtle",
  "shark",
  "sperm",
];
const DESTINATION_KW = [
  "afrique",
  "africa",
  "madagascar",
  "réunion",
  "reunion",
  "mayotte",
  "rodrigues",
  "maurice",
  "comores",
  "île",
  "island",
];

type CatGroup = "species" | "destinations" | "style";

function getCatGroup(name: string): CatGroup {
  const l = name.toLowerCase();
  if (SPECIES_KW.some((k) => l.includes(k))) return "species";
  if (DESTINATION_KW.some((k) => l.includes(k))) return "destinations";
  return "style";
}

function getCatEmoji(name: string): string {
  const l = name.toLowerCase();
  if (l.includes("baleine") || l.includes("whale")) return "🐋";
  if (l.includes("cachalot") || l.includes("sperm")) return "🐳";
  if (l.includes("dauphin") || l.includes("dolphin")) return "🐬";
  if (l.includes("tortue") || l.includes("turtle")) return "🐢";
  if (l.includes("requin") || l.includes("shark")) return "🦈";
  if (l.includes("afrique") || l.includes("africa")) return "🌍";
  if (l.includes("madagascar")) return "🏝️";
  if (l.includes("réunion") || l.includes("reunion")) return "🌋";
  if (l.includes("noir") || l.includes("black")) return "⬛";
  if (l.includes("faune") || l.includes("marine")) return "🐠";
  if (l.includes("paysage") || l.includes("landscape")) return "🏔️";
  return "📷";
}

// ---------------------------------------------------------------------------
// Sort
// ---------------------------------------------------------------------------

type SortOption = "recent" | "priceAsc" | "priceDesc" | "popular";

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M2 4h12M4 8h8M6 12h4" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M2 2l6 6M8 2l-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 5.5L4 8L8.5 2" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3L5 8l5 5" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <rect x="1" y="1" width="5" height="5" rx="1" />
      <rect x="8" y="1" width="5" height="5" rx="1" />
      <rect x="1" y="8" width="5" height="5" rx="1" />
      <rect x="8" y="8" width="5" height="5" rx="1" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GalleryGrid({
  photos,
  categories,
  showFilters = true,
}: GalleryGridProps) {
  const t = useTranslations("gallery");

  // --- State ---
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set()
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Track carousel scroll position
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [categories]);

  const scrollCarousel = useCallback((dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  // --- Actions ---
  const toggleCategory = useCallback((id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveCategories(new Set());
    setPriceMin("");
    setPriceMax("");
  }, []);

  const hasActiveFilters =
    activeCategories.size > 0 || priceMin !== "" || priceMax !== "";

  // --- Derived data ---
  const groupedCategories = useMemo(() => {
    const g: Record<CatGroup, GalleryCategory[]> = {
      species: [],
      destinations: [],
      style: [],
    };
    categories.forEach((c) => g[getCatGroup(c.name)].push(c));
    return g;
  }, [categories]);

  const orderedCategories = useMemo(
    () => [
      ...groupedCategories.species,
      ...groupedCategories.destinations,
      ...groupedCategories.style,
    ],
    [groupedCategories]
  );

  const filteredPhotos = useMemo(() => {
    let result = photos;

    // Category filter (union)
    if (activeCategories.size > 0) {
      result = result.filter((p) =>
        p.categoryIds.some((id) => activeCategories.has(id))
      );
    }

    // Price filter
    const min = priceMin !== "" ? parseFloat(priceMin) : null;
    const max = priceMax !== "" ? parseFloat(priceMax) : null;
    if (min !== null && !isNaN(min))
      result = result.filter((p) => p.minPrice >= min);
    if (max !== null && !isNaN(max))
      result = result.filter((p) => p.minPrice <= max);

    // Sort
    const sorted = [...result];
    switch (sortBy) {
      case "recent":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      case "priceAsc":
        sorted.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case "popular":
        // No view_count — keep original order
        break;
    }

    return sorted;
  }, [photos, activeCategories, priceMin, priceMax, sortBy]);

  const activeCategoryList = useMemo(
    () => categories.filter((c) => activeCategories.has(c.id)),
    [categories, activeCategories]
  );

  // -------------------------------------------------------------------------
  // No-filters mode (backwards compat for homepage, etc.)
  // -------------------------------------------------------------------------
  if (!showFilters) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Sidebar content (shared between desktop & mobile drawer)
  // -------------------------------------------------------------------------
  const sidebarGroupSection = (
    groupKey: CatGroup,
    cats: GalleryCategory[]
  ) => {
    if (cats.length === 0) return null;
    const labelKey =
      groupKey === "species"
        ? "species"
        : groupKey === "destinations"
          ? "destinations"
          : "style";
    return (
      <div key={groupKey}>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted font-mono mb-3">
          {t(labelKey)}
        </h3>
        <div className="space-y-0.5">
          {cats.map((cat) => {
            const checked = activeCategories.has(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-3 py-2 px-1 rounded-lg cursor-pointer group/cb hover:bg-white/[0.03] transition-colors"
              >
                {/* Custom checkbox */}
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-200",
                    checked
                      ? "border-gold bg-gold text-background"
                      : "border-border bg-surface group-hover/cb:border-text-muted"
                  )}
                >
                  {checked && <CheckIcon />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleCategory(cat.id)}
                  aria-label={cat.name}
                />
                {/* Emoji */}
                <span className="text-sm leading-none select-none">
                  {getCatEmoji(cat.name)}
                </span>
                {/* Name */}
                <span
                  className={cn(
                    "text-sm font-sans flex-1 transition-colors",
                    checked ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {cat.name}
                </span>
                {/* Count */}
                <span className="text-[10px] font-mono text-text-muted tabular-nums">
                  {cat.photoCount ?? 0}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <div className="space-y-6">
      {sidebarGroupSection("species", groupedCategories.species)}
      {groupedCategories.species.length > 0 &&
        (groupedCategories.destinations.length > 0 ||
          groupedCategories.style.length > 0) && (
          <div className="h-px bg-border/30" />
        )}

      {sidebarGroupSection("destinations", groupedCategories.destinations)}
      {groupedCategories.destinations.length > 0 &&
        groupedCategories.style.length > 0 && (
          <div className="h-px bg-border/30" />
        )}

      {sidebarGroupSection("style", groupedCategories.style)}

      {/* Price range */}
      <div className="h-px bg-border/30" />
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted font-mono mb-3">
          {t("priceRange")}
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={t("priceMin")}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
          />
          <span className="text-text-muted text-xs">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={t("priceMax")}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
          />
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            clearFilters();
            setMobileSidebarOpen(false);
          }}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-white hover:border-text-muted transition-colors"
        >
          {t("clearFilters")}
        </button>
      )}
    </div>
  );

  // -------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------
  return (
    <div>
      {/* ============================================================= */}
      {/* ZONE A — Collection Carousel                                  */}
      {/* ============================================================= */}
      {categories.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-muted mb-4">
            {t("exploreCollections")}
          </p>

          <div className="relative group/carousel">
            {/* Left arrow */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-text-secondary hover:text-white hover:border-border transition-all shadow-lg"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon />
              </button>
            )}

            {/* Right arrow */}
            {canScrollRight && (
              <button
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-text-secondary hover:text-white hover:border-border transition-all shadow-lg"
                aria-label="Scroll right"
              >
                <ChevronRightIcon />
              </button>
            )}

          <div
            ref={carouselRef}
            role="navigation"
            aria-label={t("exploreCollections")}
            className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* "All" card */}
            <button
              onClick={clearFilters}
              className={cn(
                "relative flex-shrink-0 w-28 h-[88px] rounded-xl overflow-hidden snap-start transition-all duration-300 group/card",
                "bg-gradient-to-br from-surface-light to-surface border",
                activeCategories.size === 0
                  ? "border-gold/40 ring-2 ring-gold/60"
                  : "border-border/40 hover:border-border"
              )}
            >
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <span
                  className={cn(
                    "transition-colors",
                    activeCategories.size === 0
                      ? "text-gold"
                      : "text-text-muted group-hover/card:text-text-secondary"
                  )}
                >
                  <GridIcon />
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-[0.15em] uppercase transition-colors",
                    activeCategories.size === 0
                      ? "text-gold"
                      : "text-text-secondary"
                  )}
                >
                  {t("all")}
                </span>
                <span className="font-mono text-[9px] text-text-muted">
                  {photos.length}
                </span>
              </div>
              {/* Active bar */}
              {activeCategories.size === 0 && (
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gold" />
              )}
            </button>

            {/* Category cards */}
            {orderedCategories.map((cat) => {
              const isActive = activeCategories.has(cat.id);
              const hasImage = !!cat.coverImageUrl;

              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative flex-shrink-0 w-40 h-[88px] rounded-xl overflow-hidden snap-start transition-all duration-300 group/card",
                    isActive
                      ? "ring-2 ring-gold/60 border border-gold/40"
                      : "border border-border/30 hover:border-border/60"
                  )}
                >
                  {/* Background image or gradient fallback */}
                  {hasImage ? (
                    <Image
                      src={cat.coverImageUrl!}
                      alt={cat.name}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-light to-surface" />
                  )}

                  {/* Dark overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-colors duration-300",
                      hasImage
                        ? "bg-gradient-to-t from-black/80 via-black/40 to-black/20"
                        : ""
                    )}
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-3">
                    <span className="font-serif text-[13px] text-white font-medium leading-tight">
                      {cat.name}
                    </span>
                    <span className="font-mono text-[9px] text-white/50 mt-0.5">
                      {cat.photoCount ?? 0} photos
                    </span>
                  </div>

                  {/* Active bottom bar */}
                  {isActive && (
                    <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gold" />
                  )}
                </button>
              );
            })}
          </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* ZONE B — Sticky Toolbar                                       */}
      {/* ============================================================= */}
      <div className="sticky top-20 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 mb-4 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="flex items-center justify-between gap-3">
          {/* Left: filter toggle + active pills */}
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            {/* Desktop filter toggle */}
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className={cn(
                "hidden md:flex items-center gap-2 shrink-0 rounded-lg border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200",
                sidebarOpen
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-border text-text-secondary hover:text-white hover:border-text-muted"
              )}
              aria-label={t("advancedFilters")}
              aria-expanded={sidebarOpen}
            >
              <FilterIcon />
              <span>{t("advancedFilters")}</span>
              {activeCategories.size > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-background">
                  {activeCategories.size}
                </span>
              )}
            </button>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={cn(
                "flex md:hidden items-center gap-2 shrink-0 rounded-lg border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200",
                hasActiveFilters
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-border text-text-secondary"
              )}
              aria-label={t("advancedFilters")}
            >
              <FilterIcon />
              {activeCategories.size > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-background">
                  {activeCategories.size}
                </span>
              )}
            </button>

            {/* Active filter pills (desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {activeCategoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="flex items-center gap-1.5 shrink-0 rounded-full border border-gold/25 bg-gold/[0.07] pl-3 pr-2 py-1 text-[11px] font-mono text-gold hover:bg-gold/15 transition-colors"
                >
                  {cat.name}
                  <XIcon className="opacity-60" />
                </button>
              ))}
              {(priceMin !== "" || priceMax !== "") && (
                <button
                  onClick={() => {
                    setPriceMin("");
                    setPriceMax("");
                  }}
                  className="flex items-center gap-1.5 shrink-0 rounded-full border border-gold/25 bg-gold/[0.07] pl-3 pr-2 py-1 text-[11px] font-mono text-gold hover:bg-gold/15 transition-colors"
                >
                  {priceMin || "0"}€ — {priceMax || "∞"}€
                  <XIcon className="opacity-60" />
                </button>
              )}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="shrink-0 text-[10px] font-mono text-text-muted hover:text-white uppercase tracking-wider transition-colors ml-1"
                >
                  {t("clearFilters")}
                </button>
              )}
            </div>
          </div>

          {/* Right: count + sort */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:block text-xs font-mono text-text-muted tabular-nums whitespace-nowrap">
              {t("photoCount", { count: filteredPhotos.length })}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-border bg-surface px-3 py-2 pr-8 text-xs font-mono text-text-secondary focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 cursor-pointer transition-colors bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center]"
            >
              <option value="recent">{t("sortRecent")}</option>
              <option value="priceAsc">{t("sortPriceAsc")}</option>
              <option value="priceDesc">{t("sortPriceDesc")}</option>
              <option value="popular">{t("sortPopular")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* ZONE C — Sidebar + Grid                                       */}
      {/* ============================================================= */}
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden md:block transition-all duration-300 ease-out overflow-hidden flex-shrink-0",
            sidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"
          )}
        >
          <div className="w-64 pr-2">{sidebarContent}</div>
        </aside>

        {/* Photo grid */}
        <div className="flex-1 min-w-0">
          {filteredPhotos.length > 0 ? (
            <div
              className={cn(
                "grid gap-3 sm:gap-4 lg:gap-5 transition-all duration-300",
                sidebarOpen
                  ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              )}
            >
              {filteredPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-sans text-text-secondary text-base">
                {t("noResults")}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 font-mono text-xs tracking-wider uppercase text-gold hover:text-gold-light transition-colors"
                >
                  {t("clearFilters")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* Mobile sidebar overlay                                        */}
      {/* ============================================================= */}

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          mobileSidebarOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-background border-r border-border/50 z-50 md:hidden transition-transform duration-300 ease-out overflow-y-auto",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">
            {t("advancedFilters")}
          </span>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="text-text-muted hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        {/* Panel body */}
        <div className="p-5">{sidebarContent}</div>
      </div>
    </div>
  );
}
