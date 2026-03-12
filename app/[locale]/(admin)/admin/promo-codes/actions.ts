"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/activityLog";
import { promoCodeSchema } from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

export async function createPromoCode(data: Record<string, unknown>) {
  const { supabase, adminId } = await requireAdmin();

  const parsed = promoCodeSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const promoData = parsed.data;

  const { data: promo, error } = await supabase
    .from("promo_codes")
    .insert({
      code: promoData.code,
      description: promoData.description || null,
      discount_type: promoData.discount_type,
      discount_value: promoData.discount_value,
      min_order_amount: promoData.min_order_amount ?? null,
      max_uses: promoData.max_uses ?? null,
      max_uses_per_customer: promoData.max_uses_per_customer ?? null,
      starts_at: promoData.starts_at || null,
      expires_at: promoData.expires_at || null,
      is_active: promoData.is_active,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "create", "promo_codes", promo.id, {
    code: promoData.code,
  });

  revalidatePath("/admin/promo-codes");
  return { success: true };
}

export async function updatePromoCode(
  promoId: string,
  data: Record<string, unknown>
) {
  const { supabase, adminId } = await requireAdmin();

  const parsed = promoCodeSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const promoData = parsed.data;

  const { error } = await supabase
    .from("promo_codes")
    .update({
      code: promoData.code,
      description: promoData.description || null,
      discount_type: promoData.discount_type,
      discount_value: promoData.discount_value,
      min_order_amount: promoData.min_order_amount ?? null,
      max_uses: promoData.max_uses ?? null,
      max_uses_per_customer: promoData.max_uses_per_customer ?? null,
      starts_at: promoData.starts_at || null,
      expires_at: promoData.expires_at || null,
      is_active: promoData.is_active,
    })
    .eq("id", promoId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "promo_codes", promoId, {
    code: promoData.code,
  });

  revalidatePath("/admin/promo-codes");
  return { success: true };
}

export async function deletePromoCode(promoId: string) {
  const { supabase, adminId } = await requireAdmin();

  const { data: promo } = await supabase
    .from("promo_codes")
    .select("code")
    .eq("id", promoId)
    .single();

  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("id", promoId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "delete", "promo_codes", promoId, {
    code: promo?.code,
  });

  revalidatePath("/admin/promo-codes");
  return { success: true };
}

export async function togglePromoCodeActive(
  promoId: string,
  isActive: boolean
) {
  const { supabase, adminId } = await requireAdmin();

  const { error } = await supabase
    .from("promo_codes")
    .update({ is_active: isActive })
    .eq("id", promoId);

  if (error) {
    return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "promo_codes", promoId, {
    is_active: isActive,
  });

  revalidatePath("/admin/promo-codes");
  return { success: true };
}
