import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import ProductView from "@/components/shop/ProductView";
import type { ProductPhoto, RelatedPhoto } from "@/components/shop/ProductView";

interface PageProps {
  params: { locale: string; slug: string };
}

// ---------- Metadata ----------

export async function generateMetadata({
  params: { locale, slug },
}: PageProps): Promise<Metadata> {
  const supabase = await createServerClient();

  const { data: photo } = await supabase
    .from("photos")
    .select("title, meta_title, meta_description, image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!photo) {
    return { title: "Photo not found" };
  }

  const title = photo.meta_title || photo.title;
  const description =
    photo.meta_description ||
    `${photo.title} — Tirage Fine Art par Eric Lamblin`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: photo.image_url ? [{ url: photo.image_url }] : [],
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: photo.image_url ? [photo.image_url] : [],
    },
    alternates: {
      languages: {
        fr: `/fr/photos/${slug}`,
        en: `/en/photos/${slug}`,
      },
    },
  };
}

// ---------- Page ----------

export default async function PhotoDetailPage({
  params: { slug },
}: PageProps) {
  const supabase = await createServerClient();

  // Fetch the photo with all relations
  const { data: photo } = await supabase
    .from("photos")
    .select(
      `
      id, title, slug, description, image_url, thumbnail_url,
      location, taken_at, camera_info, meta_title, meta_description,
      photo_variants(id, price, sizes(id, name, label, width_cm, height_cm)),
      photo_categories(categories(id, name, slug))
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!photo) {
    notFound();
  }

  // Get category IDs for related photos query
  const categoryIds = (photo.photo_categories || []).map(
    (pc: any) => pc.categories.id
  );

  // Fetch related photos — same categories, exclude current, limit 4
  let relatedPhotos: RelatedPhoto[] = [];

  if (categoryIds.length > 0) {
    const { data: relatedData } = await supabase
      .from("photos")
      .select(
        `
        id, title, slug, image_url, thumbnail_url, location,
        photo_variants(price),
        photo_categories!inner(categories!inner(id))
      `
      )
      .eq("is_published", true)
      .neq("id", photo.id)
      .in("photo_categories.categories.id", categoryIds)
      .limit(4);

    if (relatedData) {
      // Deduplicate — a photo may appear multiple times if it shares several categories
      const seen = new Set<string>();
      relatedPhotos = relatedData
        .filter((p: any) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        })
        .slice(0, 4) as RelatedPhoto[];
    }
  }

  // If we didn't get enough related photos from categories, fill with recent photos
  if (relatedPhotos.length < 4) {
    const existingIds = [photo.id, ...relatedPhotos.map((p) => p.id)];

    const { data: morePhotos } = await supabase
      .from("photos")
      .select("id, title, slug, image_url, thumbnail_url, location, photo_variants(price)")
      .eq("is_published", true)
      .not("id", "in", `(${existingIds.join(",")})`)
      .order("created_at", { ascending: false })
      .limit(4 - relatedPhotos.length);

    if (morePhotos) {
      relatedPhotos = [...relatedPhotos, ...(morePhotos as RelatedPhoto[])];
    }
  }

  return (
    <ProductView
      photo={photo as unknown as ProductPhoto}
      relatedPhotos={relatedPhotos}
    />
  );
}
