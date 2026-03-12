"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Truck, Plus, Pencil, Trash2, MapPin, Package } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { Modal } from "@/components/admin/ui/Modal";
import ShippingZoneForm from "@/components/admin/ShippingZoneForm";
import { toast } from "sonner";

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  base_price: number;
  free_shipping_threshold: number | null;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

interface ShippingPageClientProps {
  zones: ShippingZone[];
  createAction: (data: Record<string, unknown>) => Promise<{ success?: boolean; error?: string }>;
  updateAction: (zoneId: string, data: Record<string, unknown>) => Promise<{ success?: boolean; error?: string }>;
  deleteAction: (zoneId: string) => Promise<{ success?: boolean; error?: string }>;
}

export default function ShippingPageClient({
  zones,
  createAction,
  updateAction,
  deleteAction,
}: ShippingPageClientProps) {
  const t = useTranslations("admin");
  const [isPending, startTransition] = useTransition();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [deletingZone, setDeletingZone] = useState<ShippingZone | null>(null);

  const handleCreate = async (data: Record<string, unknown>) => {
    const result = await createAction(data);
    if (result.error) {
      toast.error(result.error);
      return result;
    }
    toast.success("Zone de livraison créée");
    setShowCreateModal(false);
    return result;
  };

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editingZone) return { error: "No zone selected" };
    const result = await updateAction(editingZone.id, data);
    if (result.error) {
      toast.error(result.error);
      return result;
    }
    toast.success("Zone de livraison mise à jour");
    setEditingZone(null);
    return result;
  };

  const handleDelete = () => {
    if (!deletingZone) return;
    startTransition(async () => {
      const result = await deleteAction(deletingZone.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Zone de livraison supprimée");
      }
      setDeletingZone(null);
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t("shipping")}
        </h1>
        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Ajouter une zone
        </Button>
      </div>

      {/* Cards */}
      {zones.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg px-5 py-10 text-center text-text-muted">
          <Truck className="h-10 w-10 mx-auto mb-3 text-text-muted" />
          {t("noData")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-surface border border-border rounded-lg overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between p-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-md">
                    <MapPin className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-text-primary">
                      {zone.name}
                    </h3>
                    {zone.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        {t("active")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        {t("inactive")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingZone(zone)}
                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors rounded hover:bg-surface-light"
                    title={t("edit")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingZone(zone)}
                    className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                    title={t("delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-5 pb-5 space-y-3">
                {/* Countries */}
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Pays</p>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.countries.map((country) => (
                      <span
                        key={country}
                        className="inline-flex px-2 py-0.5 rounded text-xs bg-background border border-border text-text-secondary"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Delivery */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Prix</p>
                    <p className="text-sm text-text-primary font-medium">
                      {Number(zone.base_price).toFixed(2)} &euro;
                    </p>
                    {zone.free_shipping_threshold && (
                      <p className="text-xs text-green-500 mt-0.5">
                        Gratuit dès {Number(zone.free_shipping_threshold).toFixed(0)} &euro;
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Délai</p>
                    <div className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-text-muted" />
                      <p className="text-sm text-text-primary">
                        {zone.estimated_days_min}–{zone.estimated_days_max} jours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouvelle zone de livraison"
      >
        <ShippingZoneForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editingZone}
        onClose={() => setEditingZone(null)}
        title="Modifier la zone"
      >
        {editingZone && (
          <ShippingZoneForm
            initialData={editingZone}
            onSubmit={handleUpdate}
            onCancel={() => setEditingZone(null)}
            loading={isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingZone}
        onClose={() => setDeletingZone(null)}
        title="Supprimer la zone"
        description={`Êtes-vous sûr de vouloir supprimer la zone « ${deletingZone?.name} » ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        confirmVariant="danger"
        loading={isPending}
      />
    </div>
  );
}
