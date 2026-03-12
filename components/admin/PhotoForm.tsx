"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { photoSchema } from "@/lib/validations/admin";
import type { z } from "zod";

type PhotoFormData = z.input<typeof photoSchema>;
import { Button } from "@/components/admin/ui/Button";
import { Toggle } from "@/components/admin/ui/Toggle";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { slugify } from "@/lib/utils/slugify";
import { toast } from "sonner";
import { useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

interface PhotoFormProps {
  initialData?: any;
  categories: Array<{ id: string; name: string }>;
  sizes: Array<{ id: string; name: string; label: string }>;
  existingVariants?: Array<{
    size_id: string;
    price: number;
    compare_at_price: number | null;
    sku: string;
    stock: number | null;
    is_active: boolean;
  }>;
  onSubmit: (
    data: Record<string, unknown>
  ) => Promise<{ success?: boolean; error?: string; photoId?: string }>;
  onSubmitVariants?: (
    photoId: string,
    variants: any[]
  ) => Promise<{ success?: boolean; error?: string }>;
}

const inputClass =
  "w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/50 focus:outline-none placeholder:text-text-muted transition-colors";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-light/50 transition-colors"
      >
        <h3 className="font-serif text-sm font-semibold text-text-primary tracking-wide">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border/50">
          <div className="pt-4 space-y-4">{children}</div>
        </div>
      )}
    </div>
  );
}

function FieldLabel({
  label,
  htmlFor,
  optional,
}: {
  label: string;
  htmlFor?: string;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-sans text-text-secondary mb-1.5"
    >
      {label}
      {optional && (
        <span className="text-text-muted ml-1 text-xs">(optionnel)</span>
      )}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400 mt-1">{message}</p>;
}

export default function PhotoForm({
  initialData,
  categories,
  sizes,
  existingVariants,
  onSubmit,
  onSubmitVariants,
}: PhotoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );

  const isEdit = !!initialData;

  // Build variants state from existing data or defaults
  const [variants, setVariants] = useState<
    Array<{
      size_id: string;
      price: number;
      compare_at_price: number | null;
      sku: string;
      stock: number | null;
      is_active: boolean;
    }>
  >(() =>
    sizes.map((size) => {
      const existing = existingVariants?.find((v) => v.size_id === size.id);
      return (
        existing || {
          size_id: size.id,
          price: 0,
          compare_at_price: null,
          sku: "",
          stock: null,
          is_active: true,
        }
      );
    })
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      image_url: initialData?.image_url || "",
      image_hd_url: initialData?.image_hd_url || "",
      thumbnail_url: initialData?.thumbnail_url || "",
      location: initialData?.location || "",
      taken_at: initialData?.taken_at
        ? initialData.taken_at.split("T")[0]
        : "",
      camera_info: initialData?.camera_info || "",
      tags: initialData?.tags || [],
      is_published: initialData?.is_published ?? false,
      is_featured: initialData?.is_featured ?? false,
      is_header: initialData?.is_header ?? false,
      display_order: initialData?.display_order ?? 0,
      featured_order: initialData?.featured_order ?? null,
      header_order: initialData?.header_order ?? null,
      meta_title: initialData?.meta_title || "",
      meta_description: initialData?.meta_description || "",
      width: initialData?.width ?? null,
      height: initialData?.height ?? null,
      category_ids: initialData?.photo_categories?.map(
        (pc: any) => pc.category_id
      ) || [],
    },
  });

  const watchTitle = watch("title");
  const watchSlug = watch("slug");
  const watchIsFeatured = watch("is_featured") ?? false;
  const watchIsHeader = watch("is_header") ?? false;
  const watchMetaTitle = watch("meta_title") || "";
  const watchMetaDescription = watch("meta_description") || "";
  const watchCategoryIds = watch("category_ids") || [];

  const handleTitleBlur = () => {
    if (watchTitle && !watchSlug) {
      setValue("slug", slugify(watchTitle));
    }
  };

  const handleFormSubmit = handleSubmit((data) => {
    startTransition(async () => {
      // Parse tags from input
      const tags = tagsInput
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
      const submitData = { ...data, tags };

      const result = await onSubmit(submitData as Record<string, unknown>);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Submit variants
      const photoId = result.photoId || initialData?.id;
      if (photoId && onSubmitVariants) {
        const activeVariants = variants.filter((v) => v.price > 0 || v.is_active);
        if (activeVariants.length > 0) {
          const variantResult = await onSubmitVariants(photoId, activeVariants);
          if (variantResult.error) {
            toast.error(variantResult.error);
            return;
          }
        }
      }

      toast.success(isEdit ? "Photo mise à jour" : "Photo créée");
      router.push("/admin/photos");
    });
  });

  const updateVariant = (
    sizeId: string,
    field: string,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.size_id === sizeId ? { ...v, [field]: value } : v
      )
    );
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5 max-w-4xl">
      {/* ── Informations générales ── */}
      <Section title="Informations générales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel label="Titre" htmlFor="title" />
            <input
              id="title"
              {...register("title")}
              onBlur={handleTitleBlur}
              className={inputClass}
              placeholder="Nom de la photo"
            />
            <FieldError message={errors.title?.message} />
          </div>
          <div>
            <FieldLabel label="Slug" htmlFor="slug" />
            <input
              id="slug"
              {...register("slug")}
              className={cn(inputClass, "font-mono text-xs")}
              placeholder="auto-généré depuis le titre"
            />
            <FieldError message={errors.slug?.message} />
          </div>
        </div>

        <div>
          <FieldLabel label="Description" htmlFor="description" optional />
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className={cn(inputClass, "resize-y")}
            placeholder="Description de la photo..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel label="Lieu" htmlFor="location" optional />
            <input
              id="location"
              {...register("location")}
              className={inputClass}
              placeholder="La Réunion"
            />
          </div>
          <div>
            <FieldLabel label="Date de prise de vue" htmlFor="taken_at" optional />
            <input
              id="taken_at"
              type="date"
              {...register("taken_at")}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel label="Appareil photo" htmlFor="camera_info" optional />
            <input
              id="camera_info"
              {...register("camera_info")}
              className={inputClass}
              placeholder="Nikon D850"
            />
          </div>
        </div>

        <div>
          <FieldLabel label="Tags" htmlFor="tags" optional />
          <input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className={inputClass}
            placeholder="baleine, océan, sous-marin (séparés par des virgules)"
          />
          <p className="text-xs text-text-muted mt-1">
            Séparez les tags par des virgules
          </p>
        </div>
      </Section>

      {/* ── Images ── */}
      <Section title="Images">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            bucket="photos-web"
            path={`${watchSlug || "temp"}.webp`}
            currentUrl={initialData?.image_url}
            onUpload={(url) => {
              setValue("image_url", url);
              if (!watch("thumbnail_url")) {
                setValue("thumbnail_url", url);
              }
            }}
            label="Image web (affichage)"
          />
          <ImageUpload
            bucket="photos-hd"
            path={`${watchSlug || "temp"}-hd.jpg`}
            currentUrl={initialData?.image_hd_url}
            onUpload={(url) => setValue("image_hd_url", url)}
            label="Image HD (impression)"
          />
        </div>
      </Section>

      {/* ── Catégories ── */}
      <Section title="Catégories">
        {categories.length === 0 ? (
          <p className="text-sm text-text-muted">Aucune catégorie disponible</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isChecked = watchCategoryIds.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-md border cursor-pointer transition-colors text-sm",
                    isChecked
                      ? "border-gold/40 bg-gold/5 text-text-primary"
                      : "border-border bg-background text-text-secondary hover:border-border hover:bg-surface"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const current = watchCategoryIds;
                      if (e.target.checked) {
                        setValue("category_ids", [...current, cat.id]);
                      } else {
                        setValue(
                          "category_ids",
                          current.filter((id: string) => id !== cat.id)
                        );
                      }
                    }}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                      isChecked
                        ? "bg-gold border-gold"
                        : "border-border bg-background"
                    )}
                  >
                    {isChecked && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        className="text-background"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {cat.name}
                </label>
              );
            })}
          </div>
        )}
      </Section>

      {/* ── Prix et variantes ── */}
      <Section title="Prix et variantes">
        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_120px_120px_80px] gap-3 text-xs text-text-muted uppercase tracking-wider px-1">
            <span>Taille</span>
            <span>Prix (€)</span>
            <span>Prix barré (€)</span>
            <span className="text-center">Actif</span>
          </div>

          {sizes.map((size) => {
            const variant = variants.find((v) => v.size_id === size.id);
            if (!variant) return null;

            return (
              <div
                key={size.id}
                className="grid grid-cols-[1fr_120px_120px_80px] gap-3 items-center bg-background rounded-md border border-border px-3 py-2.5"
              >
                <div>
                  <span className="text-sm text-text-primary font-medium">
                    {size.name}
                  </span>
                  <span className="text-xs text-text-muted ml-2">
                    {size.label}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price || ""}
                  onChange={(e) =>
                    updateVariant(
                      size.id,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={cn(inputClass, "text-right")}
                  placeholder="0"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.compare_at_price || ""}
                  onChange={(e) =>
                    updateVariant(
                      size.id,
                      "compare_at_price",
                      parseFloat(e.target.value) || null
                    )
                  }
                  className={cn(inputClass, "text-right")}
                  placeholder="—"
                />
                <div className="flex justify-center">
                  <Toggle
                    checked={variant.is_active}
                    onChange={(checked) =>
                      updateVariant(size.id, "is_active", checked)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Affichage ── */}
      <Section title="Affichage">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-text-primary">Publié</p>
              <p className="text-xs text-text-muted">
                Visible sur le site public
              </p>
            </div>
            <Toggle
              checked={watch("is_published") ?? false}
              onChange={(v) => setValue("is_published", v)}
            />
          </div>

          <div className="border-t border-border/50 pt-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-text-primary">En vedette (Highlights)</p>
                <p className="text-xs text-text-muted">
                  Apparaît dans la section highlights
                </p>
              </div>
              <Toggle
                checked={watchIsFeatured}
                onChange={(v) => setValue("is_featured", v)}
              />
            </div>
            {watchIsFeatured && (
              <div className="ml-0 mt-2">
                <FieldLabel label="Ordre (highlights)" htmlFor="featured_order" />
                <input
                  id="featured_order"
                  type="number"
                  min="0"
                  {...register("featured_order")}
                  className={cn(inputClass, "w-24")}
                  placeholder="0"
                />
              </div>
            )}
          </div>

          <div className="border-t border-border/50 pt-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-text-primary">Header / Hero</p>
                <p className="text-xs text-text-muted">
                  Apparaît dans le carrousel du header
                </p>
              </div>
              <Toggle
                checked={watchIsHeader}
                onChange={(v) => setValue("is_header", v)}
              />
            </div>
            {watchIsHeader && (
              <div className="ml-0 mt-2">
                <FieldLabel label="Ordre (header)" htmlFor="header_order" />
                <input
                  id="header_order"
                  type="number"
                  min="0"
                  {...register("header_order")}
                  className={cn(inputClass, "w-24")}
                  placeholder="0"
                />
              </div>
            )}
          </div>

          <div className="border-t border-border/50 pt-4">
            <FieldLabel label="Ordre d'affichage (galerie)" htmlFor="display_order" />
            <input
              id="display_order"
              type="number"
              min="0"
              {...register("display_order")}
              className={cn(inputClass, "w-24")}
              placeholder="0"
            />
          </div>
        </div>
      </Section>

      {/* ── SEO ── */}
      <Section title="SEO">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FieldLabel label="Meta Title" htmlFor="meta_title" optional />
            <span
              className={cn(
                "text-xs tabular-nums",
                watchMetaTitle.length > 60
                  ? "text-red-400"
                  : "text-text-muted"
              )}
            >
              {watchMetaTitle.length}/60
            </span>
          </div>
          <input
            id="meta_title"
            {...register("meta_title")}
            className={inputClass}
            placeholder="Titre pour les moteurs de recherche"
          />
          <FieldError message={errors.meta_title?.message} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <FieldLabel
              label="Meta Description"
              htmlFor="meta_description"
              optional
            />
            <span
              className={cn(
                "text-xs tabular-nums",
                watchMetaDescription.length > 160
                  ? "text-red-400"
                  : "text-text-muted"
              )}
            >
              {watchMetaDescription.length}/160
            </span>
          </div>
          <textarea
            id="meta_description"
            {...register("meta_description")}
            rows={3}
            className={cn(inputClass, "resize-y")}
            placeholder="Description pour les moteurs de recherche"
          />
          <FieldError message={errors.meta_description?.message} />
        </div>
      </Section>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-8">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/photos")}
          disabled={isPending}
        >
          Annuler
        </Button>
        <Button type="submit" variant="primary" loading={isPending}>
          {isEdit ? "Mettre à jour" : "Créer la photo"}
        </Button>
      </div>
    </form>
  );
}
