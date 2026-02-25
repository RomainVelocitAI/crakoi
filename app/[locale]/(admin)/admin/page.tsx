import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/lib/i18n/navigation";
import {
  Camera,
  ShoppingBag,
  Clock,
  CreditCard,
  PackageCheck,
  TrendingUp,
} from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("dashboard") };
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-md ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
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

export default async function AdminDashboardPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  // Fetch counts in parallel
  const [photosRes, ordersRes, pendingRes, paidRes, processingRes, recentRes] =
    await Promise.all([
      supabase
        .from("photos")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "paid"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "processing"),
      supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          status,
          total,
          created_at,
          profiles(first_name, last_name, email)
        `
        )
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const totalPhotos = photosRes.count || 0;
  const totalOrders = ordersRes.count || 0;
  const pendingOrders = pendingRes.count || 0;
  const paidOrders = paidRes.count || 0;
  const processingOrders = processingRes.count || 0;
  const recentOrders = recentRes.data || [];

  // Calculate revenue from paid/processing/shipped/delivered orders
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .in("status", ["paid", "processing", "shipped", "delivered"]);

  const revenue = (revenueData || []).reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-white mb-8">
        {t("dashboard")}
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        <StatCard
          icon={Camera}
          label={t("totalPhotos")}
          value={totalPhotos}
          color="bg-gold/10 text-gold"
        />
        <StatCard
          icon={ShoppingBag}
          label={t("totalOrders")}
          value={totalOrders}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={Clock}
          label={t("pendingOrders")}
          value={pendingOrders}
          color="bg-yellow-500/10 text-yellow-400"
        />
        <StatCard
          icon={CreditCard}
          label={t("paidOrders")}
          value={paidOrders}
          color="bg-green-500/10 text-green-400"
        />
        <StatCard
          icon={PackageCheck}
          label={t("processingOrders")}
          value={processingOrders}
          color="bg-purple-500/10 text-purple-400"
        />
        <StatCard
          icon={TrendingUp}
          label={t("revenue")}
          value={`${revenue.toFixed(2)} \u20AC`}
          color="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-serif text-lg font-medium text-white">
            {t("recentOrders")}
          </h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-10 text-center text-text-muted">
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
                {recentOrders.map((order: any) => {
                  const date = new Date(order.created_at).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  );

                  const customerName = order.profiles
                    ? [order.profiles.first_name, order.profiles.last_name]
                        .filter(Boolean)
                        .join(" ") || order.profiles.email
                    : "—";

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/orders`}
                          className="text-white hover:text-gold transition-colors"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {customerName}
                      </td>
                      <td className="px-5 py-3 text-text-muted">{date}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-3 text-right text-white">
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
