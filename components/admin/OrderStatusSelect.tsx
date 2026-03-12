"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payée" },
  { value: "processing", label: "En préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
  { value: "refunded", label: "Remboursée" },
];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  onUpdateStatus: (
    orderId: string,
    status: string
  ) => Promise<{ success?: boolean; error?: string }>;
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  onUpdateStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const oldStatus = status;
    setStatus(newStatus);

    startTransition(async () => {
      const result = await onUpdateStatus(orderId, newStatus);
      if (result.error) {
        setStatus(oldStatus);
        toast.error(result.error);
      } else {
        toast.success("Statut mis à jour");
      }
    });
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/50 disabled:opacity-50 cursor-pointer"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
