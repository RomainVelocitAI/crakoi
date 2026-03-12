import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Plus, Camera } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import PhotoListActions from "@/components/admin/PhotoListActions";
import { deletePhoto, togglePhotoPublished, togglePhotoHeader, togglePhotoFeatured } from "./actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("photos") };
}

export default async function AdminPhotosPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const { data: photos } = await supabase
    .from("photos")
    .select(
      `
      id,
      title,
      slug,
      thumbnail_url,
      image_url,
      is_published,
      is_header,
      is_featured,
      created_at,
      photo_variants(
        price,
        sizes(name)
      )
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t("photos")}
        </h1>
        <Link
          href="/admin/photos/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-background text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("addPhoto")}
        </Link>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {!photos || photos.length === 0 ? (
          <div className="px-5 py-10 text-center text-text-muted">
            <Camera className="h-10 w-10 mx-auto mb-3 text-text-muted" />
            {t("noData")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-normal">
                    {t("thumbnail")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("photoTitle")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("status")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("priceRange")}
                  </th>
                  <th className="text-right px-5 py-3 font-normal">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo: any) => {
                  const displayImage =
                    photo.thumbnail_url || photo.image_url;
                  const prices = (photo.photo_variants || []).map(
                    (v: any) => Number(v.price)
                  );
                  const minPrice =
                    prices.length > 0 ? Math.min(...prices) : null;
                  const maxPrice =
                    prices.length > 0 ? Math.max(...prices) : null;

                  let priceDisplay = "—";
                  if (minPrice !== null && maxPrice !== null) {
                    priceDisplay =
                      minPrice === maxPrice
                        ? `${minPrice.toFixed(0)} \u20AC`
                        : `${minPrice.toFixed(0)} — ${maxPrice.toFixed(0)} \u20AC`;
                  }

                  return (
                    <tr
                      key={photo.id}
                      className="border-b border-border/50 hover:bg-surface transition-colors"
                    >
                      {/* Thumbnail */}
                      <td className="px-5 py-3">
                        {displayImage ? (
                          <div className="relative h-12 w-16 rounded overflow-hidden bg-background">
                            <Image
                              src={displayImage}
                              alt={photo.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-16 rounded bg-background flex items-center justify-center">
                            <Camera className="h-5 w-5 text-text-muted" />
                          </div>
                        )}
                      </td>

                      {/* Title */}
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/photos/${photo.id}`}
                          className="text-text-primary font-medium hover:text-gold transition-colors"
                        >
                          {photo.title}
                        </Link>
                        <p className="text-xs text-text-muted mt-0.5">
                          {photo.slug}
                        </p>
                      </td>

                      {/* Published status */}
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={photo.is_published ? "published" : "draft"}
                          labels={{
                            published: t("published"),
                            draft: t("draft"),
                          }}
                        />
                      </td>

                      {/* Price range */}
                      <td className="px-5 py-3 text-text-secondary">
                        {priceDisplay}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <PhotoListActions
                          photoId={photo.id}
                          isPublished={photo.is_published}
                          isHeader={photo.is_header}
                          isFeatured={photo.is_featured}
                          onDelete={deletePhoto}
                          onTogglePublished={togglePhotoPublished}
                          onToggleHeader={togglePhotoHeader}
                          onToggleFeatured={togglePhotoFeatured}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
