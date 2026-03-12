"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promoCodeSchema } from "@/lib/validations/admin";
import type { z } from "zod";

type PromoCodeInput = z.input<typeof promoCodeSchema>;
import { Button } from "@/components/admin/ui/Button";
import { Toggle } from "@/components/admin/ui/Toggle";
import { cn } from "@/lib/utils/cn";

interface PromoCodeFormProps {
  initialData?: any;
  onSubmit: (data: Record<string, unknown>) => Promise<{ success?: boolean; error?: string }>;
  onCancel: () => void;
  loading?: boolean;
}

const inputClass =
  "w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/50 focus:outline-none placeholder:text-text-muted transition-colors";

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
    <label htmlFor={htmlFor} className="block text-sm font-sans text-text-secondary mb-1.5">
      {label}
      {optional && <span className="text-text-muted ml-1 text-xs">(optionnel)</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400 mt-1">{message}</p>;
}

export default function PromoCodeForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: PromoCodeFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PromoCodeInput>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: initialData?.code || "",
      description: initialData?.description || "",
      discount_type: initialData?.discount_type || "percentage",
      discount_value: initialData?.discount_value || 0,
      min_order_amount: initialData?.min_order_amount ?? null,
      max_uses: initialData?.max_uses ?? null,
      max_uses_per_customer: initialData?.max_uses_per_customer ?? null,
      starts_at: initialData?.starts_at
        ? initialData.starts_at.slice(0, 16)
        : null,
      expires_at: initialData?.expires_at
        ? initialData.expires_at.slice(0, 16)
        : null,
      is_active: initialData?.is_active ?? true,
    },
  });

  const watchDiscountType = watch("discount_type");

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data as Record<string, unknown>);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Code */}
      <div>
        <FieldLabel label="Code promo" htmlFor="code" />
        <input
          id="code"
          {...register("code")}
          className={cn(inputClass, "font-mono uppercase")}
          placeholder="SUMMER2024"
        />
        <FieldError message={errors.code?.message} />
      </div>

      {/* Description */}
      <div>
        <FieldLabel label="Description" htmlFor="description" optional />
        <input
          id="description"
          {...register("description")}
          className={inputClass}
          placeholder="Description interne..."
        />
      </div>

      {/* Discount Type */}
      <div>
        <FieldLabel label="Type de remise" />
        <div className="flex gap-4 mt-1">
          <label
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm",
              watchDiscountType === "percentage"
                ? "border-gold/40 bg-gold/5 text-text-primary"
                : "border-border bg-background text-text-secondary hover:border-border"
            )}
          >
            <input
              type="radio"
              value="percentage"
              {...register("discount_type")}
              className="sr-only"
            />
            <span
              className={cn(
                "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0",
                watchDiscountType === "percentage"
                  ? "border-gold"
                  : "border-border"
              )}
            >
              {watchDiscountType === "percentage" && (
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              )}
            </span>
            Pourcentage (%)
          </label>
          <label
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm",
              watchDiscountType === "fixed_amount"
                ? "border-gold/40 bg-gold/5 text-text-primary"
                : "border-border bg-background text-text-secondary hover:border-border"
            )}
          >
            <input
              type="radio"
              value="fixed_amount"
              {...register("discount_type")}
              className="sr-only"
            />
            <span
              className={cn(
                "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0",
                watchDiscountType === "fixed_amount"
                  ? "border-gold"
                  : "border-border"
              )}
            >
              {watchDiscountType === "fixed_amount" && (
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              )}
            </span>
            Montant fixe (&euro;)
          </label>
        </div>
      </div>

      {/* Discount Value */}
      <div>
        <FieldLabel
          label={watchDiscountType === "percentage" ? "Valeur (%)" : "Valeur (€)"}
          htmlFor="discount_value"
        />
        <input
          id="discount_value"
          type="number"
          min="0"
          step={watchDiscountType === "percentage" ? "1" : "0.01"}
          {...register("discount_value")}
          className={cn(inputClass, "w-40")}
          placeholder="0"
        />
        <FieldError message={errors.discount_value?.message} />
      </div>

      {/* Min Order Amount */}
      <div>
        <FieldLabel label="Montant minimum de commande (€)" htmlFor="min_order_amount" optional />
        <input
          id="min_order_amount"
          type="number"
          min="0"
          step="0.01"
          {...register("min_order_amount")}
          className={cn(inputClass, "w-40")}
          placeholder="—"
        />
      </div>

      {/* Usage Limits */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel label="Utilisations max (total)" htmlFor="max_uses" optional />
          <input
            id="max_uses"
            type="number"
            min="0"
            {...register("max_uses")}
            className={inputClass}
            placeholder="Illimité"
          />
        </div>
        <div>
          <FieldLabel label="Max par client" htmlFor="max_uses_per_customer" optional />
          <input
            id="max_uses_per_customer"
            type="number"
            min="0"
            {...register("max_uses_per_customer")}
            className={inputClass}
            placeholder="Illimité"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel label="Début de validité" htmlFor="starts_at" optional />
          <input
            id="starts_at"
            type="datetime-local"
            {...register("starts_at")}
            className={inputClass}
          />
        </div>
        <div>
          <FieldLabel label="Fin de validité" htmlFor="expires_at" optional />
          <input
            id="expires_at"
            type="datetime-local"
            {...register("expires_at")}
            className={inputClass}
          />
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm text-text-primary">Actif</p>
          <p className="text-xs text-text-muted">Le code peut être utilisé par les clients</p>
        </div>
        <Toggle
          checked={watch("is_active") ?? true}
          onChange={(v) => setValue("is_active", v)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" size="sm" loading={loading}>
          {initialData ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
