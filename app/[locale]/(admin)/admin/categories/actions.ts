"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/activityLog";
import { categorySchema } from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function createCategory(data: Record<string, unknown>) {
  const { supabase, adminId } = await requireAdmin();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const categoryData = parsed.data;

  const { data: category, error } = await supabase
    .from("categories")
    .insert({
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || null,
      cover_image_url: categoryData.cover_image_url || null,
      display_order: categoryData.display_order,
      is_visible: categoryData.is_visible,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "create", "categories", category.id, {
    name: categoryData.name,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  return { success: true };
}

export async function updateCategory(
  categoryId: string,
  data: Record<string, unknown>
) {
  const { supabase, adminId } = await requireAdmin();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const categoryData = parsed.data;

  const { error } = await supabase
    .from("categories")
    .update({
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || null,
      cover_image_url: categoryData.cover_image_url || null,
      display_order: categoryData.display_order,
      is_visible: categoryData.is_visible,
    })
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "categories", categoryId, {
    name: categoryData.name,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  const { supabase, adminId } = await requireAdmin();

  // Get category info for logging
  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("id", categoryId)
    .single();

  // Check if category has associated photos
  const { data: photoCategories } = await supabase
    .from("photo_categories")
    .select("id")
    .eq("category_id", categoryId)
    .limit(1);

  if (photoCategories && photoCategories.length > 0) {
    return {
      error:
        "Cette catégorie contient des photos. Retirez-les avant de supprimer.",
    };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "delete", "categories", categoryId, {
    name: category?.name,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  return { success: true };
}

export async function reorderCategories(orderedIds: string[]) {
  const { supabase, adminId } = await requireAdmin();

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("categories")
      .update({ display_order: i })
      .eq("id", orderedIds[i]);
  }

  await logAdminAction(supabase, adminId, "reorder", "categories", orderedIds.join(","), {
    count: orderedIds.length,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  return { success: true };
}

export async function toggleCategoryVisible(
  categoryId: string,
  isVisible: boolean
) {
  const { supabase, adminId } = await requireAdmin();

  const { error } = await supabase
    .from("categories")
    .update({ is_visible: isVisible })
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "categories", categoryId, {
    is_visible: isVisible,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  return { success: true };
}
