"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/activityLog";
import { revalidatePath } from "next/cache";

export async function updateSettings(settings: Record<string, string>) {
  const { supabase, adminId } = await requireAdmin();

  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) return { error: error.message };
  }

  await logAdminAction(supabase, adminId, "update", "site_settings", "all", {
    keys: Object.keys(settings),
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
