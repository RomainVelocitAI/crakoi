"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, ImageIcon, Star } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

interface PhotoListActionsProps {
  photoId: string;
  isPublished: boolean;
  isHeader: boolean;
  isFeatured: boolean;
  onDelete: (photoId: string) => Promise<{ success?: boolean; error?: string }>;
  onTogglePublished: (photoId: string, isPublished: boolean) => Promise<{ success?: boolean; error?: string }>;
  onToggleHeader: (photoId: string, isHeader: boolean) => Promise<{ success?: boolean; error?: string }>;
  onToggleFeatured: (photoId: string, isFeatured: boolean) => Promise<{ success?: boolean; error?: string }>;
}

export default function PhotoListActions({
  photoId,
  isPublished,
  isHeader,
  isFeatured,
  onDelete,
  onTogglePublished,
  onToggleHeader,
  onToggleFeatured,
}: PhotoListActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [published, setPublished] = useState(isPublished);
  const [header, setHeader] = useState(isHeader);
  const [featured, setFeatured] = useState(isFeatured);

  const handleTogglePublished = () => {
    const newValue = !published;
    setPublished(newValue);
    startTransition(async () => {
      const result = await onTogglePublished(photoId, newValue);
      if (result.error) {
        setPublished(!newValue);
        toast.error(result.error);
      }
    });
  };

  const handleToggleHeader = () => {
    const newValue = !header;
    setHeader(newValue);
    startTransition(async () => {
      const result = await onToggleHeader(photoId, newValue);
      if (result.error) {
        setHeader(!newValue);
        toast.error(result.error);
      } else {
        toast.success(newValue ? "Ajoutée au Hero" : "Retirée du Hero");
      }
    });
  };

  const handleToggleFeatured = () => {
    const newValue = !featured;
    setFeatured(newValue);
    startTransition(async () => {
      const result = await onToggleFeatured(photoId, newValue);
      if (result.error) {
        setFeatured(!newValue);
        toast.error(result.error);
      } else {
        toast.success(newValue ? "Mise en avant" : "Retirée des highlights");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await onDelete(photoId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Photo supprimée");
      }
      setShowDeleteModal(false);
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        {/* Header toggle */}
        <button
          onClick={handleToggleHeader}
          disabled={isPending}
          className={cn(
            "p-1.5 rounded transition-colors",
            header
              ? "text-gold bg-gold/10"
              : "text-text-muted hover:text-text-primary hover:bg-surface"
          )}
          title={header ? "Retirer du Hero" : "Ajouter au Hero"}
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        {/* Featured toggle */}
        <button
          onClick={handleToggleFeatured}
          disabled={isPending}
          className={cn(
            "p-1.5 rounded transition-colors",
            featured
              ? "text-gold bg-gold/10"
              : "text-text-muted hover:text-text-primary hover:bg-surface"
          )}
          title={featured ? "Retirer des highlights" : "Mettre en avant"}
        >
          <Star className={cn("h-4 w-4", featured && "fill-gold")} />
        </button>

        {/* Published toggle */}
        <Toggle
          checked={published}
          onChange={handleTogglePublished}
          disabled={isPending}
        />

        {/* Edit */}
        <Link
          href={`/admin/photos/${photoId}`}
          className="p-1.5 text-text-muted hover:text-gold transition-colors rounded hover:bg-gold/10"
          title="Modifier"
        >
          <Pencil className="h-4 w-4" />
        </Link>

        {/* Delete */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer cette photo ?"
        description="Cette action est irréversible. La photo et tous ses prix seront supprimés."
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        confirmVariant="danger"
        loading={isPending}
      />
    </>
  );
}
