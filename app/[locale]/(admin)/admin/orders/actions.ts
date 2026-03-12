"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/activityLog";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export async function updateOrderStatus(orderId: string, status: string) {
  const { supabase, adminId } = await requireAdmin();

  if (!VALID_STATUSES.includes(status)) {
    return { error: `Statut invalide : ${status}` };
  }

  // Get current status for logging
  const { data: current } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (!current) {
    return { error: "Commande introuvable" };
  }

  const oldStatus = current.status;

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "orders", orderId, {
    field: "status",
    old_status: oldStatus,
    new_status: status,
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updateOrderTracking(
  orderId: string,
  data: { tracking_number: string; tracking_url: string }
) {
  const { supabase, adminId } = await requireAdmin();

  const { error } = await supabase
    .from("orders")
    .update({
      tracking_number: data.tracking_number || null,
      tracking_url: data.tracking_url || null,
    })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "orders", orderId, {
    field: "tracking",
    tracking_number: data.tracking_number,
    tracking_url: data.tracking_url,
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updateOrderNotes(orderId: string, notes: string) {
  const { supabase, adminId } = await requireAdmin();

  const { error } = await supabase
    .from("orders")
    .update({ notes: notes || null })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "orders", orderId, {
    field: "notes",
  });

  revalidatePath("/admin/orders");
  return { success: true };
}
