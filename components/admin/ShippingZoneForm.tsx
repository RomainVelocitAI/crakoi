"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingZoneSchema } from "@/lib/validations/admin";
import type { z } from "zod";

type ShippingZoneInput = z.input<typeof shippingZoneSchema>;
import { Button } from "@/components/admin/ui/Button";
import { Toggle } from "@/components/admin/ui/Toggle";
import { cn } from "@/lib/utils/cn";

interface ShippingZoneFormProps {
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

export default function ShippingZoneForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: ShippingZoneFormProps) {
  const [countriesInput, setCountriesInput] = useState(
    initialData?.countries?.join(", ") || ""
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingZoneInput>({
    resolver: zodResolver(shippingZoneSchema),
    defaultValues: {
      name: initialData?.name || "",
      countries: initialData?.countries || [],
      base_price: initialData?.base_price ?? 0,
      free_shipping_threshold: initialData?.free_shipping_threshold ?? null,
      estimated_days_min: initialData?.estimated_days_min ?? 3,
      estimated_days_max: initialData?.estimated_days_max ?? 7,
      is_active: initialData?.is_active ?? true,
      display_order: initialData?.display_order ?? 0,
    },
  });

  const handleCountriesChange = (value: string) => {
    setCountriesInput(value);
    const countries = value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    setValue("countries", countries, { shouldValidate: true });
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data as Record<string, unknown>);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <FieldLabel label="Nom de la zone" htmlFor="zone-name" />
        <input
          id="zone-name"
          {...register("name")}
          className={inputClass}
          placeholder="France Métropolitaine"
        />
        <FieldError message={errors.name?.message} />
      </div>

      {/* Countries */}
      <div>
        <FieldLabel label="Pays" htmlFor="countries" />
        <input
          id="countries"
          value={countriesInput}
          onChange={(e) => handleCountriesChange(e.target.value)}
          className={inputClass}
          placeholder="France, Belgique, Suisse (séparés par des virgules)"
        />
        <p className="text-xs text-text-muted mt-1">Séparez les pays par des virgules</p>
        <FieldError message={errors.countries?.message} />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel label="Prix de base (€)" htmlFor="base_price" />
          <input
            id="base_price"
            type="number"
            min="0"
            step="0.01"
            {...register("base_price")}
            className={inputClass}
            placeholder="0"
          />
          <FieldError message={errors.base_price?.message} />
        </div>
        <div>
          <FieldLabel label="Seuil livraison gratuite (€)" htmlFor="free_threshold" optional />
          <input
            id="free_threshold"
            type="number"
            min="0"
            step="0.01"
            {...register("free_shipping_threshold")}
            className={inputClass}
            placeholder="—"
          />
        </div>
      </div>

      {/* Delivery Estimate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel label="Délai min (jours)" htmlFor="days_min" />
          <input
            id="days_min"
            type="number"
            min="1"
            {...register("estimated_days_min")}
            className={inputClass}
            placeholder="3"
          />
          <FieldError message={errors.estimated_days_min?.message} />
        </div>
        <div>
          <FieldLabel label="Délai max (jours)" htmlFor="days_max" />
          <input
            id="days_max"
            type="number"
            min="1"
            {...register("estimated_days_max")}
            className={inputClass}
            placeholder="7"
          />
          <FieldError message={errors.estimated_days_max?.message} />
        </div>
      </div>

      {/* Display Order */}
      <div>
        <FieldLabel label="Ordre d'affichage" htmlFor="display_order" />
        <input
          id="display_order"
          type="number"
          min="0"
          {...register("display_order")}
          className={cn(inputClass, "w-24")}
          placeholder="0"
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm text-text-primary">Active</p>
          <p className="text-xs text-text-muted">Zone disponible au checkout</p>
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
