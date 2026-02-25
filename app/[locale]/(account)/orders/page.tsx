import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft, ShoppingBag, ImageIcon } from "lucide-react";
import OrderItemsExpander from "@/components/account/OrderItemsExpander";

export async function generateMetadata() {
  const t = await getTranslations("account");
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

export default async function OrdersPage() {
  const supabase = await createServerClient();
  const t = await getTranslations("account");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
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
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToAccount")}
      </Link>

      {/* Page header */}
      <h1 className="font-serif text-3xl font-semibold text-white mb-10">
        {t("orders")}
      </h1>

      {/* Orders list */}
      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <p className="text-lg text-text-secondary mb-2">{t("noOrders")}</p>
          <p className="text-sm text-text-muted mb-6">{t("noOrdersSubtitle")}</p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-background text-sm font-medium rounded hover:bg-gold-light transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
            {t("browseGallery")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Date(order.created_at).toLocaleDateString(
              "fr-FR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );

            return (
              <div
                key={order.id}
                className="bg-surface border border-border rounded-lg p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-medium">
                      {order.order_number}
                    </p>
                    <p className="text-sm text-text-muted mt-0.5">
                      {t("orderDate")} {date}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <p className="text-white font-medium">
                      {Number(order.total).toFixed(2)} &euro;
                    </p>
                  </div>
                </div>

                {/* Expandable items */}
                {order.order_items && order.order_items.length > 0 && (
                  <OrderItemsExpander items={order.order_items} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
