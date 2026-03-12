"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/lib/validations/admin";
import type { z } from "zod";

type CategoryFormData = z.input<typeof categorySchema>;
import { Button } from "@/components/admin/ui/Button";
import { Toggle } from "@/components/admin/ui/Toggle";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { slugify } from "@/lib/utils/slugify";
import { toast } from "sonner";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    cover_image_url: string;
    display_order: number;
    is_visible: boolean;
  };
  onSubmit: (data: Record<string, unknown>) => Promise<{ success?: boolean; error?: string }>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  loading: externalLoading,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      cover_image_url: initialData?.cover_image_url || "",
      display_order: initialData?.display_order ?? 0,
      is_visible: initialData?.is_visible ?? true,
    },
  });

  const isVisible = watch("is_visible") ?? true;
  const coverImageUrl = watch("cover_image_url");
  const isLoading = externalLoading || isSubmitting;

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const currentSlug = watch("slug");
    if (!currentSlug && e.target.value) {
      setValue("slug", slugify(e.target.value));
    }
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    const result = await onSubmit(data as Record<string, unknown>);
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(
        initialData ? "Catégorie mise à jour" : "Catégorie créée"
      );
    }
  };

  const inputClassName =
    "w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/50 placeholder:text-text-muted";
  const labelClassName = "block text-sm font-medium text-text-secondary mb-1.5";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className={labelClassName}>Nom</label>
        <input
          type="text"
          {...register("name")}
          onBlur={handleNameBlur}
          className={inputClassName}
          placeholder="Ex: Sous l'eau"
        />
        {errors.name && (
          <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className={labelClassName}>Slug</label>
        <input
          type="text"
          {...register("slug")}
          className={inputClassName}
          placeholder="sous-leau"
        />
        {errors.slug && (
          <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className={labelClassName}>Description</label>
        <textarea
          {...register("description")}
          rows={2}
          className={inputClassName}
          placeholder="Brève description de la catégorie"
        />
      </div>

      {/* Cover image */}
      <div>
        <label className={labelClassName}>Image de couverture</label>
        <ImageUpload
          bucket="assets"
          path={`categories/${watch("slug") || "cover"}-${Date.now()}`}
          currentUrl={coverImageUrl || undefined}
          onUpload={(url) => setValue("cover_image_url", url)}
        />
      </div>

      {/* Display order + Visibility */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className={labelClassName}>Ordre d&apos;affichage</label>
          <input
            type="number"
            {...register("display_order")}
            className={inputClassName}
          />
        </div>
        <div className="pb-2">
          <Toggle
            checked={isVisible}
            onChange={(val) => setValue("is_visible", val)}
            label="Visible"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" variant="primary" size="sm" loading={isLoading}>
          {initialData ? "Enregistrer" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
