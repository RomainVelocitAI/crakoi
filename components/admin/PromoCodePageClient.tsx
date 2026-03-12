"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Tag, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import PromoCodeForm from "@/components/admin/PromoCodeForm";
import { toast } from "sonner";

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  max_uses_per_customer: number | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface PromoCodePageClientProps {
  promoCodes: PromoCode[];
  createAction: (data: Record<string, unknown>) => Promise<{ success?: boolean; error?: string }>;
  updateAction: (promoId: string, data: Record<string, unknown>) => Promise<{ success?: boolean; error?: string }>;
  deleteAction: (promoId: string) => Promise<{ success?: boolean; error?: string }>;
  toggleActiveAction: (promoId: string, isActive: boolean) => Promise<{ success?: boolean; error?: string }>;
}

export default function PromoCodePageClient({
  promoCodes,
  createAction,
  updateAction,
  deleteAction,
  toggleActiveAction,
}: PromoCodePageClientProps) {
  const t = useTranslations("admin");
  const [isPending, startTransition] = useTransition();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<PromoCode | null>(null);

  const handleCreate = async (data: Record<string, unknown>) => {
    const result = await createAction(data);
    if (result.error) {
      toast.error(result.error);
      return result;
    }
    toast.success("Code promo créé");
    setShowCreateModal(false);
    return result;
  };

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editingPromo) return { error: "No promo selected" };
    const result = await updateAction(editingPromo.id, data);
    if (result.error) {
      toast.error(result.error);
      return result;
    }
    toast.success("Code promo mis à jour");
    setEditingPromo(null);
    return result;
  };

  const handleDelete = () => {
    if (!deletingPromo) return;
    startTransition(async () => {
      const result = await deleteAction(deletingPromo.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Code promo supprimé");
      }
      setDeletingPromo(null);
    });
  };

  const handleToggleActive = (promo: PromoCode) => {
    startTransition(async () => {
      const result = await toggleActiveAction(promo.id, !promo.is_active);
      if (result.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t("promoCodes")}
        </h1>
        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {promoCodes.length === 0 ? (
          <div className="px-5 py-10 text-center text-text-muted">
            <Tag className="h-10 w-10 mx-auto mb-3 text-text-muted" />
            {t("noData")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-normal">{t("promoCode")}</th>
                  <th className="text-left px-5 py-3 font-normal">{t("discountType")}</th>
                  <th className="text-left px-5 py-3 font-normal">{t("discountValue")}</th>
                  <th className="text-left px-5 py-3 font-normal">{t("usageCount")}</th>
                  <th className="text-left px-5 py-3 font-normal">{t("status")}</th>
                  <th className="text-right px-5 py-3 font-normal">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((promo) => {
                  const isExpired = promo.expires_at
                    ? new Date(promo.expires_at) < new Date()
                    : false;
                  const isMaxedOut = promo.max_uses
                    ? promo.current_uses >= promo.max_uses
                    : false;
                  const effectivelyActive = promo.is_active && !isExpired && !isMaxedOut;

                  const typeLabel =
                    promo.discount_type === "percentage" ? t("percentage") : t("fixedAmount");
                  const valueDisplay =
                    promo.discount_type === "percentage"
                      ? `${Number(promo.discount_value)}%`
                      : `${Number(promo.discount_value).toFixed(2)} \u20AC`;
                  const usageDisplay = promo.max_uses
                    ? `${promo.current_uses} / ${promo.max_uses}`
                    : `${promo.current_uses}`;

                  return (
                    <tr
                      key={promo.id}
                      className="border-b border-border/50 hover:bg-surface transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="text-text-primary font-mono text-sm font-medium">
                          {promo.code}
                        </span>
                        {promo.description && (
                          <p className="text-xs text-text-muted mt-0.5">{promo.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-text-secondary">{typeLabel}</td>
                      <td className="px-5 py-3 text-text-primary font-medium">{valueDisplay}</td>
                      <td className="px-5 py-3 text-text-secondary">{usageDisplay}</td>
                      <td className="px-5 py-3">
                        <Toggle
                          checked={promo.is_active}
                          onChange={() => handleToggleActive(promo)}
                          disabled={isPending}
                        />
                        {!effectivelyActive && promo.is_active && (
                          <span className="text-xs text-amber-400 ml-2">
                            {isExpired ? "Expiré" : "Épuisé"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingPromo(promo)}
                            className="p-1.5 text-text-muted hover:text-text-primary transition-colors rounded hover:bg-surface-light"
                            title={t("edit")}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingPromo(promo)}
                            className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                            title={t("delete")}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* Create Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouveau code promo"
      >
        <PromoCodeForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editingPromo}
        onClose={() => setEditingPromo(null)}
        title="Modifier le code promo"
      >
        {editingPromo && (
          <PromoCodeForm
            initialData={editingPromo}
            onSubmit={handleUpdate}
            onCancel={() => setEditingPromo(null)}
            loading={isPending}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingPromo}
        onClose={() => setDeletingPromo(null)}
        title="Supprimer le code promo"
        description={`Êtes-vous sûr de vouloir supprimer le code « ${deletingPromo?.code} » ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        confirmVariant="danger"
        loading={isPending}
      />
    </div>
  );
}
