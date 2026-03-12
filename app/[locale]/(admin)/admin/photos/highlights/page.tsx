import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft, Star } from "lucide-react";
import HighlightsPhotosClient from "@/components/admin/HighlightsPhotosClient";
import { reorderFeaturedPhotos } from "../actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: `${t("highlightPhotos")} — ${t("photos")}` };
}

export default async function AdminHighlightsPhotosPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const { data: photos } = await supabase
    .from("photos")
    .select("id, title, slug, thumbnail_url, image_url, featured_order")
    .eq("is_featured", true)
    .order("featured_order", { ascending: true });

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/photos"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("photos")}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t("highlightPhotos")}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {t("highlightPhotosDescription")}
        </p>
      </div>

      {/* Content */}
      <div className="bg-surface border border-border rounded-lg p-6">
        {!photos || photos.length === 0 ? (
          <div className="py-10 text-center text-text-muted">
            <Star className="h-10 w-10 mx-auto mb-3 text-text-muted" />
            <p>{t("noHighlightPhotos")}</p>
            <p className="text-xs mt-1">{t("noHighlightPhotosHint")}</p>
          </div>
        ) : (
          <HighlightsPhotosClient
            photos={photos.map((p) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              thumbnail_url: p.thumbnail_url,
              image_url: p.image_url,
              featured_order: p.featured_order,
            }))}
            reorderAction={reorderFeaturedPhotos}
          />
        )}
      </div>
    </div>
  );
}
