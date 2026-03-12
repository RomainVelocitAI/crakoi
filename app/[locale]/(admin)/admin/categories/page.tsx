import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import CategoryPageClient from "@/components/admin/CategoryPageClient";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryVisible,
} from "./actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("categories") };
}

export default async function AdminCategoriesPage() {
  const supabase = await createServerClient();

  const { data: categories } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      description,
      cover_image_url,
      display_order,
      is_visible,
      photo_categories(count)
    `
    )
    .order("display_order", { ascending: true });

  return (
    <CategoryPageClient
      categories={categories || []}
      onCreate={createCategory}
      onUpdate={updateCategory}
      onDelete={deleteCategory}
      onToggleVisible={toggleCategoryVisible}
    />
  );
}
