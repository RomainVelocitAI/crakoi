"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/Button";
import { Save } from "lucide-react";

interface OrderTrackingFormProps {
  orderId: string;
  initialTrackingNumber: string;
  initialTrackingUrl: string;
  onSave: (
    orderId: string,
    data: { tracking_number: string; tracking_url: string }
  ) => Promise<{ success?: boolean; error?: string }>;
}

export default function OrderTrackingForm({
  orderId,
  initialTrackingNumber,
  initialTrackingUrl,
  onSave,
}: OrderTrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await onSave(orderId, {
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Suivi mis à jour");
      }
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-text-muted mb-1">
          Numéro de suivi
        </label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Ex: 1Z999AA10123456784"
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/50 placeholder:text-text-muted"
        />
      </div>
      <div>
        <label className="block text-xs text-text-muted mb-1">
          URL de suivi
        </label>
        <input
          type="url"
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          placeholder="https://..."
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/50 placeholder:text-text-muted"
        />
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleSave}
        loading={isPending}
      >
        <Save className="h-3.5 w-3.5" />
        Enregistrer
      </Button>
    </div>
  );
}
