"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const t = useTranslations("account");
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans text-text-muted hover:text-white border border-border hover:border-text-muted rounded transition-colors"
    >
      <LogOut className="h-4 w-4" />
      {t("logout")}
    </button>
  );
}
