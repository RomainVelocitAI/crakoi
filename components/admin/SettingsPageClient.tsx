"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/admin/ui/Button";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface SettingsPageClientProps {
  settings: Record<string, string>;
  onSave: (
    settings: Record<string, string>
  ) => Promise<{ success?: boolean; error?: string }>;
}

const SETTING_FIELDS = [
  {
    group: "Général",
    fields: [
      { key: "site_name", label: "Nom du site", type: "text", placeholder: "Crackoï" },
      { key: "currency", label: "Devise", type: "text", placeholder: "EUR" },
    ],
  },
  {
    group: "Contact",
    fields: [
      { key: "contact_email", label: "Email de contact", type: "text", placeholder: "contact@crackoi.com" },
      { key: "phone", label: "Téléphone", type: "text", placeholder: "+262 6XX XX XX XX" },
    ],
  },
  {
    group: "Réseaux sociaux",
    fields: [
      { key: "instagram_url", label: "Instagram", type: "text", placeholder: "https://instagram.com/..." },
      { key: "facebook_url", label: "Facebook", type: "text", placeholder: "https://facebook.com/..." },
    ],
  },
];

export default function SettingsPageClient({
  settings,
  onSave,
}: SettingsPageClientProps) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const state: Record<string, string> = {};
    for (const group of SETTING_FIELDS) {
      for (const field of group.fields) {
        state[field.key] = settings[field.key] || "";
      }
    }
    return state;
  });
  const [isPending, startTransition] = useTransition();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await onSave(form);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Paramètres enregistrés");
      }
    });
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-text-primary mb-8">
        Paramètres
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {SETTING_FIELDS.map((group) => (
            <div
              key={group.group}
              className="bg-surface border border-border rounded-lg p-6"
            >
              <h2 className="font-serif text-lg font-medium text-text-primary mb-5">
                {group.group}
              </h2>
              <div className="space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={field.key}
                      className="block text-sm font-medium text-text-secondary mb-1.5"
                    >
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.key}
                        value={form[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none resize-vertical"
                      />
                    ) : (
                      <input
                        id={field.key}
                        type="text"
                        value={form[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" loading={isPending}>
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
