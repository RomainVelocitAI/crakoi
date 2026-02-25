import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Plus, Pencil, Trash2, Camera } from "lucide-react";

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
        <h1 className="font-serif text-2xl font-semibold text-white">
          {t("photos")}
        </h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-background text-sm font-medium rounded hover:bg-gold-light transition-colors">
          <Plus className="h-4 w-4" />
          {t("addPhoto")}
        </button>
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
                      className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
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
                        <p className="text-white font-medium">{photo.title}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {photo.slug}
                        </p>
                      </td>

                      {/* Published status */}
                      <td className="px-5 py-3">
                        {photo.is_published ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                            {t("published")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            {t("draft")}
                          </span>
                        )}
                      </td>

                      {/* Price range */}
                      <td className="px-5 py-3 text-text-secondary">
                        {priceDisplay}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 text-text-muted hover:text-gold transition-colors rounded hover:bg-gold/10"
                            title={t("edit")}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                            title={t("delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
