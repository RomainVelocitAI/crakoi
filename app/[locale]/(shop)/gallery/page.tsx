import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import FadeIn from "@/components/animations/FadeIn";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import type { GalleryPhoto, GalleryCategory } from "@/components/gallery/GalleryGrid";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "gallery" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      languages: {
        fr: "/fr/gallery",
        en: "/en/gallery",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
    },
  };
}

export default async function GalleryPage() {
  const supabase = await createServerClient();

  // Fetch all published photos with categories and variant prices
  const { data: photos } = await supabase
    .from("photos")
    .select(
      "id, title, slug, image_url, thumbnail_url, location, created_at, photo_variants(price, sizes(name, label)), photo_categories(category_id)"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // Fetch visible categories for filter tabs
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, cover_image_url")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  // Count photos per category + pick first photo as cover fallback
  const photoCounts: Record<string, number> = {};
  const firstPhotoPerCategory: Record<string, string> = {};
  (photos || []).forEach((photo: any) => {
    (photo.photo_categories || []).forEach((pc: any) => {
      photoCounts[pc.category_id] = (photoCounts[pc.category_id] || 0) + 1;
      if (!firstPhotoPerCategory[pc.category_id]) {
        firstPhotoPerCategory[pc.category_id] =
          photo.thumbnail_url || photo.image_url;
      }
    });
  });

  // Transform photos for the gallery grid
  const galleryPhotos: GalleryPhoto[] = (photos || []).map((photo: any) => {
    const prices = (photo.photo_variants || []).map((v: any) => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const categoryIds = (photo.photo_categories || []).map(
      (pc: any) => pc.category_id
    );

    return {
      id: photo.id,
      title: photo.title,
      slug: photo.slug,
      imageUrl: photo.image_url,
      thumbnailUrl: photo.thumbnail_url,
      location: photo.location,
      minPrice,
      categoryIds,
      createdAt: photo.created_at,
    };
  });

  // Transform categories with cover images and photo counts
  const filterCategories: GalleryCategory[] = (categories || []).map(
    (cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      coverImageUrl: cat.cover_image_url || firstPhotoPerCategory[cat.id] || null,
      description: cat.description,
      photoCount: photoCounts[cat.id] || 0,
    })
  );

  const t = await getTranslations("gallery");

  return (
    <section className="bg-background min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <FadeIn className="mb-16 text-center">
          <span className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase mb-4 block">
            Collection
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-text-primary font-medium mb-4">
            {t("title")}
          </h1>
          <p className="font-sans text-base text-text-secondary max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </FadeIn>

        {/* Gallery grid with filters */}
        <GalleryGrid
          photos={galleryPhotos}
          categories={filterCategories}
          showFilters={true}
        />
      </div>
    </section>
  );
}
