"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/activityLog";
import { photoSchema } from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function createPhoto(data: Record<string, unknown>) {
  const { supabase, adminId } = await requireAdmin();

  const parsed = photoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { category_ids, ...photoData } = parsed.data;

  // Insert photo
  const { data: photo, error } = await supabase
    .from("photos")
    .insert({
      title: photoData.title,
      slug: photoData.slug,
      description: photoData.description || null,
      image_url: photoData.image_url || null,
      image_hd_url: photoData.image_hd_url || null,
      thumbnail_url: photoData.thumbnail_url || null,
      location: photoData.location || null,
      taken_at: photoData.taken_at || null,
      camera_info: photoData.camera_info || null,
      tags: photoData.tags || [],
      is_published: photoData.is_published,
      is_featured: photoData.is_featured,
      is_header: photoData.is_header,
      display_order: photoData.display_order,
      featured_order: photoData.is_featured ? photoData.featured_order : null,
      header_order: photoData.is_header ? photoData.header_order : null,
      meta_title: photoData.meta_title || null,
      meta_description: photoData.meta_description || null,
      width: photoData.width || null,
      height: photoData.height || null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  // Insert category associations
  if (category_ids && category_ids.length > 0) {
    const categoryRows = category_ids.map((categoryId) => ({
      photo_id: photo.id,
      category_id: categoryId,
    }));
    await supabase.from("photo_categories").insert(categoryRows);
  }

  await logAdminAction(supabase, adminId, "create", "photos", photo.id, {
    title: photoData.title,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
  return { success: true, photoId: photo.id };
}

export async function updatePhoto(
  photoId: string,
  data: Record<string, unknown>
) {
  const { supabase, adminId } = await requireAdmin();

  const parsed = photoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { category_ids, ...photoData } = parsed.data;

  const { error } = await supabase
    .from("photos")
    .update({
      title: photoData.title,
      slug: photoData.slug,
      description: photoData.description || null,
      image_url: photoData.image_url || null,
      image_hd_url: photoData.image_hd_url || null,
      thumbnail_url: photoData.thumbnail_url || null,
      location: photoData.location || null,
      taken_at: photoData.taken_at || null,
      camera_info: photoData.camera_info || null,
      tags: photoData.tags || [],
      is_published: photoData.is_published,
      is_featured: photoData.is_featured,
      is_header: photoData.is_header,
      display_order: photoData.display_order,
      featured_order: photoData.is_featured ? photoData.featured_order : null,
      header_order: photoData.is_header ? photoData.header_order : null,
      meta_title: photoData.meta_title || null,
      meta_description: photoData.meta_description || null,
      width: photoData.width || null,
      height: photoData.height || null,
    })
    .eq("id", photoId);

  if (error) {
    return { error: error.message };
  }

  // Sync categories: delete existing, insert new
  await supabase
    .from("photo_categories")
    .delete()
    .eq("photo_id", photoId);

  if (category_ids && category_ids.length > 0) {
    const categoryRows = category_ids.map((categoryId) => ({
      photo_id: photoId,
      category_id: categoryId,
    }));
    await supabase.from("photo_categories").insert(categoryRows);
  }

  await logAdminAction(supabase, adminId, "update", "photos", photoId, {
    title: photoData.title,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deletePhoto(photoId: string) {
  const { supabase, adminId } = await requireAdmin();

  // Get photo info for logging
  const { data: photo } = await supabase
    .from("photos")
    .select("title, image_url, image_hd_url, thumbnail_url")
    .eq("id", photoId)
    .single();

  // Delete category associations
  await supabase.from("photo_categories").delete().eq("photo_id", photoId);

  // Delete variants
  await supabase.from("photo_variants").delete().eq("photo_id", photoId);

  // Delete the photo
  const { error } = await supabase.from("photos").delete().eq("id", photoId);

  if (error) {
    return { error: error.message };
  }

  // Try to delete storage files (non-blocking)
  try {
    const filesToDelete: string[] = [];
    if (photo?.image_url) {
      const path = extractStoragePath(photo.image_url, "photos-web");
      if (path) filesToDelete.push(path);
    }
    if (photo?.image_hd_url) {
      const path = extractStoragePath(photo.image_hd_url, "photos-hd");
      if (path) {
        await supabase.storage.from("photos-hd").remove([path]);
      }
    }
    if (filesToDelete.length > 0) {
      await supabase.storage.from("photos-web").remove(filesToDelete);
    }
  } catch {
    // Storage cleanup failure shouldn't block deletion
  }

  await logAdminAction(supabase, adminId, "delete", "photos", photoId, {
    title: photo?.title,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
  return { success: true };
}

export async function togglePhotoPublished(
  photoId: string,
  isPublished: boolean
) {
  const { supabase, adminId } = await requireAdmin();

  const { error } = await supabase
    .from("photos")
    .update({ is_published: isPublished })
    .eq("id", photoId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "photos", photoId, {
    is_published: isPublished,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
  return { success: true };
}

export async function togglePhotoHeader(
  photoId: string,
  isHeader: boolean
) {
  const { supabase, adminId } = await requireAdmin();

  const { error } = await supabase
    .from("photos")
    .update({ is_header: isHeader })
    .eq("id", photoId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "photos", photoId, {
    is_header: isHeader,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/admin/photos/header");
  revalidatePath("/");
  return { success: true };
}

export async function togglePhotoFeatured(
  photoId: string,
  isFeatured: boolean
) {
  const { supabase, adminId } = await requireAdmin();

  const { error } = await supabase
    .from("photos")
    .update({ is_featured: isFeatured })
    .eq("id", photoId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "photos", photoId, {
    is_featured: isFeatured,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/admin/photos/highlights");
  revalidatePath("/");
  return { success: true };
}

export async function bulkUpdatePhotos(
  photoIds: string[],
  action: "publish" | "unpublish" | "delete"
) {
  const { supabase, adminId } = await requireAdmin();

  if (action === "delete") {
    for (const id of photoIds) {
      await deletePhoto(id);
    }
  } else {
    const isPublished = action === "publish";
    const { error } = await supabase
      .from("photos")
      .update({ is_published: isPublished })
      .in("id", photoIds);

    if (error) {
      return { error: error.message };
    }

    await logAdminAction(supabase, adminId, "update", "photos", photoIds.join(","), {
      action,
      count: photoIds.length,
    });
  }

  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
  return { success: true };
}

export async function updatePhotoVariants(
  photoId: string,
  variants: Array<{
    size_id: string;
    price: number;
    compare_at_price?: number | null;
    sku?: string;
    stock?: number | null;
    is_active: boolean;
  }>
) {
  const { supabase, adminId } = await requireAdmin();

  for (const variant of variants) {
    // Check if variant exists
    const { data: existing } = await supabase
      .from("photo_variants")
      .select("id")
      .eq("photo_id", photoId)
      .eq("size_id", variant.size_id)
      .single();

    if (existing) {
      await supabase
        .from("photo_variants")
        .update({
          price: variant.price,
          compare_at_price: variant.compare_at_price || null,
          sku: variant.sku || null,
          stock: variant.stock ?? null,
          is_active: variant.is_active,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("photo_variants").insert({
        photo_id: photoId,
        size_id: variant.size_id,
        price: variant.price,
        compare_at_price: variant.compare_at_price || null,
        sku: variant.sku || null,
        stock: variant.stock ?? null,
        is_active: variant.is_active,
      });
    }
  }

  await logAdminAction(supabase, adminId, "update", "photo_variants", photoId, {
    variants_count: variants.length,
  });

  revalidatePath("/admin/photos");
  return { success: true };
}

export async function reorderPhotos(orderedIds: string[]) {
  const { supabase, adminId } = await requireAdmin();

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("photos")
      .update({ display_order: i })
      .eq("id", orderedIds[i]);
  }

  await logAdminAction(supabase, adminId, "reorder", "photos", orderedIds.join(","), {
    count: orderedIds.length,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
  return { success: true };
}

export async function reorderFeaturedPhotos(orderedIds: string[]) {
  const { supabase, adminId } = await requireAdmin();

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("photos")
      .update({ featured_order: i })
      .eq("id", orderedIds[i]);
  }

  await logAdminAction(supabase, adminId, "reorder", "photos", orderedIds.join(","), {
    type: "featured",
    count: orderedIds.length,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/admin/photos/highlights");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function reorderHeaderPhotos(orderedIds: string[]) {
  const { supabase, adminId } = await requireAdmin();

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("photos")
      .update({ header_order: i })
      .eq("id", orderedIds[i]);
  }

  await logAdminAction(supabase, adminId, "reorder", "photos", orderedIds.join(","), {
    type: "header",
    count: orderedIds.length,
  });

  revalidatePath("/admin/photos");
  revalidatePath("/admin/photos/header");
  revalidatePath("/");
  return { success: true };
}

function extractStoragePath(
  url: string,
  bucket: string
): string | null {
  try {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.substring(index + marker.length);
  } catch {
    return null;
  }
}
