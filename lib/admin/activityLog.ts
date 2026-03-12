import type { SupabaseClient } from "@supabase/supabase-js";

export async function logAdminAction(
  supabase: SupabaseClient,
  adminId: string,
  action: string,
  tableName: string,
  recordId: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    await supabase.from("activity_log").insert({
      admin_id: adminId,
      action,
      table_name: tableName,
      record_id: recordId,
      details: details || {},
    });
  } catch {
    // Logging should never break the main operation
  }
}
