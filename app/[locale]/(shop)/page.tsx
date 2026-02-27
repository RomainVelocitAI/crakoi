import { createServerClient } from "@/lib/supabase/server";
import HeroSection from "@/components/homepage/HeroSection";
import StorytellingSection from "@/components/homepage/StorytellingSection";
import CategoriesSection from "@/components/homepage/CategoriesSection";
import FeaturedPhotosSection from "@/components/homepage/FeaturedPhotosSection";
import MockupPreviewSection from "@/components/homepage/MockupPreviewSection";
import BookSection from "@/components/homepage/BookSection";
import ReassuranceBanner from "@/components/homepage/ReassuranceBanner";

export default async function HomePage() {
  const supabase = await createServerClient();

  // Fetch featured photos for hero + card stack
  const { data: featuredPhotos } = await supabase
    .from("photos")
    .select("id, title, slug, image_url, thumbnail_url, location, is_featured, featured_order, photo_variants(price, sizes(name, label))")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("featured_order", { ascending: true });

  // Fetch all published photos for the card stack (with min price)
  const { data: allPhotos } = await supabase
    .from("photos")
    .select("id, title, slug, image_url, thumbnail_url, location, photo_variants(price, sizes(name, label))")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch visible categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, cover_image_url, display_order")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  // Transform data for hero slides
  const heroSlides = (featuredPhotos || []).map((photo) => ({
    id: photo.id,
    title: photo.title,
    location: photo.location || "La Réunion",
    imageUrl: photo.image_url,
    href: `/photos/${photo.slug}`,
  }));

  // Transform data for featured photo cards
  const featuredCards = (allPhotos || []).map((photo) => {
    const prices = (photo.photo_variants || []).map((v: any) => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    return {
      id: photo.id,
      title: photo.title,
      slug: photo.slug,
      imageUrl: photo.image_url,
      location: photo.location || "La Réunion",
      minPrice,
    };
  });

  // Build a map of first photo per category for cover fallback
  const firstPhotoPerCategory: Record<string, string> = {};
  const photoCountPerCategory: Record<string, number> = {};
  const { data: allPublishedPhotos } = await supabase
    .from("photos")
    .select("thumbnail_url, image_url, photo_categories(category_id)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  (allPublishedPhotos || []).forEach((photo: any) => {
    (photo.photo_categories || []).forEach((pc: any) => {
      photoCountPerCategory[pc.category_id] = (photoCountPerCategory[pc.category_id] || 0) + 1;
      if (!firstPhotoPerCategory[pc.category_id]) {
        firstPhotoPerCategory[pc.category_id] = photo.thumbnail_url || photo.image_url;
      }
    });
  });

  // Transform data for categories
  const categoryCards = (categories || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || undefined,
    coverImageUrl: cat.cover_image_url || firstPhotoPerCategory[cat.id] || "",
    photoCount: photoCountPerCategory[cat.id] || 0,
  }));

  // Pick first photo for the mockup preview
  const mockupPhoto = allPhotos?.[0];
  const mockupPhotoUrl = mockupPhoto?.image_url || "";

  return (
    <>
      <HeroSection slides={heroSlides.length > 0 ? heroSlides : undefined} />
      <StorytellingSection />
      <CategoriesSection categories={categoryCards.length > 0 ? categoryCards : undefined} />
      <FeaturedPhotosSection photos={featuredCards.length > 0 ? featuredCards : undefined} />
      <MockupPreviewSection photoUrl={mockupPhotoUrl || undefined} />
      <BookSection />
      <ReassuranceBanner />
    </>
  );
}
