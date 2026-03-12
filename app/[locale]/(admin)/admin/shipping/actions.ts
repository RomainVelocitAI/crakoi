"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/activityLog";
import { shippingZoneSchema } from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function createShippingZone(data: Record<string, unknown>) {
  const { supabase, adminId } = await requireAdmin();

  const parsed = shippingZoneSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const zoneData = parsed.data;

  const { data: zone, error } = await supabase
    .from("shipping_zones")
    .insert({
      name: zoneData.name,
      countries: zoneData.countries,
      base_price: zoneData.base_price,
      free_shipping_threshold: zoneData.free_shipping_threshold ?? null,
      estimated_days_min: zoneData.estimated_days_min,
      estimated_days_max: zoneData.estimated_days_max,
      is_active: zoneData.is_active,
      display_order: zoneData.display_order,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "create", "shipping_zones", zone.id, {
    name: zoneData.name,
  });

  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function updateShippingZone(
  zoneId: string,
  data: Record<string, unknown>
) {
  const { supabase, adminId } = await requireAdmin();

  const parsed = shippingZoneSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const zoneData = parsed.data;

  const { error } = await supabase
    .from("shipping_zones")
    .update({
      name: zoneData.name,
      countries: zoneData.countries,
      base_price: zoneData.base_price,
      free_shipping_threshold: zoneData.free_shipping_threshold ?? null,
      estimated_days_min: zoneData.estimated_days_min,
      estimated_days_max: zoneData.estimated_days_max,
      is_active: zoneData.is_active,
      display_order: zoneData.display_order,
    })
    .eq("id", zoneId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "shipping_zones", zoneId, {
    name: zoneData.name,
  });

  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function deleteShippingZone(zoneId: string) {
  const { supabase, adminId } = await requireAdmin();

  const { data: zone } = await supabase
    .from("shipping_zones")
    .select("name")
    .eq("id", zoneId)
    .single();

  const { error } = await supabase
    .from("shipping_zones")
    .delete()
    .eq("id", zoneId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "delete", "shipping_zones", zoneId, {
    name: zone?.name,
  });

  revalidatePath("/admin/shipping");
  return { success: true };
}
