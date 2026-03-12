import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

const STATUS_FILTERS = [
  { value: "all", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payées" },
  { value: "processing", label: "En préparation" },
  { value: "shipped", label: "Expédiées" },
  { value: "delivered", label: "Livrées" },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("orders") };
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { status: statusFilter } = await searchParams;
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  let query = supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      total,
      created_at,
      profiles(first_name, last_name, email),
      order_items(
        id,
        photo_title,
        size_label,
        unit_price,
        quantity,
        line_total
      )
    `
    )
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: orders } = await query;

  const activeFilter = statusFilter || "all";

  return (
    <div>
      {/* Header */}
      <h1 className="font-serif text-2xl font-semibold text-text-primary mb-6">
        {t("orders")}
      </h1>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "all"
                ? "/admin/orders"
                : `/admin/orders?status=${filter.value}`
            }
            className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
              activeFilter === filter.value
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-text-muted hover:text-text-primary hover:bg-surface border border-transparent"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {!orders || orders.length === 0 ? (
          <div className="px-5 py-10 text-center text-text-muted">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-text-muted" />
            {t("noData")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-normal">
                    {t("orderNumber")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("customer")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("date")}
                  </th>
                  <th className="text-left px-5 py-3 font-normal">
                    {t("status")}
                  </th>
                  <th className="text-right px-5 py-3 font-normal">
                    {t("total")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => {
                  const date = new Date(order.created_at).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  );

                  const customerEmail = order.profiles?.email || "—";
                  const customerName = order.profiles
                    ? [order.profiles.first_name, order.profiles.last_name]
                        .filter(Boolean)
                        .join(" ")
                    : "";

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border/50 hover:bg-surface transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-text-primary font-medium hover:text-gold transition-colors"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        {customerName && (
                          <p className="text-text-primary text-sm">
                            {customerName}
                          </p>
                        )}
                        <p className="text-text-muted text-xs">
                          {customerEmail}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-text-muted">{date}</td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={order.status}
                          labels={STATUS_LABELS}
                        />
                      </td>
                      <td className="px-5 py-3 text-right text-text-primary font-medium">
                        {Number(order.total).toFixed(2)} &euro;
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
