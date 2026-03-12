import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PhotoForm from "@/components/admin/PhotoForm";
import { updatePhoto, updatePhotoVariants } from "../actions";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const { data: photo } = await supabase
    .from("photos")
    .select("title")
    .eq("id", params.id)
    .single();

  return {
    title: photo
      ? `${photo.title} — ${t("edit")}`
      : t("edit"),
  };
}

export default async function AdminEditPhotoPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const [photoRes, categoriesRes, sizesRes] = await Promise.all([
    supabase
      .from("photos")
      .select(
        `
        *,
        photo_categories(category_id),
        photo_variants(
          size_id,
          price,
          compare_at_price,
          sku,
          stock,
          is_active
        )
      `
      )
      .eq("id", params.id)
      .single(),
    supabase
      .from("categories")
      .select("id, name")
      .order("display_order", { ascending: true }),
    supabase
      .from("sizes")
      .select("id, name, label")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
  ]);

  if (!photoRes.data) {
    notFound();
  }

  const photo = photoRes.data;
  const categories = categoriesRes.data || [];
  const sizes = sizesRes.data || [];

  const existingVariants = (photo.photo_variants || []).map((v: any) => ({
    size_id: v.size_id,
    price: Number(v.price),
    compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
    sku: v.sku || "",
    stock: v.stock,
    is_active: v.is_active,
  }));

  // Bind photoId to the update action
  const boundUpdatePhoto = async (data: Record<string, unknown>) => {
    "use server";
    return updatePhoto(params.id, data);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/photos"
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors rounded hover:bg-surface"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t("edit")} — {photo.title}
        </h1>
      </div>

      <PhotoForm
        initialData={photo}
        categories={categories}
        sizes={sizes}
        existingVariants={existingVariants}
        onSubmit={boundUpdatePhoto}
        onSubmitVariants={updatePhotoVariants}
      />
    </div>
  );
}
