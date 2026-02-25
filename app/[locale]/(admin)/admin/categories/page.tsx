import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { FolderOpen } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("categories") };
}

export default async function AdminCategoriesPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const { data: categories } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      display_order,
      is_visible,
      photo_categories(count)
    `
    )
    .order("display_order", { ascending: true });

  return (
    <div>
      {/* Header */}
      <h1 className="font-serif text-2xl font-semibold text-white mb-8">
        {t("categories")}
      </h1>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {!categories || categories.length === 0 ? (
          <div className="px-5 py-10 text-center text-text-muted">
            <FolderOpen className="h-10 w-10 mx-auto mb-3 text-text-muted" />
            {t("noData")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-normal">
                    {t("categoryName")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("categorySlug")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("photoCount")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("displayOrder")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category: any) => {
                  // photo_categories is returned as [{ count: N }] with count aggregation
                  const photoCount =
                    Array.isArray(category.photo_categories)
                      ? category.photo_categories.length
                      : 0;

                  return (
                    <tr
                      key={category.id}
                      className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3 text-white font-medium">
                        {category.name}
                      </td>
                      <td className="px-5 py-3 text-text-muted font-mono text-xs">
                        {category.slug}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {photoCount}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {category.display_order}
                      </td>
                      <td className="px-5 py-3">
                        {category.is_visible ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                            {t("active")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            {t("inactive")}
                          </span>
                        )}
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
