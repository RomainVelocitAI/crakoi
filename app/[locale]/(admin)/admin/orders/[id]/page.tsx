import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { Link } from "@/lib/i18n/navigation";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import OrderTrackingForm from "@/components/admin/OrderTrackingForm";
import OrderNotesForm from "@/components/admin/OrderNotesForm";
import {
  updateOrderStatus,
  updateOrderTracking,
  updateOrderNotes,
} from "../actions";

interface OrderDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

export async function generateMetadata({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_number")
    .eq("id", id)
    .single();

  return {
    title: order ? `Commande ${order.order_number}` : "Commande",
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createServerClient();
  const t = await getTranslations("admin");

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles(first_name, last_name, email, phone),
      order_items(
        id, photo_title, photo_slug, thumbnail_url, size_label,
        unit_price, quantity, line_total
      )
    `
    )
    .eq("id", id)
    .single();

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">Commande introuvable.</p>
        <Link
          href="/admin/orders"
          className="text-gold hover:text-gold-light mt-4 inline-block"
        >
          Retour aux commandes
        </Link>
      </div>
    );
  }

  const { data: activities } = await supabase
    .from("activity_log")
    .select("*")
    .eq("table_name", "orders")
    .eq("record_id", id)
    .order("created_at", { ascending: false });

  const orderDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const shippingAddress = order.shipping_address as Record<string, string> | null;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/orders"
          className="p-2 text-text-muted hover:text-text-primary transition-colors rounded hover:bg-surface"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-2xl font-semibold text-text-primary">
            {order.order_number}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{orderDate}</p>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-surface border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Statut actuel :</span>
            <StatusBadge status={order.status} labels={STATUS_LABELS} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Changer le statut :</span>
            <OrderStatusSelect
              orderId={order.id}
              currentStatus={order.status}
              onUpdateStatus={updateOrderStatus}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-4">
              Articles
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                    <th className="text-left pb-3 font-normal">Photo</th>
                    <th className="text-left pb-3 font-normal">Taille</th>
                    <th className="text-right pb-3 font-normal">Prix unit.</th>
                    <th className="text-right pb-3 font-normal">Qté</th>
                    <th className="text-right pb-3 font-normal">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.order_items || []).map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-border/50"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {item.thumbnail_url ? (
                            <div className="relative h-10 w-14 rounded overflow-hidden bg-background flex-shrink-0">
                              <Image
                                src={item.thumbnail_url}
                                alt={item.photo_title}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-14 rounded bg-background flex-shrink-0" />
                          )}
                          <span className="text-text-primary font-medium">
                            {item.photo_title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-text-secondary">
                        {item.size_label}
                      </td>
                      <td className="py-3 text-right text-text-secondary">
                        {Number(item.unit_price).toFixed(2)} &euro;
                      </td>
                      <td className="py-3 text-right text-text-secondary">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-text-primary font-medium">
                        {Number(item.line_total).toFixed(2)} &euro;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial summary */}
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Sous-total</span>
                <span className="text-text-secondary">
                  {Number(order.subtotal ?? order.total).toFixed(2)} &euro;
                </span>
              </div>
              {order.discount_amount && Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">
                    Réduction
                    {order.promo_code_used && (
                      <span className="ml-1 text-xs text-gold">
                        ({order.promo_code_used})
                      </span>
                    )}
                  </span>
                  <span className="text-red-400">
                    -{Number(order.discount_amount).toFixed(2)} &euro;
                  </span>
                </div>
              )}
              {order.shipping_cost != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Livraison</span>
                  <span className="text-text-secondary">
                    {Number(order.shipping_cost).toFixed(2)} &euro;
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                <span className="text-text-primary">Total</span>
                <span className="text-text-primary">
                  {Number(order.total).toFixed(2)} &euro;
                </span>
              </div>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-4">
              Historique
            </h2>
            {!activities || activities.length === 0 ? (
              <p className="text-sm text-text-muted">Aucune activité enregistrée.</p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity: any) => {
                  const activityDate = new Date(
                    activity.created_at
                  ).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const details = activity.details as Record<string, unknown> | null;
                  let description = `${activity.action}`;
                  if (details?.field === "status") {
                    description = `Statut : ${details.old_status} → ${details.new_status}`;
                  } else if (details?.field === "tracking") {
                    description = `Suivi mis à jour : ${details.tracking_number || "—"}`;
                  } else if (details?.field === "notes") {
                    description = "Notes mises à jour";
                  }

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Clock className="h-4 w-4 text-text-muted mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-text-secondary">{description}</p>
                        <p className="text-xs text-text-muted">{activityDate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-4">
              Client
            </h2>
            <div className="space-y-2 text-sm">
              {order.profiles && (
                <>
                  <p className="text-text-primary font-medium">
                    {[order.profiles.first_name, order.profiles.last_name]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </p>
                  <p className="text-text-secondary">{order.profiles.email}</p>
                  {order.profiles.phone && (
                    <p className="text-text-muted">{order.profiles.phone}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Shipping address */}
          {shippingAddress && (
            <div className="bg-surface border border-border rounded-lg p-5">
              <h2 className="font-serif text-lg font-semibold text-text-primary mb-4">
                Adresse de livraison
              </h2>
              <div className="space-y-1 text-sm text-text-secondary">
                <p className="text-text-primary font-medium">
                  {[shippingAddress.first_name, shippingAddress.last_name]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.postal_code} {shippingAddress.city}
                </p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phone && (
                  <p className="text-text-muted">{shippingAddress.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Tracking */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-4">
              Suivi de livraison
            </h2>
            <OrderTrackingForm
              orderId={order.id}
              initialTrackingNumber={order.tracking_number || ""}
              initialTrackingUrl={order.tracking_url || ""}
              onSave={updateOrderTracking}
            />
            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light mt-3 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Voir le suivi
              </a>
            )}
          </div>

          {/* Notes */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-serif text-lg font-semibold text-text-primary mb-4">
              Notes internes
            </h2>
            <OrderNotesForm
              orderId={order.id}
              initialNotes={order.notes || ""}
              onSave={updateOrderNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
