import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import SettingsPageClient from "@/components/admin/SettingsPageClient";
import { updateSettings } from "./actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("settings") };
}

export default async function AdminSettingsPage() {
  const supabase = await createServerClient();

  const { data: rows } = await supabase
    .from("site_settings")
    .select("key, value");

  const settings: Record<string, string> = {};
  if (rows) {
    for (const row of rows) {
      settings[row.key] = row.value;
    }
  }

  return <SettingsPageClient settings={settings} onSave={updateSettings} />;
}
