"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus, FolderOpen, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import CategoryForm from "@/components/admin/CategoryForm";
import { toast } from "sonner";

interface CategoryPageClientProps {
  categories: any[];
  onCreate: (data: Record<string, unknown>) => Promise<{ success?: boolean; error?: string }>;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<{ success?: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>;
  onToggleVisible: (id: string, isVisible: boolean) => Promise<{ success?: boolean; error?: string }>;
}

export default function CategoryPageClient({
  categories,
  onCreate,
  onUpdate,
  onDelete,
  onToggleVisible,
}: CategoryPageClientProps) {
  const t = useTranslations("admin");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();
  const [visibilityState, setVisibilityState] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    categories.forEach((c) => {
      state[c.id] = c.is_visible;
    });
    return state;
  });

  const handleCreate = () => {
    setEditingCategory(null);
    setShowFormModal(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    if (editingCategory) {
      const result = await onUpdate(editingCategory.id, data);
      if (result.success) setShowFormModal(false);
      return result;
    } else {
      const result = await onCreate(data);
      if (result.success) setShowFormModal(false);
      return result;
    }
  };

  const handleToggleVisible = (categoryId: string) => {
    const newValue = !visibilityState[categoryId];
    setVisibilityState((prev) => ({ ...prev, [categoryId]: newValue }));
    startTransition(async () => {
      const result = await onToggleVisible(categoryId, newValue);
      if (result.error) {
        setVisibilityState((prev) => ({ ...prev, [categoryId]: !newValue }));
        toast.error(result.error);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await onDelete(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Catégorie supprimée");
      }
      setDeleteTarget(null);
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t("categories")}
        </h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-background text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter une catégorie
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {categories.length === 0 ? (
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
                  <th className="text-right px-5 py-3 font-normal">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category: any) => {
                  const photoCount =
                    Array.isArray(category.photo_categories)
                      ? category.photo_categories.length
                      : 0;
                  const isVisible = visibilityState[category.id] ?? category.is_visible;

                  return (
                    <tr
                      key={category.id}
                      className="border-b border-border/50 hover:bg-surface transition-colors"
                    >
                      <td className="px-5 py-3 text-text-primary font-medium">
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
                        <StatusBadge
                          status={isVisible ? "active" : "inactive"}
                          labels={{
                            active: t("active"),
                            inactive: t("inactive"),
                          }}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Toggle
                            checked={isVisible}
                            onChange={() => handleToggleVisible(category.id)}
                            disabled={isPending}
                          />
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1.5 text-text-muted hover:text-gold transition-colors rounded hover:bg-gold/10"
                            title={t("edit")}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(category)}
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

      {/* Create/Edit Modal */}
      <Modal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
      >
        <CategoryForm
          initialData={
            editingCategory
              ? {
                  id: editingCategory.id,
                  name: editingCategory.name,
                  slug: editingCategory.slug,
                  description: editingCategory.description || "",
                  cover_image_url: editingCategory.cover_image_url || "",
                  display_order: editingCategory.display_order ?? 0,
                  is_visible: editingCategory.is_visible ?? true,
                }
              : undefined
          }
          onSubmit={handleFormSubmit}
          onCancel={() => setShowFormModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer cette catégorie ?"
        description={`La catégorie « ${deleteTarget?.name} » sera supprimée. Cette action est irréversible.`}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        confirmVariant="danger"
        loading={isPending}
      />
    </div>
  );
}
