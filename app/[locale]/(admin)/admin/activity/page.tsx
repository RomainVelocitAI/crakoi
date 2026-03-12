import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: "Journal d'activité" };
}

const actionLabels: Record<string, string> = {
  create: "Création",
  update: "Modification",
  delete: "Suppression",
  reorder: "Réorganisation",
};

const tableLabels: Record<string, string> = {
  photos: "Photos",
  categories: "Catégories",
  orders: "Commandes",
  promo_codes: "Codes promo",
  shipping_zones: "Zones livraison",
  site_settings: "Paramètres",
  sizes: "Tailles",
  photo_variants: "Variantes",
};

function truncateDetails(details: Record<string, unknown> | null): string {
  if (!details || Object.keys(details).length === 0) return "—";
  const str = JSON.stringify(details);
  return str.length > 80 ? str.slice(0, 80) + "..." : str;
}

export default async function AdminActivityPage() {
  const supabase = await createServerClient();

  const { data: activities } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 49);

  const entries = activities || [];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-text-primary mb-8">
        Journal d&apos;activit&eacute;
      </h1>

      <div className="bg-surface border border-border rounded-lg">
        {entries.length === 0 ? (
          <div className="px-5 py-10 text-center text-text-muted">
            Aucune activit&eacute; enregistr&eacute;e
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-normal">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    Action
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    Table
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    ID
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    D&eacute;tails
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry: any) => {
                  const date = new Date(entry.created_at);
                  const dateStr = date.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const timeStr = date.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={entry.id}
                      className="border-b border-border/50 hover:bg-surface transition-colors"
                    >
                      <td className="px-5 py-3 text-text-muted whitespace-nowrap">
                        <div>{dateStr}</div>
                        <div className="text-xs">{timeStr}</div>
                      </td>
                      <td className="px-5 py-3">
                        <ActionBadge action={entry.action} />
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {tableLabels[entry.table_name] || entry.table_name}
                      </td>
                      <td className="px-5 py-3 text-text-muted font-mono text-xs">
                        {entry.record_id
                          ? entry.record_id.length > 8
                            ? entry.record_id.slice(0, 8) + "..."
                            : entry.record_id
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-text-muted text-xs max-w-xs truncate">
                        {truncateDetails(entry.details)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const statusMap: Record<string, string> = {
    create: "paid",
    update: "processing",
    delete: "cancelled",
    reorder: "shipped",
  };

  return (
    <StatusBadge
      status={statusMap[action] || "pending"}
      labels={{
        [statusMap[action] || "pending"]:
          actionLabels[action] || action,
      }}
    />
  );
}
