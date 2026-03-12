"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/Button";
import { Save } from "lucide-react";

interface OrderNotesFormProps {
  orderId: string;
  initialNotes: string;
  onSave: (
    orderId: string,
    notes: string
  ) => Promise<{ success?: boolean; error?: string }>;
}

export default function OrderNotesForm({
  orderId,
  initialNotes,
  onSave,
}: OrderNotesFormProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await onSave(orderId, notes);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Notes mises à jour");
      }
    });
  };

  return (
    <div className="space-y-3">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Notes internes sur cette commande..."
        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:border-gold focus:ring-1 focus:ring-gold/50 placeholder:text-text-muted resize-y"
      />
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
