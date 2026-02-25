import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { ShoppingBag } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("orders") };
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    paid: "bg-green-500/10 text-green-500 border-green-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        colors[status] || colors.pending
      }`}
    >
      {status}
    </span>
  );
}

export default async function AdminOrdersPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const { data: orders } = await supabase
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

  return (
    <div>
      {/* Header */}
      <h1 className="font-serif text-2xl font-semibold text-white mb-8">
        {t("orders")}
      </h1>

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
                      className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="text-white font-medium">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {customerName && (
                          <p className="text-white text-sm">{customerName}</p>
                        )}
                        <p className="text-text-muted text-xs">
                          {customerEmail}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-text-muted">{date}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-3 text-right text-white font-medium">
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
