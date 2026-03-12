import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import PhotoForm from "@/components/admin/PhotoForm";
import { createPhoto, updatePhotoVariants } from "../actions";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: `${t("addPhoto")} — ${t("title")}` };
}

export default async function AdminNewPhotoPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const [categoriesRes, sizesRes] = await Promise.all([
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

  const categories = categoriesRes.data || [];
  const sizes = sizesRes.data || [];

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
          {t("addPhoto")}
        </h1>
      </div>

      <PhotoForm
        categories={categories}
        sizes={sizes}
        onSubmit={createPhoto}
        onSubmitVariants={updatePhotoVariants}
      />
    </div>
  );
}
